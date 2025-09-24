from pydantic import BaseModel
from typing import List

class Portfolio(BaseModel):
    id: int
    name: str
    assets: List[str]
