from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.research import Research
from app.models.user import User
from app.schemas.research import ResearchResponse, ResearchCreate, ResearchUpdate
from app.auth.deps import get_current_user
from app.utils.slug import slugify

router = APIRouter(prefix="/research", tags=["Research"])

@router.get("", response_model=List[ResearchResponse])
def get_research_list(
    featured: Optional[bool] = Query(None),
    published_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    query = db.query(Research)
    if published_only:
        query = query.filter(Research.published == True)
    if featured is not None:
        query = query.filter(Research.featured == featured)
    return query.order_by(Research.order_index.asc(), Research.created_at.desc()).all()

@router.get("/admin/all", response_model=List[ResearchResponse])
def get_admin_all_research(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Research).order_by(Research.order_index.asc(), Research.created_at.desc()).all()

@router.get("/{slug_or_id}", response_model=ResearchResponse)
def get_research_item(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        item = db.query(Research).filter(Research.id == int(slug_or_id)).first()
    else:
        item = db.query(Research).filter(Research.slug == slug_or_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Research item not found")
    return item

@router.post("", response_model=ResearchResponse, status_code=status.HTTP_201_CREATED)
def create_research(
    research_in: ResearchCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    slug = research_in.slug or slugify(research_in.title)
    base_slug = slug
    counter = 1
    while db.query(Research).filter(Research.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    data = research_in.model_dump()
    data["slug"] = slug
    
    item = Research(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{research_id}", response_model=ResearchResponse)
def update_research(
    research_id: int,
    research_in: ResearchUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Research).filter(Research.id == research_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Research item not found")
        
    update_data = research_in.model_dump(exclude_unset=True)
    if "title" in update_data and not update_data.get("slug"):
        update_data["slug"] = slugify(update_data["title"])
        
    for field, value in update_data.items():
        setattr(item, field, value)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{research_id}")
def delete_research(
    research_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Research).filter(Research.id == research_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Research item not found")
    db.delete(item)
    db.commit()
    return {"message": "Research item deleted successfully"}
