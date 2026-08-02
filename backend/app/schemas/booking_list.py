from pydantic import BaseModel
from typing import List
from app.schemas.booking import Booking


class BookingsResponse(BaseModel):
    bookings: List[Booking]
    totalPages: int
    page: int
    limit: int
