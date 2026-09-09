from pydantic import BaseModel, Field, EmailStr, ValidationInfo, field_validator
from pydantic import BeforeValidator, ConfigDict, BaseModel, Field, EmailStr
from typing import Annotated, Optional
from pydantic.alias_generators import to_camel, to_snake
from pydantic_core import PydanticCustomError

from app.core.roles import Role

PyObjectId = Annotated[str, BeforeValidator(str)]


class User(BaseModel):
    id: PyObjectId = Field(
        ...,
        validation_alias="_id",
        serialization_alias="id",
    )
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    phone: Optional[str] = ""
    role: Role = Field(...)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class UserLogin(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)


class UserReg(BaseModel):
    full_name: str = Field(..., min_length=5, max_length=50)
    email: EmailStr = Field(...)
    phone: str = Field(...)
    password: str = Field(...)
    confirm_password: str = Field(...)

    model_config = {
        "alias_generator": to_snake,
        "populate_by_name": True,
    }

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info: ValidationInfo) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise PydanticCustomError(
                "password_mismatch",
                "Passwords do not match",
            )
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Phone number must be exactly 10 digits")
        return v


class LoginResponse(BaseModel):
    access_token: str = Field(...)
    user: Optional[User] = Field(default=None)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )


class RegisterResponse(BaseModel):
    id: PyObjectId = Field(
        ...,
        validation_alias="_id",
        serialization_alias="id",
    )
    full_name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr = Field(...)
    phone: Optional[str] = ""
    role: Role = Field(...)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )
