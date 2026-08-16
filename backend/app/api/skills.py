from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill import SkillResponse, SkillCreate, SkillUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/skills", tags=["Skills"])

@router.get("", response_model=List[SkillResponse])
def get_skills(
    category: Optional[str] = Query(None),
    featured_only: bool = Query(False),
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    if category:
        query = query.filter(Skill.category == category)
    if featured_only:
        query = query.filter(Skill.featured == True)
    return query.order_by(Skill.order_index.asc(), Skill.name.asc()).all()

@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = Skill(**skill_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{skill_id}", response_model=SkillResponse)
def update_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    for field, value in skill_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Skill).filter(Skill.id == skill_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(item)
    db.commit()
    return {"message": "Skill deleted successfully"}
