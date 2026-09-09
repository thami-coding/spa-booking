import math
from datetime import datetime
from bson import ObjectId
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

from app.schemas.booking import BookingIn
from app.schemas.appointment import Appointments
from app.schemas.booking import BookingResponse, BookingsResponse
from app.auth import auth_handler
from app.lib.validate_objectId import get_valid_object_id

router = APIRouter()


@router.post(
    "",
    response_description="Booking created successfully",
    response_model=BookingResponse,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=True,
)
async def create_booking(
    request: Request,
    user_data=Depends(auth_handler.auth_wrapper),
    booking: BookingIn = Body(...),
):
    booking_dict = booking.model_dump()
    service_id = booking_dict["service_id"]
    appointment = datetime.combine(
        booking_dict["booked_date"], booking_dict["booked_time"]
    )

    booking = await request.app.state.db.bookings.find_one(
        {"appointment_at": appointment}
    )
    service = await request.app.state.db.services.find_one(
        {"_id": ObjectId(service_id)}
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"service with id: {service_id} does not exist",
        )

    if booking is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="date and time already booked"
        )

    booking_dict["appointment_at"] = appointment
    booking_dict["user_id"] = user_data["user_id"]
    booking_dict["is_paid"] = False
    booking_dict.pop("booked_date")
    booking_dict.pop("booked_time")

    price = service["price"]
    guests = booking_dict["guests"]
    amount = int(guests) * int(price)
    booking_dict["amount"] = str(amount)
    result = await request.app.state.db.bookings.insert_one(booking_dict)

    created_booking = await request.app.state.db.bookings.find_one(
        {"_id": result.inserted_id}
    )

    return BookingResponse(**created_booking)


@router.get(
    "",
    response_description="List of bookings retrieved successfully",
    response_model=BookingsResponse,
    response_model_by_alias=True,
)
async def get_bookings(
    request: Request,
    user=Depends(auth_handler.admin_wrapper),
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
    _id = get_valid_object_id(id)
    booking = await request.app.state.db.bookings.find_one({"_id":_id})

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"booking with id: {id} does not exist"
        )
    
    result = await request.app.state.db.bookings.update_one(
        {"_id":_id}, {"$set": {"is_paid": True}}
    )
    paid_booking = await request.app.state.db.bookings.find_one({"_id":_id})

    return BookingResponse(**paid_booking)


@router.get(
    "/dates",
    response_description="Booked dates retrieved successfully",
    response_model=Appointments,
    response_model_by_alias=True,
)
async def get_booked_dates(
    request: Request, user_data=Depends(auth_handler.auth_wrapper)
):
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    dates = []

    async for doc in request.app.state.db.bookings.find(
        {
            "appointment_at": {"$gte": today},
            "is_paid": False,
        },  # TODO: CHANGE True to see results
        {"appointment_at": 1, "_id": 0},
    ):
        dates.append(doc)

    return Appointments(appointments=dates)


@router.get(
    "/{id}",
    response_description="Booking retrieved successfully",
    response_model=BookingResponse,
    response_model_by_alias=True,
)
async def get_booking_by_id(request: Request, id: str = Path(...)):
    booking = await request.app.state.db.bookings.find_one(
        {"_id": ObjectId(id)}, {"is_paid": 0}
    )

    if booking is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="booking does not exist"
        )

    return BookingResponse(**booking)
