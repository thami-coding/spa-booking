from typing import Optional
from datetime import datetime
from schemas.role import Role
from pydantic import BaseModel, EmailStr, Field, BeforeValidator, ConfigDict
from typing import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class User(BaseModel):
    id: PyObjectId = Field(..., alias="_id")
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    phone: Optional[str] = ""
    role: Role = Field(...)
    created_at: datetime = Field(default_factory=datetime.now)

    model_config = ConfigDict(populate_by_name=True)
