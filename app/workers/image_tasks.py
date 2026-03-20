from app.core.celery_app import celery_app
from app.workers.pdf_tasks import _run_task


@celery_app.task(name="app.workers.image_tasks.convert_image_task")
def convert_image_task(input_path: str, job_id: str, target_format: str):
    from app.services.image_service import convert_image
    _run_task(job_id, lambda: convert_image(input_path, job_id, target_format), input_path)


@celery_app.task(name="app.workers.image_tasks.compress_image_task")
def compress_image_task(input_path: str, job_id: str, quality: int):
    from app.services.image_service import compress_image
    _run_task(job_id, lambda: compress_image(input_path, job_id, quality), input_path)


@celery_app.task(name="app.workers.image_tasks.resize_image_task")
def resize_image_task(input_path: str, job_id: str, width: int, height: int):
    from app.services.image_service import resize_image
    _run_task(job_id, lambda: resize_image(input_path, job_id, width, height), input_path)


@celery_app.task(name="app.workers.image_tasks.strip_metadata_task")
def strip_metadata_task(input_path: str, job_id: str):
    from app.services.image_service import strip_image_metadata
    _run_task(job_id, lambda: strip_image_metadata(input_path, job_id), input_path)


@celery_app.task(name="app.workers.image_tasks.svg_to_png_task")
def svg_to_png_task(input_path: str, job_id: str):
    from app.services.image_service import svg_to_png
    _run_task(job_id, lambda: svg_to_png(input_path, job_id), input_path)
