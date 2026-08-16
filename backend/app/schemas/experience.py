from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ExperienceBase(BaseModel):
    role: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: Optional[bool] = False
    description: Optional[str] = None
    technologies: Optional[str] = ""
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    technologies: Optional[str] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
