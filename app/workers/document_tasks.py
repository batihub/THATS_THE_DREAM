from app.core.celery_app import celery_app
from app.workers.pdf_tasks import _run_task


@celery_app.task(name="app.workers.document_tasks.ocr_task")
def ocr_task(input_path: str, job_id: str):
    from app.services.document_service import ocr_image
    _run_task(job_id, lambda: ocr_image(input_path, job_id), input_path)


@celery_app.task(name="app.workers.document_tasks.markdown_to_pdf_task")
def markdown_to_pdf_task(input_path: str, job_id: str):
    from app.services.document_service import markdown_to_pdf
    _run_task(job_id, lambda: markdown_to_pdf(input_path, job_id), input_path)


@celery_app.task(name="app.workers.document_tasks.html_to_pdf_task")
def html_to_pdf_task(input_path: str, job_id: str):
    from app.services.document_service import html_to_pdf
    _run_task(job_id, lambda: html_to_pdf(input_path, job_id), input_path)


@celery_app.task(name="app.workers.document_tasks.csv_to_json_task")
def csv_to_json_task(input_path: str, job_id: str):
    from app.services.document_service import csv_to_json
    _run_task(job_id, lambda: csv_to_json(input_path, job_id), input_path)


@celery_app.task(name="app.workers.document_tasks.json_to_csv_task")
def json_to_csv_task(input_path: str, job_id: str):
    from app.services.document_service import json_to_csv
    _run_task(job_id, lambda: json_to_csv(input_path, job_id), input_path)
