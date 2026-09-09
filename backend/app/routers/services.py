from fastapi import APIRouter, Request, Path, status, HTTPException, Depends, Body

from app.auth import auth_handler
from app.seed_data import all_services
from app.schemas.service import ServicesResponse, ServiceIn, ServiceResponse
from app.lib.validate_objectId import get_valid_object_id

router = APIRouter()


@router.post("/seed")
async def seed_services(request: Request):
    await request.app.state.db.services.insert_many(all_services)
    return {"message": "Data successfully seeded"}


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ServiceResponse,
    response_model_by_alias=True,
)
async def add_service(
    request: Request,
    user_data=Depends(auth_handler.auth_wrapper),
    service_body: ServiceIn = Body(...),
):
    service = service_body.model_dump()
    result = await request.app.state.db.services.insert_one(service)
    created_service = await request.app.state.db.services.find_one(
        {"_id": result.inserted_id}
    )

    if created_service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="created booking not found"
        )

    return ServiceResponse(**created_service)


@router.get("", response_model=ServicesResponse, response_model_by_alias=False)
async def get_services(request: Request, user_data=Depends(auth_handler.auth_wrapper)):
    cursor = request.app.state.db.services.find()
    services = []
    async for doc in cursor:
        services.append(doc)

    return ServicesResponse(services=services)


@router.get("/{id}", response_model=ServiceResponse, response_model_by_alias=False)
async def get_service(
    request: Request, user_data=Depends(auth_handler.auth_wrapper), id: str = Path(...)
):
    _id = get_valid_object_id(id)
    service = await request.app.state.db.services.find_one({"_id": _id})
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"service with id:{id} does not exist",
        )

    return ServiceResponse(**service)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    request: Request, user_data=Depends(auth_handler.auth_wrapper), id: str = Path(...)
):
    _id = get_valid_object_id(id)
    service = await request.app.state.db.services.find_one({"_id": _id})
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="service does not exist"
        )

    await request.app.state.db.services.delete_one({"_id": _id})
    return {}


@router.put("/{id}", response_model=ServiceResponse, response_model_by_alias=False)
async def update_service(
    request: Request,
    user_data=Depends(auth_handler.auth_wrapper),
    id: str = Path(...),
    service_body: ServiceIn = Body(...),
):
    _id = get_valid_object_id(id)
    service = await request.app.state.db.services.find_one({"_id": _id})
    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"service with id: {_id} does not exist",
        )

    service_document = service_body.model_dump()
    query_filter = {"_id": _id}
    update_service = {"$set": service_document}
    await request.app.state.db.services.update_one(query_filter, update_service)
    service = await request.app.state.db.services.find_one({"_id": _id})

    return ServiceResponse(**service)
