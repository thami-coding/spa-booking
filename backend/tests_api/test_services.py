import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.auth import auth_handler
from pymongo import AsyncMongoClient
from app.config import BaseConfig
from app.seed_data import all_services
from app.schemas.services_response import ServicesResponse

settings = BaseConfig()


@pytest.fixture
def client(reset_db):
    app.dependency_overrides[auth_handler.auth_wrapper] = lambda: {
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
    await db.services.delete_many({})
    await db.services.insert_many(all_services)
    yield


def test_get_all_services_returns_200(client):
    response = client.get("/services")

    assert response.status_code == 200
    assert ServicesResponse.model_validate(response.json())


def test_get_service_by_id_valid_id_returns_200(client):
    response = client.get("/services/6a94bc57f18ea27b64caafe1")

    assert response.status_code == 200
    assert response.json() == {
        "id": "6a94bc57f18ea27b64caafe1",
        "name": "Full body Massag",
        "price": 450,
    }


def test_create_new_service_returns_201(client):
    response = client.post("/services", json={"name": "Feet Massage", "price": 120})
    service = response.json()

    assert response.status_code == 201
    assert service["price"] == 120
    assert service["name"] == "Feet Massage"


def test_delete_service_by_id_valid_id_returns_204(client):
    response = client.delete("/services/6a94bc57f18ea27b64caafe6")

    assert response.status_code == 204


# def test_get_service_nonexistent_id_returns_404(client):
#     fake_id = "6994a2e2592d01cca0c4fc99"  # valid ObjectId format, never seeded

#     response = client.get(f"/services/{fake_id}")

#     assert response.status_code == 404
#     assert response.json() == {"detail": "service does not exist"}


# def test_get_service_invalid_id_format_returns_error(client):
#     response = client.get("/services/not-a-valid-objectid")

#     # NOTE: currently raises bson.errors.InvalidId unhandled inside ObjectId(id) —
#     # this will surface as a 500, not a clean 4xx. See flag below.
#     assert response.status_code in (400, 422, 500)


# def test_get_service_missing_auth_returns_401(client_no_auth_override):
#     service_id = "6994a2e2592d01cca0c4fc55"

#     response = client_no_auth_override.get(f"/services/{service_id}")

#     assert response.status_code == 401


def test_update_service_by_id_valid_id_returns_200(client):
    response = client.put(
        "/services/6a94bc57f18ea27b64caafe5",
        json={"name": "Swedish Massage", "price": 150},
    )

    assert response.status_code == 200
    assert response.json() == {
        "id": "6a94bc57f18ea27b64caafe5",
        "name": "Swedish Massage",
        "price": 150,
    }
