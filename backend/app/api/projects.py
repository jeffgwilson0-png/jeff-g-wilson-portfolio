from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectResponse, ProjectCreate, ProjectUpdate
from app.auth.deps import get_current_user
from app.utils.slug import slugify

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def get_projects(
    featured: Optional[bool] = Query(None),
    category: Optional[str] = Query(None),
    published_only: bool = Query(True),
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    if published_only:
        query = query.filter(Project.published == True)
    if featured is not None:
        query = query.filter(Project.featured == featured)
    if category:
        query = query.filter(Project.category == category)
    return query.order_by(Project.order_index.asc(), Project.created_at.desc()).all()

@router.get("/admin/all", response_model=List[ProjectResponse])
def get_admin_all_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Project).order_by(Project.order_index.asc(), Project.created_at.desc()).all()

@router.get("/{slug_or_id}", response_model=ProjectResponse)
def get_project(slug_or_id: str, db: Session = Depends(get_db)):
    if slug_or_id.isdigit():
        project = db.query(Project).filter(Project.id == int(slug_or_id)).first()
    else:
        project = db.query(Project).filter(Project.slug == slug_or_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    slug = project_in.slug or slugify(project_in.title)
    
    # Ensure unique slug
    base_slug = slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    project_data = project_in.model_dump()
    project_data["slug"] = slug
    
    project = Project(**project_data)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_in: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    update_data = project_in.model_dump(exclude_unset=True)
    if "title" in update_data and not update_data.get("slug"):
        # Auto-update slug if title changed and slug wasn't explicitly given
        update_data["slug"] = slugify(update_data["title"])
        
    for field, value in update_data.items():
        setattr(project, field, value)
        
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}
