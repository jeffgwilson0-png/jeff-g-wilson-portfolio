from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.cv import CV
from app.models.media import Media
from app.models.user import User
from app.schemas.cv import CVResponse, CVUpdate
from app.auth.deps import get_current_user
from app.services.storage import save_upload_file
from app.config import settings

router = APIRouter(prefix="/cv", tags=["CV Management"])

@router.get("/active", response_model=Optional[CVResponse])
def get_active_cv(db: Session = Depends(get_db)):
    active_cv = db.query(CV).filter(CV.is_active == True).order_by(CV.created_at.desc()).first()
    if not active_cv:
        # Fallback to newest CV
        active_cv = db.query(CV).order_by(CV.created_at.desc()).first()
    return active_cv

@router.get("/download")
def download_active_cv(db: Session = Depends(get_db)):
    active_cv = db.query(CV).filter(CV.is_active == True).order_by(CV.created_at.desc()).first()
    if not active_cv:
        active_cv = db.query(CV).order_by(CV.created_at.desc()).first()
    
    file_path = None
    download_filename = "Jeff_G_Wilson_CV.pdf"
    
    if active_cv:
        download_filename = active_cv.title if active_cv.title and active_cv.title.endswith('.pdf') else (active_cv.filename or "Jeff_G_Wilson_CV.pdf")
        if not download_filename.endswith('.pdf'):
            download_filename += '.pdf'
        
        # Check standard upload location
        potential_path = os.path.join(settings.UPLOAD_DIR, "cv", active_cv.filename)
        if os.path.exists(potential_path):
            file_path = potential_path
        elif active_cv.file_url:
            clean_rel = active_cv.file_url.lstrip("/").replace("uploads/", "")
            potential_path = os.path.join(settings.UPLOAD_DIR, clean_rel)
            if os.path.exists(potential_path):
                file_path = potential_path

    # Fallback to any PDF in cv uploads folder if specific file path not resolved
    if not file_path or not os.path.exists(file_path):
        cv_dir = os.path.join(settings.UPLOAD_DIR, "cv")
        if os.path.exists(cv_dir):
            for f in os.listdir(cv_dir):
                if f.lower().endswith(".pdf"):
                    file_path = os.path.join(cv_dir, f)
                    break
    
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="CV PDF file not found on server")
    
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=download_filename,
        headers={
            "Content-Disposition": f'attachment; filename="{download_filename}"'
        }
    )

@router.get("/{cv_id}/download")
def download_cv_by_id(cv_id: int, db: Session = Depends(get_db)):
    cv = db.query(CV).filter(CV.id == cv_id).first()
    if not cv:
        raise HTTPException(status_code=404, detail="CV not found")
    
    download_filename = cv.title if cv.title and cv.title.endswith('.pdf') else (cv.filename or "Jeff_G_Wilson_CV.pdf")
    if not download_filename.endswith('.pdf'):
        download_filename += '.pdf'
        
    potential_path = os.path.join(settings.UPLOAD_DIR, "cv", cv.filename)
    if not os.path.exists(potential_path) and cv.file_url:
        clean_rel = cv.file_url.lstrip("/").replace("uploads/", "")
        potential_path = os.path.join(settings.UPLOAD_DIR, clean_rel)
        
    if not os.path.exists(potential_path):
        raise HTTPException(status_code=404, detail="CV PDF file not found on server")
        
    return FileResponse(
        path=potential_path,
        media_type="application/pdf",
        filename=download_filename,
        headers={
            "Content-Disposition": f'attachment; filename="{download_filename}"'
        }
    )

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
