import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, RedirectResponse
from app.routers.bookings import router as booking_router
from app.routers.users import router as user_router
from app.routers.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import BaseConfig
from pymongo import AsyncMongoClient
from app.routers.services import router as service_router
from app.routers.payment import router as payment_router
from app.lib.errors import AppException

settings = BaseConfig()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger("booking")

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.DB_NAME or not settings.DB_URL:
        raise ValueError("DB_URL and DB_NAME must be set in .env file")
    app.state.client = AsyncMongoClient(settings.DB_URL)
    app.state.db = app.state.client[settings.DB_NAME]
    try:
        await app.state.client.admin.command("ping")
        print("You have successfully connected to MongoDB!")
    except Exception as e:
        print(f"Connection error: {e}")
    yield
    await app.state.client.close()


app = FastAPI(lifespan=lifespan)


origins = ["https://spa-booking031.netlify.app"]


if settings.ENVIRONMENT == "Development":
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(
        f"{exc.status_code} {request.method} {request.url.path}: {exc.detail}"
    )
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(AppException)
async def unhandled_exception_handler(request: Request, exc: AppException):
    # logger.error(f"{exc.status_code} {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"field": exc.field, "message": exc.message}},
    )


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.get("/")
async def get_root():
    return RedirectResponse(url="/docs")


app.include_router(booking_router, prefix="/bookings", tags=["bookings"])
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(service_router, prefix="/services", tags=["Services"])
app.include_router(payment_router, prefix="/payment", tags=["Payment"])
