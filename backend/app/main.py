from fastapi import FastAPI
from routers.bookings import router as booking_router
from routers.users import router as user_router
from routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import BaseConfig
from pymongo import AsyncMongoClient
from routers.services import router as service_router
from routers.payment import router as payment_router
settings = BaseConfig()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.DB_NAME or not settings.DB_URL:
        raise ValueError("DB_URL and DB_NAME must be set in .env file")

    app.state.client = AsyncMongoClient(settings.DB_URL)
    app.state.db = app.state.client[settings.DB_NAME]

    try:
        await app.state.client.admin.command("ping")
        print("You have successfully connected to MongoDB!")
        print("Mongo address:", settings.DB_URL)
    except Exception as e:
        print(f"Connection error: {e}")

    yield

    await app.state.client.close()


app = FastAPI(lifespan=lifespan)


origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_root():
    return {"Message": "Root working!"}


app.include_router(booking_router, prefix="/bookings", tags=["bookings"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(service_router, prefix="/services", tags=["Services"])
app.include_router(payment_router, prefix="/payment", tags=["Payment"])
