from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: Optional[str] = "Programming"
    proficiency: Optional[int] = 90
    icon_name: Optional[str] = None
    featured: Optional[bool] = True
    order_index: Optional[int] = 0

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = None
    icon_name: Optional[str] = None
    featured: Optional[bool] = None
    order_index: Optional[int] = None

class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
