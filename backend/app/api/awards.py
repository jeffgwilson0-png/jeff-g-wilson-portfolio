from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.award import Award
from app.models.user import User
from app.schemas.award import AwardResponse, AwardCreate, AwardUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/awards", tags=["Awards"])

@router.get("", response_model=List[AwardResponse])
def get_awards(published_only: bool = Query(True), db: Session = Depends(get_db)):
    query = db.query(Award)
    if published_only:
        query = query.filter(Award.published == True)
    return query.order_by(Award.order_index.asc(), Award.created_at.desc()).all()

@router.get("/admin/all", response_model=List[AwardResponse])
def get_admin_all_awards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Award).order_by(Award.order_index.asc(), Award.created_at.desc()).all()

@router.post("", response_model=AwardResponse, status_code=status.HTTP_201_CREATED)
def create_award(
    award_in: AwardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Award(**award_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{award_id}", response_model=AwardResponse)
def update_award(
    award_id: int,
    award_in: AwardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Award).filter(Award.id == award_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Award not found")
    for field, value in award_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{award_id}")
def delete_award(
    award_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Award).filter(Award.id == award_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Award not found")
    db.delete(item)
    db.commit()
    return {"message": "Award deleted successfully"}
