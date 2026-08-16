from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.inquiry import Inquiry
from app.models.user import User
from app.schemas.inquiry import InquiryResponse, InquiryCreate, InquiryUpdateStatus
from app.auth.deps import get_current_user

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])

@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_inquiry(
    inquiry_in: InquiryCreate,
    db: Session = Depends(get_db)
):
    inquiry = Inquiry(**inquiry_in.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.get("", response_model=List[InquiryResponse])
def get_inquiries(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Inquiry)
    if category:
        query = query.filter(Inquiry.category == category)
    if status:
        query = query.filter(Inquiry.status == status)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Inquiry.full_name.ilike(search_pattern)) |
            (Inquiry.email.ilike(search_pattern)) |
            (Inquiry.description_or_message.ilike(search_pattern))
        )
    return query.order_by(Inquiry.created_at.desc()).all()

@router.get("/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry(
    inquiry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry

@router.put("/{inquiry_id}/status", response_model=InquiryResponse)
def update_inquiry_status(
    inquiry_id: int,
    status_update: InquiryUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry.status = status_update.status
    if status_update.notes is not None:
        inquiry.notes = status_update.notes
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.delete("/{inquiry_id}")
def delete_inquiry(
    inquiry_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inquiry)
    db.commit()
    return {"message": "Inquiry deleted successfully"}
