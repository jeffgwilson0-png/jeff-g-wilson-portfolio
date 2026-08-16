from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EducationBase(BaseModel):
    degree: str
    field_of_study: str
    institution: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: Optional[bool] = False
    grade: Optional[str] = None
    description: Optional[str] = None
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    institution: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: Optional[bool] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
