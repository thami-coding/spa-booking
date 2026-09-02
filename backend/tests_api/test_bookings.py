import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from app.main import app
from pymongo import AsyncMongoClient
from app.config import BaseConfig
from app.auth import auth_handler
from app.schemas.booking_list import BookingsResponse, Booking
from app.schemas.booked_dates_response import BookedDates
from app.seed_data import bookings_data
from datetime import datetime

settings = BaseConfig()


@pytest.fixture
def client(reset_db):
    app.dependency_overrides[auth_handler.auth_wrapper] = lambda: {
        "user_id": "test-user"
    }
    app.dependency_overrides[auth_handler.admin_wrapper] = lambda: {
        "user_id": "test-user"
    }
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="session", loop_scope="session")
async def db_client():
    if settings.DB_NAME is None or settings.DB_URL is None:
        raise ValueError("DB_URL and DB_NAME must be set in .env file")
    client = AsyncMongoClient(settings.DB_URL)
    yield client
    await client.close()


@pytest_asyncio.fixture(autouse=True)
async def reset_db(db_client):
    db = db_client[settings.DB_NAME]
    await db.bookings.delete_many({})
    await db.bookings.insert_many(bookings_data)
    yield


def test_get_all_bookings_returns_200(client):
    response = client.get("/bookings")
    BookingsResponse.model_validate(response.json())


def test_get_booking_by_id_valid_id_returns_200(client):
    response = client.get("/bookings/6a8098e21ddee7a273228d9a")

    assert response.status_code == 200
    assert Booking.model_validate(response.json())


def test_create_new_booking_returns_201(client):
    today = datetime.now().strftime("%Y-%m-%d")
    booking = {
        "booked_date": today,
        "booked_time": "14:00:00",
        "service_id": "6a94bc57f18ea27b64caafe1",
        "name": "JohnDoe",
        "email": "johnDoe@test.com",
        "phone": "0844565432",
        "guests": 1,
        "request": "More pressure on shoulders",
    }

    response = client.post("/bookings", json=booking)

    assert response.status_code == 201
    booking = response.json()
    assert booking["email"] == "johnDoe@test.com"
    assert booking["phone"] == "0844565432"
    assert booking["request"] == "More pressure on shoulders"
    assert booking["guests"] == 1


def test_update_booking_payment_status_returns_200(client):
    response = client.patch("/bookings/6a80e967a3c3f036bcc8c8ba")

    assert response.status_code == 200
    booking = response.json()
    assert booking["isPaid"] == True


def test_get_booked_dates_returns_200(client):
    response = client.get("/bookings/dates")

    assert response.status_code == 200
    assert BookedDates.model_validate(response.json())


# def test_delete_booking_by_id_valid_id_returns_204(client):
#     response = client.delete("/bookings/6a8097bf5cf4794124933039")
#     assert response.status_code == 204
