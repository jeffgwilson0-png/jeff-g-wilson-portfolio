from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)  # "research", "web", "mobile", "general"
    
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    
    # Optional / category-specific fields:
    company_or_institution = Column(String(255), nullable=True)
    project_title_or_name = Column(String(255), nullable=True)
    research_area = Column(String(255), nullable=True)
    project_type = Column(String(100), nullable=True)
    platform = Column(String(100), nullable=True)  # e.g., "Android", "iOS", "Both"
    has_design = Column(Boolean, default=False)
    budget = Column(String(100), nullable=True)
    timeline = Column(String(100), nullable=True)
    description_or_message = Column(Text, nullable=False)
    
    status = Column(String(50), default="new")  # "new", "reviewing", "contacted", "in_discussion", "completed", "archived"
    notes = Column(Text, nullable=True)  # Admin internal notes
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
