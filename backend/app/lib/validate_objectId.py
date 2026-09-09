from fastapi import HTTPException, status
from bson import ObjectId


def get_valid_object_id(id: str) -> ObjectId:
    """Convert string to ObjectId, raise HTTPException if invalid"""
    try:
        if id is None:
            raise Exception()
        return ObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid ID format"
        )
