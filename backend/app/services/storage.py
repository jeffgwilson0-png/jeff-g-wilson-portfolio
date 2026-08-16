import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException, status
from app.config import settings

ALLOWED_EXTENSIONS = {
    "image": {".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"},
    "pdf": {".pdf"},
    "document": {".pdf", ".doc", ".docx", ".txt", ".md"},
}

MAX_SIZE_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

def get_file_type(extension: str) -> str:
    ext = extension.lower()
    if ext in ALLOWED_EXTENSIONS["image"]:
        return "image"
    elif ext in ALLOWED_EXTENSIONS["pdf"]:
        return "pdf"
    elif ext in ALLOWED_EXTENSIONS["document"]:
        return "document"
    return "other"

async def save_upload_file(file: UploadFile, subfolder: str = "general") -> dict:
    original_filename = file.filename or "file"
    ext = os.path.splitext(original_filename)[1].lower()
    
    # Validation
    valid_exts = ALLOWED_EXTENSIONS["image"] | ALLOWED_EXTENSIONS["document"]
    if ext not in valid_exts:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension '{ext}' is not allowed."
        )

    # Generate secure unique filename
    unique_filename = f"{uuid.uuid4().hex[:12]}_{original_filename.replace(' ', '_')}"
    
    target_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(target_dir, exist_ok=True)
    
    file_path = os.path.join(target_dir, unique_filename)
    
    # Read and write in chunks to calculate size and save
    size = 0
    async with aiofiles.open(file_path, 'wb') as out_file:
        while content := await file.read(1024 * 1024):  # 1MB chunks
            size += len(content)
            if size > MAX_SIZE_BYTES:
                # Clean up partially written file
                try:
                    os.remove(file_path)
                except Exception:
                    pass
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB"
                )
            await out_file.write(content)
            
    # Formulate URL
    relative_url = f"/uploads/{subfolder}/{unique_filename}"
    file_type = get_file_type(ext)
    
    return {
        "filename": unique_filename,
        "original_filename": original_filename,
        "file_path": file_path,
        "file_url": relative_url,
        "file_type": file_type,
        "mime_type": file.content_type or "application/octet-stream",
        "file_size": size,
        "category": subfolder
    }
