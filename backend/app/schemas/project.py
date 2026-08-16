from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    slug: Optional[str] = None
    short_description: str
    full_description: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[str] = None
    category: Optional[str] = "Web Application"
    technologies: Optional[str] = ""
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    research_url: Optional[str] = None
    featured: Optional[bool] = False
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    image_url: Optional[str] = None
    gallery: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[str] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    research_url: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
