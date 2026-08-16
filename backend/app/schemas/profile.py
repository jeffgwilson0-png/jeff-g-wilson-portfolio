from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProfileBase(BaseModel):
    name: str
    headline: Optional[str] = None
    titles: Optional[str] = None
    short_bio: Optional[str] = None
    full_bio: Optional[str] = None
    avatar_url: Optional[str] = None
    status_text: Optional[str] = "STATUS: ONLINE"
    currently_exploring: Optional[str] = "Advanced RAG Architectures"
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_url: Optional[str] = None
    twitter_url: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
