from pydantic import BaseModel
from typing import List
from app.schemas.booking import Booking
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel

    

class BookingsResponse(BaseModel):
    bookings: List[Booking]
    totalPages: int
    page: int
    limit: int

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,)


