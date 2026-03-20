import os
from PIL import Image
from pillow_heif import register_heif_opener
import cairosvg
from app.core.config import settings

register_heif_opener()  # enables Pillow to open HEIC files

FORMAT_MAP = {
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
    "webp": "WEBP",
    "bmp": "BMP",
    "tiff": "TIFF",
    "gif": "GIF",
}


def _output_path(job_id: str, filename: str) -> str:
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    return os.path.join(settings.OUTPUT_DIR, filename)


def convert_image(input_path: str, job_id: str, target_format: str) -> str:
    fmt = FORMAT_MAP.get(target_format.lower())
    if not fmt:
        raise ValueError(f"Unsupported target format: {target_format}")

    output_filename = f"{job_id}_converted.{target_format.lower()}"
    output_path = _output_path(job_id, output_filename)

    try:
        img = Image.open(input_path)
        if fmt == "JPEG" and img.mode in ("RGBA", "LA", "P"):
            img = img.convert("RGB")
        img.save(output_path, fmt)
    except Exception as e:
        raise RuntimeError(f"Image conversion to {target_format} failed: {e}")
    return output_filename


def compress_image(input_path: str, job_id: str, quality: int = 75) -> str:
    try:
        img = Image.open(input_path)
    except Exception as e:
        raise RuntimeError(f"Failed to open image: {e}")

    ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    fmt = FORMAT_MAP.get(ext, "JPEG")
    output_ext = "jpg" if fmt == "JPEG" else ext
    output_filename = f"{job_id}_compressed.{output_ext}"
    output_path = _output_path(job_id, output_filename)

    if fmt == "JPEG" and img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGB")
    try:
        img.save(output_path, fmt, quality=quality, optimize=True)
    except Exception as e:
        raise RuntimeError(f"Image compression failed: {e}")
    return output_filename


def resize_image(input_path: str, job_id: str, width: int, height: int) -> str:
    try:
        img = Image.open(input_path)
    except Exception as e:
        raise RuntimeError(f"Failed to open image: {e}")

    ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    fmt = FORMAT_MAP.get(ext, "JPEG")
    output_filename = f"{job_id}_resized.{ext}"
    output_path = _output_path(job_id, output_filename)

    try:
        img = img.resize((width, height), Image.LANCZOS)
        img.save(output_path, fmt)
    except Exception as e:
        raise RuntimeError(f"Image resize to {width}x{height} failed: {e}")
    return output_filename


def strip_image_metadata(input_path: str, job_id: str) -> str:
    """Re-save image without EXIF/metadata. Pillow does not copy metadata unless explicitly passed."""
    try:
        img = Image.open(input_path)
    except Exception as e:
        raise RuntimeError(f"Failed to open image: {e}")

    ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    fmt = FORMAT_MAP.get(ext, "JPEG")
    output_filename = f"{job_id}_clean.{ext}"
    output_path = _output_path(job_id, output_filename)

    # Flatten palette images so pixel data is preserved correctly
    if img.mode == "P":
        img = img.convert("RGBA" if img.info.get("transparency") is not None else "RGB")

    if fmt == "JPEG" and img.mode in ("RGBA", "LA"):
        img = img.convert("RGB")

    # Save without passing exif= — Pillow omits metadata by default
    try:
        img.save(output_path, fmt)
    except Exception as e:
        raise RuntimeError(f"Failed to save stripped image: {e}")
    return output_filename


def svg_to_png(input_path: str, job_id: str) -> str:
    output_filename = f"{job_id}_converted.png"
    output_path = _output_path(job_id, output_filename)
    try:
        cairosvg.svg2png(url=input_path, write_to=output_path)
    except Exception as e:
        raise RuntimeError(f"SVG to PNG conversion failed: {e}")
    return output_filename
