import requests
import hashlib
import urllib.parse
import httpx

def dataToString(dataArray, passPhrase=""):
    pfParamString = ""
    for key in dataArray:
        # Get all the data from Payfast and prepare parameter string
        pfParamString += (
            key + "=" + urllib.parse.quote_plus(dataArray[key].replace("+", " ")) + "&"
        )
    # After looping through, cut the last & or append your passphrase
    pfParamString = pfParamString[:-1]
    if passPhrase != "":
        pfParamString += f"&passphrase={passPhrase}"
    return pfParamString


async def generatePaymentIdentifier(pfParamString):
    url = "https://sandbox.payfast.co.za/onsite/process"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    async with httpx.AsyncClient() as client:
        response = await client.post(url, content=pfParamString, headers=headers)

    try:
        print("Here Here Here Here")
        # print(f"Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")
        responseJson = response.json()
        uuid = responseJson.get("uuid")
        return uuid
    except:
        return False


def generateSignature(dataArray, passPhrase=""):
    payload = dataToString(dataArray, passPhrase)
    return hashlib.md5(payload.encode()).hexdigest()
