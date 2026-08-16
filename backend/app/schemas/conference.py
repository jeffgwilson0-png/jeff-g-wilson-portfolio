from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ConferenceBase(BaseModel):
    event_name: str
    location: Optional[str] = "Saurashtra & Kutch, India"
    date_string: Optional[str] = "January 2026"
    role: Optional[str] = "Volunteer — Documentation Committee"
    description: Optional[str] = None
    image_url: Optional[str] = None
    certificate_url: Optional[str] = None
    external_url: Optional[str] = None
    featured: Optional[bool] = True
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class ConferenceCreate(ConferenceBase):
    pass

class ConferenceUpdate(BaseModel):
    event_name: Optional[str] = None
    location: Optional[str] = None
    date_string: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    certificate_url: Optional[str] = None
    external_url: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class ConferenceResponse(ConferenceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
