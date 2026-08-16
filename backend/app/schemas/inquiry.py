from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class InquiryCreate(BaseModel):
    category: str  # "research", "web", "mobile", "general"
    full_name: str
    email: EmailStr
    company_or_institution: Optional[str] = None
    project_title_or_name: Optional[str] = None
    research_area: Optional[str] = None
    project_type: Optional[str] = None
    platform: Optional[str] = None
    has_design: Optional[bool] = False
    budget: Optional[str] = None
    timeline: Optional[str] = None
    description_or_message: str

class InquiryUpdateStatus(BaseModel):
    status: str  # "new", "reviewing", "contacted", "in_discussion", "completed", "archived"
    notes: Optional[str] = None

class InquiryResponse(BaseModel):
    id: int
    category: str
    full_name: str
    email: str
    company_or_institution: Optional[str] = None
    project_title_or_name: Optional[str] = None
    research_area: Optional[str] = None
    project_type: Optional[str] = None
    platform: Optional[str] = None
    has_design: Optional[bool] = False
    budget: Optional[str] = None
    timeline: Optional[str] = None
    description_or_message: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
