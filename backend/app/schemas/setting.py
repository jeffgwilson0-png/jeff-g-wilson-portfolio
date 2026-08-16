from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class SiteSettingBase(BaseModel):
    key: str
    value: Optional[str] = None
    description: Optional[str] = None

class SiteSettingUpdate(BaseModel):
    value: str

class SiteSettingResponse(SiteSettingBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

class SiteSettingsBulkUpdate(BaseModel):
    settings: Dict[str, str]
