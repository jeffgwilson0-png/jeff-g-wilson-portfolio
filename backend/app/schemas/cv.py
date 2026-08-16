from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CVResponse(BaseModel):
    id: int
    title: str
    filename: str
    file_url: str
    file_size: int
    version: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CVUpdate(BaseModel):
    title: Optional[str] = None
    version: Optional[str] = None
    is_active: Optional[bool] = None
