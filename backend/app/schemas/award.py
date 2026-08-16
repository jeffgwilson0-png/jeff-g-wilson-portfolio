from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AwardBase(BaseModel):
    title: str
    organization: str
    award_date: Optional[str] = None
    description: Optional[str] = None
    certificate_url: Optional[str] = None
    external_url: Optional[str] = None
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class AwardCreate(AwardBase):
    pass

class AwardUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    award_date: Optional[str] = None
    description: Optional[str] = None
    certificate_url: Optional[str] = None
    external_url: Optional[str] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class AwardResponse(AwardBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
