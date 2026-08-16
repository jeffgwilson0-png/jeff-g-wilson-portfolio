from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.conference import Conference
from app.models.user import User
from app.schemas.conference import ConferenceResponse, ConferenceCreate, ConferenceUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/conferences", tags=["Conferences"])

@router.get("", response_model=List[ConferenceResponse])
def get_conferences(published_only: bool = Query(True), db: Session = Depends(get_db)):
    query = db.query(Conference)
    if published_only:
        query = query.filter(Conference.published == True)
    return query.order_by(Conference.order_index.asc(), Conference.created_at.desc()).all()

@router.get("/admin/all", response_model=List[ConferenceResponse])
def get_admin_all_conferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Conference).order_by(Conference.order_index.asc(), Conference.created_at.desc()).all()

@router.post("", response_model=ConferenceResponse, status_code=status.HTTP_201_CREATED)
def create_conference(
    conf_in: ConferenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Conference(**conf_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{conf_id}", response_model=ConferenceResponse)
def update_conference(
    conf_id: int,
    conf_in: ConferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Conference).filter(Conference.id == conf_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Conference not found")
    for field, value in conf_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{conf_id}")
def delete_conference(
    conf_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Conference).filter(Conference.id == conf_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Conference not found")
    db.delete(item)
    db.commit()
    return {"message": "Conference deleted successfully"}
