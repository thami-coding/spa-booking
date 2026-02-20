from pydantic import BaseModel
from typing import List
from schemas.booking import Booking


class BookingsResponse(BaseModel):
    bookings: List[Booking]
    totalPages: int
    page: int
    limit: int
