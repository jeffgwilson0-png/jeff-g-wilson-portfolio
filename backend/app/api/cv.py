from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.cv import CV
from app.models.media import Media
from app.models.user import User
from app.schemas.cv import CVResponse, CVUpdate
from app.auth.deps import get_current_user
from app.services.storage import save_upload_file

router = APIRouter(prefix="/cv", tags=["CV Management"])

@router.get("/active", response_model=Optional[CVResponse])
def get_active_cv(db: Session = Depends(get_db)):
    active_cv = db.query(CV).filter(CV.is_active == True).order_by(CV.created_at.desc()).first()
    if not active_cv:
        # Fallback to newest CV
        active_cv = db.query(CV).order_by(CV.created_at.desc()).first()
    return active_cv

@router.get("/all", response_model=List[CVResponse])
def get_all_cvs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(CV).order_by(CV.created_at.desc()).all()

@router.post("/upload", response_model=CVResponse)
async def upload_cv(
    file: UploadFile = File(...),
    title: str = Form("Jeff_G_Wilson_CV.pdf"),
    version: str = Form("1.0"),
    set_active: bool = Form(True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_info = await save_upload_file(file, subfolder="cv")
    
    if set_active:
        db.query(CV).update({CV.is_active: False})
        
    cv = CV(
        title=title,
        filename=file_info["filename"],
        file_url=file_info["file_url"],
        file_size=file_info["file_size"],
        version=version,
        is_active=set_active
    )
    db.add(cv)
    
    # Also record in media table
    media = Media(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_url=file_info["file_url"],
        file_type="pdf",
        mime_type=file_info["mime_type"],
        file_size=file_info["file_size"],
        category="cv"
    )
    db.add(media)
    
    db.commit()
    db.refresh(cv)
    return cv

@router.put("/{cv_id}/activate", response_model=CVResponse)
def activate_cv(
    cv_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = db.query(CV).filter(CV.id == cv_id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
        
    db.query(CV).update({CV.is_active: False})
    cv.is_active = True
    db.commit()
    db.refresh(cv)
    return cv

@router.delete("/{cv_id}")
def delete_cv(
    cv_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = db.query(CV).filter(CV.id == cv_id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    db.delete(cv)
    db.commit()
    return {"message": "CV deleted successfully"}
