from fastapi import APIRouter, Response, status, HTTPException, Body, Request, status
from fastapi.responses import JSONResponse

from app.schemas.user import UserResponse
from app.schemas.auth import UserReg, LoginResponse, UserLogin, RegisterResponse
from app.core.security import AuthHandler
from app.schemas.auth import UserLogin, UserReg
from app.config import BaseConfig
from app.core.roles import Role
from app.lib.errors import AppException

router = APIRouter()
auth_handler = AuthHandler()
environment = BaseConfig().ENVIRONMENT
isProduction = environment == "Production"


@router.post(
    "/register",
    response_description="Register user",
    response_model=RegisterResponse,
    response_model_by_alias=True,
    status_code=status.HTTP_201_CREATED,
)
async def register(request: Request, userReg: UserReg = Body(...)):
    user_dict = userReg.model_dump()
    email = user_dict["email"]
    password = user_dict["password"]
    existing_user = await request.app.state.db.users.find_one({"email": email})

    if existing_user is not None:
        raise AppException(
            message="email is already registered",
            status_code=status.HTTP_409_CONFLICT,
            field="email",
        )

    user_dict.pop("confirm_password")
    user_dict["role"] = Role.USER.value
    user_dict["password"] = auth_handler.get_password_hash(password)

    result = await request.app.state.db.users.insert_one(user_dict)
    user = await request.app.state.db.users.find_one(
        {"_id": result.inserted_id}, {"password": 0,}
    )
   
    return RegisterResponse(**user)


@router.post("/login", response_description="Login user")
async def login(request: Request, userLogin: UserLogin = Body(...)):
    user_dict = userLogin.model_dump()
    email = user_dict["email"]
    password = user_dict["password"]

    user = await request.app.state.db.users.find_one(
        {"email": email}
    )

    if user is None:
        raise AppException(
            message="Invalid username or password",
            status_code=status.HTTP_401_UNAUTHORIZED,
            field="password",
        )

    is_password_valid = auth_handler.verify_password(password, user["password"])

    if not is_password_valid:
        raise AppException(
            message="Invalid username or password",
            status_code=status.HTTP_401_UNAUTHORIZED,
            field="password",
        )

    token = auth_handler.encode_token(str(user["_id"]), user["role"])
    print(user)
    login_response_model = LoginResponse(access_token=token, user=user)
    login_data = login_response_model.model_dump(by_alias=True)

    response = JSONResponse(
        content={"accessToken": login_data["accessToken"], "user": login_data["user"]}
    )
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=isProduction,
        samesite="none" if isProduction else "lax",
    )

    return response


@router.post("/logout", response_description="Logout user")
async def logout(request: Request):
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=isProduction,
        samesite="none" if isProduction else "lax",
    )

    return response
