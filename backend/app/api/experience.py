from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.experience import Experience
from app.models.user import User
from app.schemas.experience import ExperienceResponse, ExperienceCreate, ExperienceUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/experience", tags=["Experience"])

@router.get("", response_model=List[ExperienceResponse])
def get_experiences(published_only: bool = Query(True), db: Session = Depends(get_db)):
    query = db.query(Experience)
    if published_only:
        query = query.filter(Experience.published == True)
    return query.order_by(Experience.order_index.asc(), Experience.created_at.desc()).all()

@router.get("/admin/all", response_model=List[ExperienceResponse])
def get_admin_all_experiences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Experience).order_by(Experience.order_index.asc(), Experience.created_at.desc()).all()

@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_experience(
    exp_in: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Experience(**exp_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{exp_id}", response_model=ExperienceResponse)
def update_experience(
    exp_id: int,
    exp_in: ExperienceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Experience).filter(Experience.id == exp_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    for field, value in exp_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{exp_id}")
def delete_experience(
    exp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Experience).filter(Experience.id == exp_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Experience not found")
    db.delete(item)
    db.commit()
    return {"message": "Experience deleted successfully"}
