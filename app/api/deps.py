from fastapi import UploadFile, HTTPException, Depends
import os
import uuid
import aiofiles
from app.core.config import settings

def allowed_file(filename: str, allowed: list[str]) -> bool:
    pass


async def save_upload_file(file: UploadFile) -> tuple[str , str]:
    pass
