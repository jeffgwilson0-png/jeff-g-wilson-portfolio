import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.media import Media
from app.models.user import User
from app.schemas.media import MediaResponse
from app.auth.deps import get_current_user
from app.services.storage import save_upload_file

router = APIRouter(prefix="/media", tags=["Media Library"])

@router.get("", response_model=List[MediaResponse])
def get_media_items(
    category: Optional[str] = Query(None),
    file_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Media)
    if category:
        query = query.filter(Media.category == category)
    if file_type:
        query = query.filter(Media.file_type == file_type)
    return query.order_by(Media.created_at.desc()).all()

@router.post("/upload", response_model=MediaResponse)
async def upload_media_file(
    file: UploadFile = File(...),
    category: str = Form("general"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_info = await save_upload_file(file, subfolder=category)
    
    media = Media(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_url=file_info["file_url"],
        file_type=file_info["file_type"],
        mime_type=file_info["mime_type"],
        file_size=file_info["file_size"],
        category=category
    )
    db.add(media)
    db.commit()
    db.refresh(media)
    return media

@router.delete("/{media_id}")
def delete_media_item(
    media_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(Media).filter(Media.id == media_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Media item not found")
    
    # Try deleting physical file
    if os.path.exists(item.file_path):
        try:
            os.remove(item.file_path)
        except Exception:
            pass
            
    db.delete(item)
    db.commit()
    return {"message": "Media item deleted successfully"}
