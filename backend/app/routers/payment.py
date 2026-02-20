from fastapi import APIRouter, Request, Body
from typing import Annotated
from lib.payment_utils import generatePaymentIdentifier, generateSignature, dataToString
from bson import ObjectId
from schemas.payment import Payment

router = APIRouter()


@router.post("")
async def get_payment_identifier(request: Request, body: Payment = Body(...)):
    email = body.email
    id = body.service_id
    service = await request.app.state.db.services.find_one({"_id": ObjectId(id)})
    amount = str(service["price"])
    myData = {
        "merchant_id": "10040258",
        "merchant_key": "cer0bf24g7wfr",
        "email_address": email,
        "amount": amount,
        "item_name": service["name"],
    }
    # Generate signature
    passPhrase = "Supernatural"  # TODO put in secret
    myData["signature"] = generateSignature(myData, passPhrase)

    # Convert the data array to a string
    pfParamString = dataToString(myData, passPhrase)

    # Generate payment identifier
    identifier = await generatePaymentIdentifier(pfParamString)

    return {"paymentIdentifier": identifier}
