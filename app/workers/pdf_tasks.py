import os
import glob
from app.core.celery_app import celery_app
from app.core.config import settings
from app import services


@celery_app.task(name="app.workers.pdf_tasks.compress_pdf_task")
def compress_pdf_task(input_path: str, job_id: str, quality: str = "medium"):
    from app.services.pdf_service import compress_pdf
    _run_task(job_id, lambda: compress_pdf(input_path, job_id, quality), input_path)


@celery_app.task(name="app.workers.pdf_tasks.pdf_to_word_task")
def pdf_to_word_task(input_path: str, job_id: str):
    from app.services.pdf_service import pdf_to_word
    _run_task(job_id, lambda: pdf_to_word(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.pdf_to_images_task")
def pdf_to_images_task(input_path: str, job_id: str):
    from app.services.pdf_service import pdf_to_images
    _run_task(job_id, lambda: pdf_to_images(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.images_to_pdf_task")
def images_to_pdf_task(input_paths: list[str], job_id: str):
    from app.services.pdf_service import images_to_pdf
    _run_task(job_id, lambda: images_to_pdf(input_paths, job_id), input_paths[0] if input_paths else None)


@celery_app.task(name="app.workers.pdf_tasks.merge_pdfs_task")
def merge_pdfs_task(input_paths: list[str], job_id: str):
    from app.services.pdf_service import merge_pdfs
    _run_task(job_id, lambda: merge_pdfs(input_paths, job_id), input_paths[0] if input_paths else None)


@celery_app.task(name="app.workers.pdf_tasks.split_pdf_task")
def split_pdf_task(input_path: str, job_id: str, pages: str):
    from app.services.pdf_service import split_pdf
    _run_task(job_id, lambda: split_pdf(input_path, job_id, pages), input_path)


@celery_app.task(name="app.workers.pdf_tasks.strip_pdf_metadata_task")
def strip_pdf_metadata_task(input_path: str, job_id: str):
    from app.services.pdf_service import strip_pdf_metadata
    _run_task(job_id, lambda: strip_pdf_metadata(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.word_to_pdf_task")
def word_to_pdf_task(input_path: str, job_id: str):
    from app.services.pdf_service import word_to_pdf
    _run_task(job_id, lambda: word_to_pdf(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.ppt_to_pdf_task")
def ppt_to_pdf_task(input_path: str, job_id: str):
    from app.services.pdf_service import ppt_to_pdf
    _run_task(job_id, lambda: ppt_to_pdf(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.excel_to_pdf_task")
def excel_to_pdf_task(input_path: str, job_id: str):
    from app.services.pdf_service import excel_to_pdf
    _run_task(job_id, lambda: excel_to_pdf(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.unlock_pdf_task")
def unlock_pdf_task(input_path: str, job_id: str, password: str = ""):
    from app.services.pdf_service import unlock_pdf
    _run_task(job_id, lambda: unlock_pdf(input_path, job_id, password), input_path)


@celery_app.task(name="app.workers.pdf_tasks.pdf_to_excel_task")
def pdf_to_excel_task(input_path: str, job_id: str):
    from app.services.pdf_service import pdf_to_excel
    _run_task(job_id, lambda: pdf_to_excel(input_path, job_id), input_path)


@celery_app.task(name="app.workers.pdf_tasks.cleanup_expired_files")
def cleanup_expired_files():
    """Delete upload and output files older than FILE_TTL_MINUTES."""
    import time
    ttl_seconds = settings.FILE_TTL_MINUTES * 60
    now = time.time()
    deleted = 0
    for directory in [settings.UPLOAD_DIR, settings.OUTPUT_DIR]:
        if not os.path.exists(directory):
            continue
        for filepath in glob.glob(os.path.join(directory, "*")):
            if os.path.isfile(filepath):
                age = now - os.path.getmtime(filepath)
                if age > ttl_seconds:
                    os.remove(filepath)
                    deleted += 1
    return {"deleted_files": deleted}


def _run_task(job_id: str, conversion_fn, input_path):
    """
    Wrapper that updates job status in Redis before and after conversion.
    Uses Redis directly (no async DB in Celery workers).
    """
    import redis as redis_lib
    import json

    r = redis_lib.from_url(settings.REDIS_URL)
    status_key = f"job_status:{job_id}"

    r.set(status_key, json.dumps({"status": "processing"}), ex=3600)

    try:
        output_filename = conversion_fn()
        r.set(
            status_key,
            json.dumps({"status": "done", "output_filename": output_filename}),
            ex=3600,
        )
        # Clean up input file(s)
        if input_path and os.path.exists(input_path):
            os.remove(input_path)
    except Exception as e:
        r.set(
            status_key,
            json.dumps({"status": "failed", "error": str(e)}),
            ex=3600,
        )
