import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import HTTPException, status
from bson import ObjectId
from pydantic import ValidationError
from app.routers.services import get_services


class TestGetServices:
    """Unit tests for get_services endpoint"""

    @pytest.fixture
    def mock_request(self):
        """Mock FastAPI Request object"""
        request = MagicMock()
        request.app.state.db = MagicMock()
        request.app.state.db.services = MagicMock()
        return request

    @pytest.fixture
    def mock_user_data(self):
        """Mock authenticated user data"""
        return {"user_id": "123", "email": "test@example.com"}

    @pytest.fixture
    def async_cursor_factory(self):
        """Factory to create async cursors from documents"""
        def make_cursor(documents):
            async def async_gen():
                for doc in documents:
                    yield doc

            return async_gen()

        return make_cursor

    @pytest.fixture
    def single_service_document(self):
        """Sample single service document"""
        return {
            "_id": ObjectId(),
            "name": "Service 1",
            "description": "First service",
            "price": 99.99,
        }

    @pytest.fixture
    def multiple_service_documents(self):
        """Sample multiple service documents"""
        return [
            {
                "_id": ObjectId(),
                "name": "Service 1",
                "description": "First service",
                "price": 99,
            },
            {
                "_id": ObjectId(),
                "name": "Service 2",
                "description": "Second service",
                "price": 149,
            },
            {
                "_id": ObjectId(),
                "name": "Service 3",
                "description": "Third service",
                "price": 199,
            },
        ]

    async def test_get_services_multiple_services(
        self,
        mock_request,
        mock_user_data,
        multiple_service_documents,
        async_cursor_factory,
    ):
        """Test retrieving multiple services"""
        mock_cursor = async_cursor_factory(multiple_service_documents)
        mock_request.app.state.db.services.find.return_value = mock_cursor

        result = await get_services(mock_request, mock_user_data)

        mock_request.app.state.db.services.find.assert_called_once()
        assert len(result.services) == 3
        assert result.services[0].name == "Service 1"
        assert result.services[1].name == "Service 2"
        assert result.services[2].name == "Service 3"

    async def test_get_services_empty_list_when_no_services(
        self,
        mock_request,
        mock_user_data,
        async_cursor_factory,
    ):
        """Test retrievs empty list when no services exist"""
        mock_cursor = async_cursor_factory([])
        mock_request.app.state.db.services.find.return_value = mock_cursor

        result = await get_services(mock_request, mock_user_data)

        assert len(result.services) == 0
        assert result.services == []
