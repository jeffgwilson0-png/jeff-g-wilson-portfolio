from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.education import Education
from app.models.user import User
from app.schemas.education import EducationResponse, EducationCreate, EducationUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/education", tags=["Education"])

@router.get("", response_model=List[EducationResponse])
def get_education_list(published_only: bool = Query(True), db: Session = Depends(get_db)):
    query = db.query(Education)
    if published_only:
        query = query.filter(Education.published == True)
    return query.order_by(Education.order_index.asc(), Education.created_at.desc()).all()

@router.get("/admin/all", response_model=List[EducationResponse])
def get_admin_all_education(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Education).order_by(Education.order_index.asc(), Education.created_at.desc()).all()

@router.post("", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_education(
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Education(**edu_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{edu_id}", response_model=EducationResponse)
def update_education(
    edu_id: int,
    edu_in: EducationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Education).filter(Education.id == edu_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education item not found")
    for field, value in edu_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{edu_id}")
def delete_education(
    edu_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Education).filter(Education.id == edu_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Education item not found")
    db.delete(item)
    db.commit()
    return {"message": "Education item deleted successfully"}
