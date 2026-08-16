from pydantic import BaseModel, Field
from pydantic import BeforeValidator, ConfigDict
from typing import Annotated, Optional, List
from pydantic.alias_generators import to_camel

PyObjectId = Annotated[str, BeforeValidator(str)]


class Service(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    price: int = Field(...)

    model_config = {
        "alias_generator": to_camel,
        "populate_by_name": True,
    }
