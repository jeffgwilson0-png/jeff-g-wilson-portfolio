from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Conference(Base):
    __tablename__ = "conferences"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(255), nullable=False)
    location = Column(String(255), default="Saurashtra & Kutch, India")
    date_string = Column(String(100), default="January 2026")
    role = Column(String(255), default="Volunteer — Documentation Committee")
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    certificate_url = Column(String(500), nullable=True)
    external_url = Column(String(500), nullable=True)
    
    featured = Column(Boolean, default=True)
    published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
