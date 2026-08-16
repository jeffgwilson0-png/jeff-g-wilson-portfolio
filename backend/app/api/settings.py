from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, List
from app.database import get_db
from app.models.setting import SiteSetting
from app.models.user import User
from app.schemas.setting import SiteSettingResponse, SiteSettingUpdate, SiteSettingsBulkUpdate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/settings", tags=["Site Settings"])

@router.get("", response_model=Dict[str, str])
def get_all_settings(db: Session = Depends(get_db)):
    settings_list = db.query(SiteSetting).all()
    return {s.key: (s.value or "") for s in settings_list}

@router.get("/list", response_model=List[SiteSettingResponse])
def get_settings_list(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(SiteSetting).all()

@router.put("/bulk")
def update_bulk_settings(
    bulk_in: SiteSettingsBulkUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for key, value in bulk_in.settings.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            setting = SiteSetting(key=key, value=str(value))
            db.add(setting)
    db.commit()
    return {"message": "Settings updated successfully"}

@router.put("/{key}", response_model=SiteSettingResponse)
def update_setting(
    key: str,
    setting_in: SiteSettingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
    if not setting:
        setting = SiteSetting(key=key, value=setting_in.value)
        db.add(setting)
    else:
        setting.value = setting_in.value
    db.commit()
    db.refresh(setting)
    return setting
