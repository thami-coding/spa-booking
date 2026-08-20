from pydantic import BaseModel, Field, EmailStr, ValidationInfo, field_validator
from pydantic import BeforeValidator, ConfigDict, BaseModel, Field, EmailStr
from typing import Annotated, Optional

from pydantic_core import PydanticCustomError
from app.schemas.role import Role
from pydantic.alias_generators import to_camel

PyObjectId = Annotated[str, BeforeValidator(str)]


class UserReg(BaseModel):
    name: str = Field(..., min_length=5, max_length=50)
    email: EmailStr = Field(...)
    password: str = Field(...)
    confirm_password: str = Field(...)

    model_config = {
        "alias_generator": to_camel,
        # Allows the model to still accept standard snake_case if sent
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

        # if not any(char.isdigit() for char in self.password):
        #     raise PydanticCustomError(
        #         "password_mismatch", "Password must contain at least one number"
        #     )

        # if not any(char.isupper() for char in self.password):
        #     raise PydanticCustomError(
        #         "password_error",
        #         "Password must contain at least one uppercase letter",
        #     )

        # return self


class AuthResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    role: Role
    model_config = ConfigDict(populate_by_name=True)


class UserIn(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)
