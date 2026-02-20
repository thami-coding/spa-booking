from fastapi import APIRouter
from fastapi import APIRouter, Body, HTTPException, Request, Depends
from models.user import User
from bson import ObjectId
from core.security import AuthHandler

router = APIRouter()

auth_handler = AuthHandler()


@router.get(
    "/me",
    response_model=User,
    response_description="User retrieved successfully",
    response_model_by_alias=False,
)
async def get_user(request: Request, user_data=Depends(auth_handler.auth_wrapper)):
    user_id = ObjectId(user_data["user_id"])
    user = await request.app.state.db.users.find_one({"_id": user_id}, {"password": 0})
    print(user)
    return User(**user)


@router.get("/")
async def get_all_users():
    return {"message": "All users here"}
