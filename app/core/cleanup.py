# File cleanup is handled by the Celery Beat scheduled task in
# app/workers/pdf_tasks.py → cleanup_expired_files
# It runs every 15 minutes and deletes files older than FILE_TTL_MINUTES.
