from fastapi import APIRouter, Request, Body
from config import BaseConfig
from lib.payment_utils import generatePaymentIdentifier, generateSignature, dataToString
from bson import ObjectId
from schemas.payment import Payment

router = APIRouter()
settings = BaseConfig()


@router.post("")
async def get_payment_identifier(request: Request, body: Payment = Body(...)):
    email = body.email
    id = body.service_id
    
    service = await request.app.state.db.services.find_one({"_id": ObjectId(id)})
    amount = str(service["price"])
    
    myData = {
        "merchant_id": settings.PAYFAST_MERCHANT_ID,
        "merchant_key": settings.PAYFAST_MERCHANT_KEY,
        "email_address": email,
        "amount": amount,
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
