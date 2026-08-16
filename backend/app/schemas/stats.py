from pydantic import BaseModel
from typing import List, Dict, Any

class ActivityItem(BaseModel):
    id: str
    title: str
    type: str  # project, research, cv, inquiry, setting, experience
    description: str
    timestamp: str

class AdminStatsResponse(BaseModel):
    total_projects: int
    total_research: int
    total_skills: int
    total_experience: int
    total_conferences: int
    total_certifications: int
    total_awards: int
    unread_inquiries: int
    total_inquiries: int
    inquiry_categories: Dict[str, int]
    recent_activities: List[ActivityItem]
