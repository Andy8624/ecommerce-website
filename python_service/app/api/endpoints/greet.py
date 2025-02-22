# app/api/endpoints/greet.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/greet")
async def greet():
    return {"message": "Hello! The Python Service Engine is up and running!"}
