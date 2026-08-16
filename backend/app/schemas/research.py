from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResearchBase(BaseModel):
    title: str
    slug: Optional[str] = None
    authors: Optional[str] = "Jeff G. Wilson"
    abstract: str
    research_area: Optional[str] = "Artificial Intelligence / NLP / RAG"
    methodology: Optional[str] = None
    technologies: Optional[str] = ""
    conference_journal: Optional[str] = "IEEE Gujarat Section"
    publication_status: Optional[str] = "Under Review"
    year: Optional[str] = "2024"
    doi: Optional[str] = None
    external_url: Optional[str] = None
    pdf_url: Optional[str] = None
    featured_image_url: Optional[str] = None
    featured: Optional[bool] = True
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class ResearchCreate(ResearchBase):
    pass

class ResearchUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    authors: Optional[str] = None
    abstract: Optional[str] = None
    research_area: Optional[str] = None
    methodology: Optional[str] = None
    technologies: Optional[str] = None
    conference_journal: Optional[str] = None
    publication_status: Optional[str] = None
    year: Optional[str] = None
    doi: Optional[str] = None
    external_url: Optional[str] = None
    pdf_url: Optional[str] = None
    featured_image_url: Optional[str] = None
    featured: Optional[bool] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class ResearchResponse(ResearchBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
