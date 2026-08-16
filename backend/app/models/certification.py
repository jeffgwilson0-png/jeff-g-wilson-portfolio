from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Certification(Base):
    __tablename__ = "certifications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    issuing_organization = Column(String(255), nullable=False)
    issue_date = Column(String(100), nullable=True)
    expiry_date = Column(String(100), nullable=True)
    credential_id = Column(String(255), nullable=True)
    verification_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    
    published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
