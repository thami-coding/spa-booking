import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException, status
from bson import ObjectId
from app.routers.services import delete_service


class TestDeleteService:
    """Test suite for delete_service endpoint"""

    @pytest.fixture
    def mock_request(self):
        """Mock FastAPI Request object"""
        request = MagicMock()
        request.app.state.db.services = AsyncMock()
        return request

    @pytest.fixture
    def mock_user_data(self):
        """Mock authenticated user data"""
        return {"user_data": 123, "email": "test@example.com"}

    @pytest.fixture
    def valid_service_id(self):
        return str(ObjectId())

    @pytest.fixture
    def valid_service_document(self):
        """Sample service document from database"""
        return {
            "_id": ObjectId(),
            "name": "Test Service",
            "description": "Test Description",
            "price": 100.0,
        }

    async def test_delete_service_success(
        self, mock_request, mock_user_data, valid_service_id, valid_service_document
    ):
        """Test successful service deletion"""
        _id = ObjectId(valid_service_id)
        valid_service_document["id"] = _id
        mock_request.app.state.db.services.find_one.return_value = (
            valid_service_document
        )
        mock_request.app.state.db.services.delete_one.return_value = MagicMock(
            deleted_count=1
        )

        result = await delete_service(mock_request, {}, valid_service_id)

        mock_request.app.state.db.services.find_one.assert_called_once_with(
            {"_id": _id}
        )
        mock_request.app.state.db.services.delete_one.assert_called_once_with(
            {"_id": _id}
        )
        assert result == {}

    @pytest.mark.parametrize(
        "invalid_id",
        [
            "",
            "invalid",
            "12345",
            "!@#$%",
            "a" * 100,
            "   ",
        ],
    )
    async def test_delete_service_invalid_ids_returns_400(
        self, mock_request, mock_user_data, invalid_id
    ):
        """Test that invalid ID format raises 400 HTTPException"""
        with pytest.raises(HTTPException) as exc_info:
            await delete_service(mock_request, mock_user_data, invalid_id)

        assert exc_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid ID format" in exc_info.value.detail

    async def test_delete_service_twice_second_fails(
        self, mock_request, mock_user_data, valid_service_id
    ):
        """Test that deleting same service twice fails on second attempt (404)"""
        valid_service_document = {
            "_id": ObjectId(valid_service_id),
            "name": "Test Service",
        }
        mock_request.app.state.db.services.find_one.side_effect = [
            valid_service_document,
            None,
        ]
        mock_request.app.state.db.services.delete_one.return_value = MagicMock(
            deleted_count=1
        )

        result = await delete_service(mock_request, mock_user_data, valid_service_id)

        assert result == {}

        with pytest.raises(HTTPException) as exc_info:
            await delete_service(mock_request, mock_user_data, valid_service_id)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc_info.value.detail == "service does not exist"

    async def test_delete_service_valid_id_not_found(
        self, mock_request, mock_user_data, valid_service_id
    ):
        """Test with valid ObjectId format but service doesn't exist"""
        mock_request.app.state.db.services.find_one.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await delete_service(mock_request, mock_user_data, valid_service_id)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND

        mock_request.app.state.db.services.delete_one.assert_not_called()
