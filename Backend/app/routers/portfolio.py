from fastapi import APIRouter
from ..models.portfolio import Portfolio

router = APIRouter()

@router.get("/")
def get_portfolios():
    return [{"id": 1, "name": "Test Portfolio", "assets": ["AssetA", "AssetB"]}]
