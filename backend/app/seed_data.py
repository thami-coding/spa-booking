from bson import ObjectId
from datetime import datetime, timezone

all_services = [
    {
        "_id": ObjectId("6a94bc5cf18ea27b64caafec"),
        "name": "Feet Massage",
        "price": 120,
    },
    {
        "_id": ObjectId("6a94bc57f18ea27b64caafe4"),
        "name": "Facial Treatment",
        "price": 200,
    },
    {
        "_id": ObjectId("6a94bc57f18ea27b64caafe2"),
        "name": "Deep Tissue Massage",
        "price": 500,
    },
    {
        "_id": ObjectId("6a94bc57f18ea27b64caafe5"),
        "name": "Face Massage",
        "price": 150,
    },
    {
        "_id": ObjectId("6a94bc57f18ea27b64caafe6"),
        "name": "Hot Stone Therapy",
        "price": 400,
    },
    {
        "_id": ObjectId("6a94bc57f18ea27b64caafe1"),
        "name": "Full body Massag",
        "price": 450,
    },
    {"_id": ObjectId("6a94bc57f18ea27b64caafe3"), "name": "Back Massage", "price": 250},
]

bookings_data = [
    {
        "_id": ObjectId("6a8098e21ddee7a273228d9a"),
        "service_id": "6994a2e2592d01cca0c4fc58",
        "name": "Thamsanqa Gumede",
        "email": "sainttsquared@gmail.com",
        "phone": "0659972026",
        "guests": 2,
        "request": "",
        "appointment_at": datetime(2026, 8, 20, 9, 0, 0, tzinfo=timezone.utc),
        "user_id": "6a6b5173d12bc64303d87f52",
        "is_paid": False,
        "amount": 200,
    },
    {
        "_id": ObjectId("6a80e967a3c3f036bcc8c8ba"),
        "service_id": "6994a2e2592d01cca0c4fc59",
        "name": "Thamsanqa Gumede",
        "email": "sainttsquared@gmail.com",
        "phone": "0659972026",
        "guests": 2,
        "request": "",
        "appointment_at": datetime(2026, 8, 18, 9, 0, 0, tzinfo=timezone.utc),
        "user_id": "6a6b5173d12bc64303d87f52",
        "is_paid": True,
        "amount": 200,
    },
]
