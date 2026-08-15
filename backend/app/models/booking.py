from pydantic import Field, BaseModel, field_validator, ConfigDict
from datetime import date
from pydantic import EmailStr, BeforeValidator
from typing import Optional, Annotated
from datetime import date, time
from app.models.service import Service
from pydantic.alias_generators import to_camel

PyObjectId = Annotated[str, BeforeValidator(str)]


class Booking(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    service_id: str = Field(...)
    booked_date: date = Field(...)
    booked_time: time = Field(...)
    name: str = Field(..., min_length=5)
    email: EmailStr = Field(...)
    phone: str = Field(..., min_length=10, max_length=10)
    guests: int = Field(..., gt=0)
    request: Optional[str] = ""

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }

    @field_validator("booked_date")
    @classmethod
    def validate_date(cls, date_booked: date) -> date:
        today = date.today()
        end_of_year = date(today.year, 12, 31)

        if date_booked < today:
            raise ValueError("Booking date cannot be in the past")

        if date_booked > end_of_year:
            raise ValueError("Booking date cannot be beyond the end of this year")

        return date_booked

    @field_validator("booked_time")
    @classmethod
    def validate_booking_time(cls, value: time):
        start = time(9, 0)  # 09:00
        end = time(14, 0)  # 14:00 (2 PM)

        if not (start <= value <= end):
            raise ValueError("Booking time must be between 09:00 and 14:00")
        return value
