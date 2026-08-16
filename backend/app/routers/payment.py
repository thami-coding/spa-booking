from fastapi import APIRouter, Request, Body
from app.config import BaseConfig
from app.lib.payment_utils import generatePaymentIdentifier, generateSignature, dataToString
from bson import ObjectId
from app.schemas.payment import Payment

router = APIRouter()
settings = BaseConfig()


@router.post("")
async def get_payment_identifier(request: Request, body: Payment = Body(...)):
    email = body.email
    id = body.service_id
    guests = body.guests

    service = await request.app.state.db.services.find_one({"_id": ObjectId(id)})
    total_amount = int(service["price"]) * int(guests)
    
    myData = {
        "merchant_id": settings.PAYFAST_MERCHANT_ID,
        "merchant_key": settings.PAYFAST_MERCHANT_KEY,
        "email_address": email,
        "amount": str(total_amount),
        "item_name": service["name"],
    }

    # Generate signature
    passPhrase = settings.PAYFAST_PASSPHRASE

    identifier = ""
    if passPhrase is not None:
        myData["signature"] = generateSignature(myData, passPhrase)
        # Convert the data array to a string
        pfParamString = dataToString(myData, passPhrase)
        # Generate payment identifier
        identifier = await generatePaymentIdentifier(pfParamString)

    return {"paymentIdentifier": identifier}
