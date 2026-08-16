from pydantic import BaseModel, Field, EmailStr
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel

class Payment(BaseModel):
    email: EmailStr = Field(...)
    guests: int =  Field(..., gt=0)
    service_id: str = Field(...)
    booking_id: str =  Field(...)

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

