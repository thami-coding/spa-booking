from typing import List
from pydantic import BaseModel

from pydantic import BaseModel, Field
from pydantic import BeforeValidator
from typing import Annotated
from pydantic.alias_generators import to_camel

PyObjectId = Annotated[str, BeforeValidator(str)]


class Service(BaseModel):
    id: PyObjectId = Field(..., alias="_id")
    name: str = Field(...)
    price: int = Field(..., lt=4000)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }


class ServiceIn(BaseModel):
    name: str = Field(..., min_length=8, max_length=100, pattern=r"^[a-zA-Z\s]+$")
    price: int = Field(..., lt=4000, gt=100)


class ServicesResponse(BaseModel):
    services: List[Service]


class ServiceResponse(BaseModel):
    id: PyObjectId = Field(..., alias="_id")
    name: str = Field(...)
    price: int = Field(..., lt=4000)
