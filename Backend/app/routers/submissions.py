from fastapi import APIRouter
from ..models.submission import Submission

router = APIRouter()

@router.get("/")
def list_submissions():
    return [{"id": 1, "filename": "submission_001.pdf", "status": "processed"}]
