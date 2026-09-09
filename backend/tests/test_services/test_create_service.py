import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import status, HTTPException
from bson import ObjectId
from pydantic import ValidationError
from app.routers.services import add_service
from app.schemas.service import ServiceIn


class TestAddService:
    """Unit tests for add_service endpoint"""

    @pytest.fixture
    def mock_request(self):
        request = MagicMock()
        request.app.state.db.services = AsyncMock()
        return request

    @pytest.fixture
    def valid_service_body(self):
        """Valid Service model"""
        return ServiceIn(
            name="New Service",
            price=120,
        )

    @pytest.fixture
    def valid_service_insert(self):
        return {
            "name": "New Service",
            "price": 120,
        }

    @pytest.fixture
    def valid_service_document(self):
        """Service document stored in database"""
        return {
            "_id": ObjectId(),
            "name": "New Service",
            "price": 120,
        }

    @pytest.fixture
    def mock_user_data(self):
        """Mock authenticated user data"""
        return {"user_id": "123", "email": "test@example.com"}

    async def test_add_service_success(
        self,
        mock_request,
        mock_user_data,
        valid_service_body,
        valid_service_document,
        valid_service_insert,
    ):
        """Test successfully adding a service"""
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = valid_service_document["_id"]
        mock_request.app.state.db.services.insert_one.return_value = mock_insert_result
        mock_request.app.state.db.services.find_one.return_value = (
            valid_service_document
        )

        result = await add_service(mock_request, mock_user_data, valid_service_body)

        assert result.name == "New Service"
        assert result.price == 120
        mock_request.app.state.db.services.insert_one.assert_called_once_with(
            valid_service_insert
        )
        mock_request.app.state.db.services.find_one.assert_called_once_with(
            {"_id": mock_insert_result.inserted_id}
        )

    async def test_add_service_created_service_not_found(
        self, mock_request, mock_user_data, valid_service_body
    ):
        """Test when inserted service cannot be retrieved"""
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = ObjectId()
        mock_request.app.state.db.services.insert_one.return_value = mock_insert_result
        mock_request.app.state.db.services.find_one.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await add_service(mock_request, mock_user_data, valid_service_body)

        assert exc_info.value.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize(
        "price_value",
        [101, 150, 299, 3999, 869],
    )
    async def test_add_service_various_valid_prices_parametrized(
        self, mock_request, mock_user_data, valid_service_document, price_value
    ):
        """Test adding services with various valid prices"""
        service_body = ServiceIn(name="New Service", price=price_value)
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = valid_service_document["_id"]
        valid_service_document["price"] = price_value
        mock_request.app.state.db.services.insert_one.return_value = mock_insert_result
        mock_request.app.state.db.services.find_one.return_value = (
            valid_service_document
        )

        result = await add_service(mock_request, mock_user_data, service_body)

        assert result.price == price_value

    @pytest.mark.parametrize(
        "invalid_price",
        [4000, 3000.01, 5000, -1, -99.99, 0, None, "", "price", False],
    )
    async def test_add_service_invalid_prices_parametrized(self, invalid_price):
        """Test adding services with invalid prices"""
        with pytest.raises(ValidationError):
            ServiceIn(name="Service", price=invalid_price)

    @pytest.mark.parametrize(
        "invalid_name",
        ["", "a", "short", "1234567" "Service !@#$%^&*()", None, 34, False],
    )
    def test_add_service_various_invalid_service_names(self, invalid_name):
        """Test adding services with invalid service names"""

        with pytest.raises(ValidationError):
            ServiceIn(name=invalid_name, price=150)
