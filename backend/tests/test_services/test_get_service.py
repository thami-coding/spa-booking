import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException, status
from bson import ObjectId
from app.routers.services import get_service


class TestGetService:
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
        """Sample service document"""
        return {
            "_id": ObjectId(),
            "name": "Test Service",
            "description": "Test Description",
            "price": 100,
        }

    async def test_get_service_success(
        self, mock_request, mock_user_data, valid_service_id, valid_service_document
    ):
        """Test successful service retrieval by id"""
        mock_request.app.state.db.services.find_one.return_value = (
            valid_service_document
        )

        service = await get_service(mock_request, {}, valid_service_id)

        mock_request.app.state.db.services.find_one.assert_called_once_with(
            {"_id": ObjectId(valid_service_id)}
        )
        assert service.name == "Test Service"
        assert service.price == 100

    @pytest.mark.parametrize(
        "invalid_id",
        [
            "",
            "invalid",
            "12345",
            "!@#$%",
            "a" * 100,
            "   ",
            None
        ],
    )
    async def test_get_service_invalid_ids_return_400(
        self, mock_request, mock_user_data, invalid_id
    ):
        """Test that invalid ID format raises 400 HTTPException"""
        with pytest.raises(HTTPException) as exec_info:
            await get_service(mock_request, {}, invalid_id)

        assert exec_info.value.status_code == status.HTTP_400_BAD_REQUEST
        assert "Invalid ID format" in exec_info.value.detail

    async def test_get_service_with_valid_id_not_found(
        self, mock_request, mock_user_data, valid_service_id
    ):
        """Test with valid ObjectId format but service doesn't exist"""
        mock_request.app.state.db.services.find_one.return_value = None

        with pytest.raises(HTTPException) as exec_info:
            await get_service(mock_request, mock_user_data, valid_service_id)

        mock_request.app.state.db.services.find_one.assert_called_once_with(
            {"_id": ObjectId(valid_service_id)}
        )
        assert exec_info.value.status_code == status.HTTP_404_NOT_FOUND
        assert (
            f"service with id:{valid_service_id} does not exist"
            in exec_info.value.detail
        )
