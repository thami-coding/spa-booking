from pydantic import BaseModel, Field
from pydantic import BeforeValidator, ConfigDict
from typing import Annotated, Optional, List

PyObjectId = Annotated[str, BeforeValidator(str)]


class Service(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    price: int = Field(...)
    model_config = ConfigDict(populate_by_name=True)



