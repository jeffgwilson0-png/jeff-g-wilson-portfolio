from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    short_description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    gallery = Column(Text, nullable=True)  # JSON string or comma-separated list of image URLs
    category = Column(String(100), default="Web Application")  # e.g., AI Research, Web Application, Data Platform, ML System
    technologies = Column(Text, default="")  # comma-separated or JSON list e.g. "React,Node.js,PostgreSQL"
    
    github_url = Column(String(500), nullable=True)
    live_demo_url = Column(String(500), nullable=True)
    research_url = Column(String(500), nullable=True)
    
    featured = Column(Boolean, default=False)
    published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
