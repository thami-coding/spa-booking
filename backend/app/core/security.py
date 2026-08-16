import datetime
from enum import Enum
from typing import Annotated
import jwt
from fastapi import Cookie, Depends, HTTPException, status
from passlib.context import CryptContext
from app.config import BaseConfig
from app.core.roles import Role

settings = BaseConfig()


class AuthHandler:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    secret = settings.JWT_SECRET

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def encode_token(self, user_id: str, role: str) -> str:
        payload = {
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(minutes=15),
            "iat": datetime.datetime.now(datetime.timezone.utc),
            "sub": user_id,
            "role": role,
        }
        return jwt.encode(payload, self.secret, algorithm="HS256")

    def decode_token(self, token: str):
        try:
            payload = jwt.decode(token, self.secret, algorithms=["HS256"])
            return {
                "user_id": payload["sub"],
                "role": payload["role"],
            }
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Signature has expired")
        except jwt.InvalidTokenError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
            )

    def auth_wrapper(
        self, access_token: Annotated[str | None, Cookie()] = None
    ) -> dict:
        if not access_token:
            raise HTTPException(status_code=401, detail="Not authenticated")

        return self.decode_token(access_token)

    def admin_wrapper(
        self, access_token: Annotated[str | None, Cookie()] = None
    ) -> dict:
        payload = self.auth_wrapper(access_token)
        if payload["role"] != Role.ADMIN.value:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required",
            )

        return payload
