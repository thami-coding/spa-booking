from pydantic import Field, BaseModel, field_validator, ConfigDict
from pydantic.alias_generators import to_camel
from datetime import datetime

class Appointment(BaseModel):
    appointment_at: datetime = Field(...)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }
