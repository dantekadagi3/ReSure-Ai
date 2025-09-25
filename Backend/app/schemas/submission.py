from pydantic import BaseModel
from typing import Optional


class SubmissionBase(BaseModel):
    cedant: str
    insured: str
    geography: Optional[str] = None
    peril: Optional[str] = None
    business_type: Optional[str] = None
    sum_insured: float
    past_premium: Optional[float] = 0.0


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionOut(SubmissionBase):
    id: int

    class Config:
        orm_mode = True
