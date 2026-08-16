from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CertificationBase(BaseModel):
    name: str
    issuing_organization: str
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    description: Optional[str] = None
    published: Optional[bool] = True
    order_index: Optional[int] = 0

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None
    image_url: Optional[str] = None
    pdf_url: Optional[str] = None
    description: Optional[str] = None
    published: Optional[bool] = None
    order_index: Optional[int] = None

class CertificationResponse(CertificationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
