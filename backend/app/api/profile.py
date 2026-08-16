from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import Profile
from app.models.media import Media
from app.models.user import User
from app.schemas.profile import ProfileResponse, ProfileUpdate
from app.auth.deps import get_current_user
from app.services.storage import save_upload_file

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(
            name="Jeff G. Wilson",
            headline="Computer Engineer | Data Scientist | AI / ML Researcher",
            short_bio="I build intelligent software, data-driven systems, and research-driven AI solutions. Exploring the intersection of high-performance computing and machine learning.",
            status_text="STATUS: ONLINE"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(**profile_in.model_dump())
        db.add(profile)
    else:
        for field, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/avatar", response_model=ProfileResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_info = await save_upload_file(file, subfolder="profile")
    
    # Save to media table as well
    media_entry = Media(
        filename=file_info["filename"],
        original_filename=file_info["original_filename"],
        file_path=file_info["file_path"],
        file_url=file_info["file_url"],
        file_type=file_info["file_type"],
        mime_type=file_info["mime_type"],
        file_size=file_info["file_size"],
        category="profile"
    )
    db.add(media_entry)
    
    profile = db.query(Profile).first()
    if not profile:
        profile = Profile(avatar_url=file_info["file_url"])
        db.add(profile)
    else:
        profile.avatar_url = file_info["file_url"]
        
    db.commit()
    db.refresh(profile)
    return profile
