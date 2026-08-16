from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.certification import Certification
from app.models.user import User
from app.schemas.certification import CertificationResponse, CertificationCreate, CertificationUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/certifications", tags=["Certifications"])

@router.get("", response_model=List[CertificationResponse])
def get_certifications(published_only: bool = Query(True), db: Session = Depends(get_db)):
    query = db.query(Certification)
    if published_only:
        query = query.filter(Certification.published == True)
    return query.order_by(Certification.order_index.asc(), Certification.created_at.desc()).all()

@router.get("/admin/all", response_model=List[CertificationResponse])
def get_admin_all_certifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Certification).order_by(Certification.order_index.asc(), Certification.created_at.desc()).all()

@router.post("", response_model=CertificationResponse, status_code=status.HTTP_201_CREATED)
def create_certification(
    cert_in: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Certification(**cert_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{cert_id}", response_model=CertificationResponse)
def update_certification(
    cert_id: int,
    cert_in: CertificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Certification).filter(Certification.id == cert_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Certification not found")
    for field, value in cert_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{cert_id}")
def delete_certification(
    cert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Certification).filter(Certification.id == cert_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Certification not found")
    db.delete(item)
    db.commit()
    return {"message": "Certification deleted successfully"}
