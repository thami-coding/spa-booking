from pydantic import BeforeValidator, ConfigDict, BaseModel, Field, EmailStr
from typing import Annotated,Optional
from datetime import datetime
from pydantic.alias_generators import to_camel

from app.core.security import Role

PyObjectId = Annotated[str, BeforeValidator(str)]


class UserResponse(BaseModel):
    id: PyObjectId = Field(
        ...,
        validation_alias="_id",
        serialization_alias="id",
    )
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    phone: Optional[str] = ""
    role: Role = Field(...)
    created_at: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        
    )
