from pydantic import BaseModel
from typing import List
from datetime import datetime
from pydantic import Field, BaseModel
from pydantic.alias_generators import to_camel


class BookedDates(BaseModel):
    appointment_at: datetime = Field(...)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }


class Appointments(BaseModel):
    appointments: List[BookedDates]

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }
