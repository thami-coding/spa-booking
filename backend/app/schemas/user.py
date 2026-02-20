from pydantic import BeforeValidator, ConfigDict, BaseModel, Field, EmailStr
from typing import Annotated, Optional

PyObjectId = Annotated[str, BeforeValidator(str)]

class UserResponse(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr = Field(...)
    phone: str = Field(...)
    model_config = ConfigDict(populate_by_name=True)
