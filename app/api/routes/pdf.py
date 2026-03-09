from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.deps import save_upload_file, allowed_file

router = APIRouter()


