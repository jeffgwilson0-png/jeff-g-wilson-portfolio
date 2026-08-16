from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Research(Base):
    __tablename__ = "research"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    authors = Column(String(500), default="Jeff G. Wilson")
    abstract = Column(Text, nullable=False)
    research_area = Column(String(255), default="Artificial Intelligence / NLP / RAG")
    methodology = Column(Text, nullable=True)
    technologies = Column(Text, default="")
    conference_journal = Column(String(255), default="IEEE Gujarat Section")
    publication_status = Column(String(100), default="Under Review")  # "Submitted / Under Review", "Published", "Preprint"
    year = Column(String(50), default="2024")
    
    doi = Column(String(255), nullable=True)
    external_url = Column(String(500), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    featured_image_url = Column(String(500), nullable=True)
    
    featured = Column(Boolean, default=True)
    published = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
