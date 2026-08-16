from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String(255), nullable=False)
    field_of_study = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    start_date = Column(String(100), nullable=False)
    end_date = Column(String(100), nullable=True)
    is_current = Column(Boolean, default=False)
    grade = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    
    published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
