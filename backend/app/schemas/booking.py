from pydantic import Field, BaseModel, BeforeValidator, ConfigDict, EmailStr
from typing import Annotated, Optional
from datetime import datetime
from models.service import Service

PyObjectId = Annotated[str, BeforeValidator(str)]


class Booking(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str = Field(...)
    appointment_at: datetime = Field(...)
    service_id: str = Field(...)
    is_paid: bool = Field(default=False)
    full_name: str = Field(..., min_length=5)
    email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10, max_length=10)
    guests: int = Field(..., gt=0)
    request: Optional[str] = None
    model_config = ConfigDict(populate_by_name=True)


class BookingResponse(BaseModel):
    booking: Booking
