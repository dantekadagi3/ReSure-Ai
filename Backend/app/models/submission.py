from pydantic import BaseModel

class Submission(BaseModel):
    id: int
    filename: str
    status: str
