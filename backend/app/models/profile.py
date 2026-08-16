from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), default="Jeff G. Wilson", nullable=False)
    headline = Column(String(255), default="Computer Engineer | Data Scientist | AI / ML Researcher")
    titles = Column(Text, default="Computer Engineer,Data Scientist,AI/ML Researcher,Software Developer")
    short_bio = Column(Text, default="I build intelligent software, data-driven systems, and research-driven AI solutions. Exploring the intersection of high-performance computing and machine learning.")
    full_bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    status_text = Column(String(255), default="STATUS: ONLINE")
    currently_exploring = Column(String(255), default="Advanced RAG Architectures")
    
    email = Column(String(255), default="jeffgwilson@example.com")
    phone = Column(String(100), nullable=True)
    location = Column(String(255), default="Rajkot, Gujarat, India")
    
    github_url = Column(String(500), default="https://github.com")
    linkedin_url = Column(String(500), default="https://linkedin.com")
    instagram_url = Column(String(500), default="https://instagram.com")
    twitter_url = Column(String(500), nullable=True)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
