import os
import glob
import time
from app.core.config import settings


def delete_file(path: str) -> None:
    if path and os.path.exists(path):
        os.remove(path)


def cleanup_old_files(directory: str, max_age_seconds: int) -> int:
    deleted = 0
    if not os.path.exists(directory):
        return 0
    now = time.time()
    for filepath in glob.glob(os.path.join(directory, "*")):
        if os.path.isfile(filepath):
            age = now - os.path.getmtime(filepath)
            if age > max_age_seconds:
                os.remove(filepath)
                deleted += 1
    return deleted
