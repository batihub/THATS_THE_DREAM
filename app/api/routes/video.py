from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from app.api.deps import allowed_file, save_upload_file
from app.core.database import get_session
from app.core.celery_app import celery_app
from app.crud.job import create_job

router = APIRouter(prefix="/api/video", tags=["Video"])

VIDEO_EXTS = ["mp4", "mov", "mkv", "avi", "webm"]


@router.post("/convert")
async def convert_video(
    file: UploadFile = File(...),
    target_format: str = Form(...),
    session: AsyncSession = Depends(get_session),
):
    """Convert video to target format. target_format: mp4, avi, mkv, mov, webm"""
    if not allowed_file(file.filename, VIDEO_EXTS):
        raise HTTPException(400, f"Unsupported video format. Allowed: {VIDEO_EXTS}")
    if target_format not in VIDEO_EXTS:
        raise HTTPException(400, f"Unsupported target format. Allowed: {VIDEO_EXTS}")
    job_id, saved_path = await save_upload_file(file)
    await create_job(session, job_id, f"video_convert_{target_format}", file.filename)
    celery_app.send_task(
        "app.workers.video_tasks.convert_video_task",
        args=[saved_path, job_id, target_format],
        queue="heavy",
    )
    return {"job_id": job_id, "status": "queued"}


@router.post("/compress")
async def compress_video(
    file: UploadFile = File(...),
    quality: str = Form(default="medium"),
    session: AsyncSession = Depends(get_session),
):
    """Compress video. quality: low, medium, high"""
    if not allowed_file(file.filename, VIDEO_EXTS):
        raise HTTPException(400, f"Unsupported video format. Allowed: {VIDEO_EXTS}")
    if quality not in ("low", "medium", "high"):
        raise HTTPException(400, "quality must be low, medium, or high")
    job_id, saved_path = await save_upload_file(file)
    await create_job(session, job_id, "video_compress", file.filename)
    celery_app.send_task(
        "app.workers.video_tasks.compress_video_task",
        args=[saved_path, job_id, quality],
        queue="heavy",
    )
    return {"job_id": job_id, "status": "queued"}
