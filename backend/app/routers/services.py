from fastapi import APIRouter, Request
from seed_data import all_services
from schemas.services_response import ServicesResponse

router = APIRouter()


@router.get("", response_model=ServicesResponse, response_model_by_alias=False)
async def get_services(request: Request):
    cursor = request.app.state.db.services.find({})
    services = []
    async for doc in cursor:
        services.append(doc)
    return ServicesResponse(services=services)


@router.post("/seed")
async def seed_services(request: Request):
    await request.app.state.db.services.insert_many(all_services)
    return {"message": "Data successfully seeded"}
