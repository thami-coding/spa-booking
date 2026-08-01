from pydantic import ConfigDict, Field, BaseModel, BeforeValidator, EmailStr
from typing import Annotated, Optional
from datetime import datetime
from pydantic.alias_generators import to_camel

PyObjectId = Annotated[str, BeforeValidator(str)]


class Booking(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str = Field(...)
    appointment_at: datetime = Field(...)
    service_id: str = Field(...)
    is_paid: bool = Field(default=False)
    name: str = Field(..., min_length=5)
    email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10, max_length=10)
    guests: int = Field(..., gt=0)
    request: Optional[str] = None

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }

class CreatedBooking(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str = Field(...)
    appointment_at: datetime = Field(...)
    service_id: str = Field(...)
    is_paid: bool = Field(default=False)
    name: str = Field(..., min_length=5)
    email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10, max_length=10)
    guests: int = Field(..., gt=0)
    request: Optional[str] = None
    
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
    
class BookingResponse(BaseModel):
    booking: CreatedBooking

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
