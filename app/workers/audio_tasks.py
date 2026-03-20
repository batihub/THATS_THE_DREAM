from app.core.celery_app import celery_app
from app.workers.pdf_tasks import _run_task


@celery_app.task(name="app.workers.audio_tasks.convert_audio_task")
def convert_audio_task(input_path: str, job_id: str, target_format: str):
    from app.services.audio_service import convert_audio
    _run_task(job_id, lambda: convert_audio(input_path, job_id, target_format), input_path)


@celery_app.task(name="app.workers.audio_tasks.compress_audio_task")
def compress_audio_task(input_path: str, job_id: str, bitrate: str):
    from app.services.audio_service import compress_audio
    _run_task(job_id, lambda: compress_audio(input_path, job_id, bitrate), input_path)


@celery_app.task(name="app.workers.audio_tasks.extract_audio_task")
def extract_audio_task(input_path: str, job_id: str):
    from app.services.audio_service import extract_audio
    _run_task(job_id, lambda: extract_audio(input_path, job_id), input_path)


@celery_app.task(name="app.workers.audio_tasks.strip_metadata_task")
def strip_metadata_task(input_path: str, job_id: str):
    from app.services.audio_service import strip_audio_metadata
    _run_task(job_id, lambda: strip_audio_metadata(input_path, job_id), input_path)
