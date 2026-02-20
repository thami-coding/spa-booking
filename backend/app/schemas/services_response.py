from models.service import Service
from typing import List
from pydantic import BaseModel


class ServicesResponse(BaseModel):
    services: List[Service]
