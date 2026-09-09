from fastapi import APIRouter
from fastapi import APIRouter, Body, HTTPException, Request, Depends

from app.lib.validate_objectId import get_valid_object_id
from app.schemas.user import UserResponse
from app.core.security import AuthHandler

router = APIRouter()
auth_handler = AuthHandler()


@router.get(
    "/me",
    response_description="User retrieved successfully",
    response_model_by_alias=True,
    response_model=UserResponse,
)
async def get_user(request: Request, user_data=Depends(auth_handler.auth_wrapper)):
    user_id = get_valid_object_id(user_data["user_id"])
    user = await request.app.state.db.users.find_one(
        {"_id": user_id}, {"password": 0}
    )
    print(user)
    return  UserResponse(**user)


@router.get("/")
async def get_all_users():
    return {"message": "All users here"}
