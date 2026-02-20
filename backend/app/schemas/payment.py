from pydantic import BaseModel, Field, EmailStr


class Payment(BaseModel):
    service_id: str = Field(...)
    email: EmailStr = Field(...)
