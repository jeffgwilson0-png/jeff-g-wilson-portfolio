from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="Programming")  # Programming, AI / Machine Learning, Data Science, Cloud, Development, Design, Other
    proficiency = Column(Integer, default=90)  # 1 to 100
    icon_name = Column(String(100), nullable=True)  # Lucide icon identifier or symbol
    featured = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
