from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MediaResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    file_path: str
    file_url: str
    file_type: str
    mime_type: str
    file_size: int
    category: str
    created_at: datetime

    class Config:
        from_attributes = True
