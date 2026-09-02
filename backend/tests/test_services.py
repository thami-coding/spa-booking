import pytest
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId
from fastapi import HTTPException

from app.routers.services import get_service  # adjust import to actual location


def make_mock_request(find_one_return_value):
    mock_db = MagicMock()
    mock_db.services.find_one = AsyncMock(return_value=find_one_return_value)

    mock_request = MagicMock()
    mock_request.app.state.db = mock_db
    return mock_request


@pytest.mark.asyncio
async def test_get_service_valid_id_returns_service():
    service_id = "6994a2e2592d01cca0c4fc55"
    fake_service_doc = {
        "_id": ObjectId(service_id),
        "name": "Full Body Massage",
        "price": 450,
    }
    mock_request = make_mock_request(fake_service_doc)

    result = await get_service(
        request=mock_request,
        user_data={"user_id": "test-user"},
        id=service_id,
    )

    assert result.name == "Full Body Massage"
    assert result.price == 450
    assert str(result.id) == service_id

    mock_request.app.state.db.services.find_one.assert_awaited_once_with(
        {"_id": ObjectId(service_id)}
    )


@pytest.mark.asyncio
async def test_get_service_nonexistent_id_raises_404():
    service_id = "6994a2e2592d01cca0c4fc99"
    mock_request = make_mock_request(None)  # find_one returns None — not found

    with pytest.raises(HTTPException) as exc_info:
        await get_service(
            request=mock_request,
            user_data={"user_id": "test-user"},
            id=service_id,
        )

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "service does not exist"


@pytest.mark.asyncio
async def test_get_service_invalid_id_format_raises_error():
    mock_request = make_mock_request(None)

    # ObjectId("not-a-valid-objectid") raises InvalidId — currently unhandled in the route
    with pytest.raises(
        Exception
    ):  # tighten to bson.errors.InvalidId once route validates input
        await get_service(
            request=mock_request,
            user_data={"user_id": "test-user"},
            id="not-a-valid-objectid",
        )
