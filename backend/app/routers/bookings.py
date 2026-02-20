import math
from models.booking import Booking
from datetime import datetime, timezone
from bson import ObjectId
from schemas.booking import BookingResponse
from schemas.booking_list import BookingsResponse
from core.security import AuthHandler
from fastapi import (
    APIRouter,
    status,
    Request,
    Body,
    Path,
    Query,
    Depends,
    HTTPException,
)

router = APIRouter()

auth_handler = AuthHandler()


@router.post(
    "",
    response_description="Booking created successfully",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_booking(
    request: Request,
    user_data=Depends(auth_handler.auth_wrapper),
    booking: Booking = Body(...),
):
    document = booking.model_dump(exclude={"id"})
    combined_datetime = datetime.combine(
        document["booked_date"], document["booked_time"]
    )

    bookingExists = await request.app.state.db.bookings.find_one(
        {"appointment_at": combined_datetime}
    )

    if bookingExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="date and time already booked"
        )

    document["appointment_at"] = combined_datetime
    document["user_id"] = user_data["user_id"]
    document["is_paid"] = False

    document.pop("booked_date")
    document.pop("booked_time")

    result = await request.app.state.db.bookings.insert_one(document)
    created_booking = await request.app.state.db.bookings.find_one(
        {"_id": result.inserted_id}
    )

    return BookingResponse(booking=created_booking)


@router.get(
    "",
    response_description="List of bookings retrieved successfully",
    response_model=BookingsResponse,
    response_model_by_alias=False,
)
async def get_bookings(
    request: Request,
    user_data=Depends(auth_handler.auth_wrapper),
    page: int = Query(ge=1, default=1),
    limit: int = Query(ge=10, default=10),
):
    bookings = []
    cursor = (
        request.app.state.db.bookings.find({})
        .sort("appointment_at", 1)
        .limit(limit)
        .skip((page - 1) * limit)
    )

    total = await request.app.state.db.bookings.count_documents({})
    totalPages = math.ceil(total / limit)

    async for document in cursor:
        bookings.append(document)

    return BookingsResponse(
        bookings=bookings, totalPages=totalPages, page=page, limit=limit
    )


@router.patch("/{id}")
async def update_booking_payment(request: Request, id: str = Path(...)):
    result = await request.app.state.db.bookings.update_one(
        {"_id": ObjectId(id)}, {"$set": {"is_paid": True}}
    )

    booking = await request.app.state.db.bookings.find_one({"_id": ObjectId(id)})
    print(booking)

    return BookingResponse(booking=booking)


@router.get("/dates")
async def get_booked_dates(
    request: Request, user_data=Depends(auth_handler.auth_wrapper)
):
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    booked_dates = []
    async for doc in request.app.state.db.bookings.find(
        {
            "appointment_at": {"$gte": today},
            "is_paid": False,
        },  # TODO: CHANGE True to see results
        {"appointment_at": 1, "_id": 0},
    ):
        booked_dates.append(doc)

    return booked_dates


@router.get(
    "/{id}",
    response_description="Booking retrieved successfully",
    response_model=BookingResponse,
    response_model_by_alias=False,
)
async def get_booking_by_id(request: Request, id: str = Path(...)):
    booking = await request.app.state.db.bookings.find_one(
        {"_id": ObjectId(id)}, {"is_paid": 0}
    )
    return BookingResponse(booking=booking)
