import os
import re
import uuid
import unicodedata
import aiofiles
from fastapi import UploadFile, HTTPException
from app.core.config import settings

# Manual transliteration for characters that NFKD decomposition doesn't handle
_TRANSLITERATION = str.maketrans(
    "ıİğĞüÜşŞöÖçÇ",
    "iIgGuUsSoOcC",
)


def sanitize_filename(filename: str) -> str:
    """Make a filename safe for cross-container use (ASCII-only, no spaces/specials)."""
    name, ext = os.path.splitext(filename)
    # Apply manual transliteration first (Turkish chars, etc.)
    name = name.translate(_TRANSLITERATION)
    # NFKD normalize then drop remaining non-ASCII
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    # Replace any non-alphanumeric character (spaces, #, etc.) with underscore
    name = re.sub(r"[^A-Za-z0-9_.-]", "_", name)
    # Collapse consecutive underscores
    name = re.sub(r"_+", "_", name).strip("_")
    # Fallback if name is now empty
    if not name:
        name = "upload"
    # Sanitize extension too
    ext = ext.lower()
    ext = re.sub(r"[^a-z0-9.]", "", ext)
    return name + ext


def allowed_file(filename: str, allowed: list[str]) -> bool:
    ext = os.path.splitext(filename)[1].lower().lstrip(".")
    return ext in allowed


async def save_upload_file(file: UploadFile) -> tuple[str, str]:
    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)

    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max {settings.MAX_FILE_SIZE_MB}MB.",
        )

    job_id = str(uuid.uuid4())
    original = os.path.basename(file.filename or "upload")
    safe_name = f"{job_id}_{sanitize_filename(original)}"
    save_path = os.path.join(settings.UPLOAD_DIR, safe_name)

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    async with aiofiles.open(save_path, "wb") as f:
        await f.write(contents)

    return job_id, save_path


async def save_multiple_files(files: list[UploadFile]) -> tuple[str, list[str]]:
    """Save multiple files, return a shared job_id and list of saved paths."""
    job_id = str(uuid.uuid4())
    saved_paths = []

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    for i, file in enumerate(files):
        contents = await file.read()
        size_mb = len(contents) / (1024 * 1024)

        if size_mb > settings.MAX_FILE_SIZE_MB:
            raise HTTPException(
                status_code=413,
                detail=f"{file.filename} too large. Max {settings.MAX_FILE_SIZE_MB}MB.",
            )

        original = os.path.basename(file.filename or "upload")
        safe_name = f"{job_id}_{i}_{sanitize_filename(original)}"
        save_path = os.path.join(settings.UPLOAD_DIR, safe_name)

        async with aiofiles.open(save_path, "wb") as f:
            await f.write(contents)

        saved_paths.append(save_path)

    return job_id, saved_paths
