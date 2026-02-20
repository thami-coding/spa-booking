from fastapi import APIRouter
from fastapi import HTTPException, Body, Request, status
from fastapi.responses import JSONResponse
from schemas.auth import UserReg
from core.security import AuthHandler
from schemas.auth import AuthResponse
from schemas.auth import UserIn

router = APIRouter()
auth_handler = AuthHandler()


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
    role = document.get("role")

    isRegistered = await request.app.state.db.users.find_one({"email": email})

    if isRegistered:
        raise HTTPException(status_code=409, detail="email is already registered")

    if role is None or role != "admin":
        document["role"] = "user"

    document.pop("confirm_password")
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

    if (user is None) or (
        not auth_handler.verify_password(loginUser.password, user["password"])
    ):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = auth_handler.encode_token(str(user["_id"]), user["role"])
    response = JSONResponse(content={"access_token": token})

    return response
