from fastapi import APIRouter, Response, status
from fastapi import HTTPException, Body, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from app.models.user import User
from app.schemas.auth import UserReg
from app.core.security import AuthHandler
from app.schemas.auth import AuthResponse
from app.schemas.auth import UserIn
from app.config import BaseConfig
from app.core.roles import Role

router = APIRouter()
auth_handler = AuthHandler()
environment = BaseConfig().ENVIRONMENT 
isProduction = environment == "Production"


@router.post(
    "/register",
    response_description="Register user",
    response_model=AuthResponse,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def register(request: Request, newUser: UserReg = Body(...)):
    document = newUser.model_dump()

    email = document["email"]
    password = document["password"]
    isRegistered = await request.app.state.db.users.find_one({"email": email})

    if isRegistered:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email is already registered"
        )

    document.pop("confirm_password")
    document["role"] = Role.USER.value
    document["password"] = auth_handler.get_password_hash(password)
    result = await request.app.state.db.users.insert_one(document)
    user = await request.app.state.db.users.find_one(
        {"_id": result.inserted_id}, {"role": 1, "_id": 1}
    )

    return user


@router.post("/login", response_description="Login user")
async def login(request: Request, loginUser: UserIn = Body(...)):
    document = loginUser.model_dump()
    email = document["email"]
    user = await request.app.state.db.users.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    user_model = User(**user)
    user_clean = jsonable_encoder(user_model, by_alias=False)
    isPasswordValid = auth_handler.verify_password(loginUser.password, user["password"])
    
    if not isPasswordValid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    token = auth_handler.encode_token(str(user["_id"]), user["role"])
    response = JSONResponse(content={"access_token": token, "user": user_clean})
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
