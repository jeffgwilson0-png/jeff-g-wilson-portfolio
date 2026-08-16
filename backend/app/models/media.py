from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(String(50), default="image")  # image, pdf, document, other
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, default=0)  # bytes
    category = Column(String(100), default="general")  # profile, projects, research, certificates, conferences, cv, general
    
    created_at = Column(DateTime, default=datetime.utcnow)
