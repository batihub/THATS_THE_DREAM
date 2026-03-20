import os
import ffmpeg
from app.core.config import settings


def _output_path(job_id: str, filename: str) -> str:
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    return os.path.join(settings.OUTPUT_DIR, filename)


def _ffmpeg_error(e: ffmpeg.Error, context: str) -> RuntimeError:
    stderr = e.stderr.decode(errors="replace").strip() if e.stderr else ""
    stdout = e.stdout.decode(errors="replace").strip() if e.stdout else ""
    detail = stderr or stdout or "No output from ffmpeg"
    return RuntimeError(f"{context}: {detail}")


def convert_audio(input_path: str, job_id: str, target_format: str) -> str:
    output_filename = f"{job_id}_converted.{target_format}"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(output_path).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, f"Audio conversion to {target_format} failed")
    return output_filename


def compress_audio(input_path: str, job_id: str, bitrate: str = "128k") -> str:
    ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    output_filename = f"{job_id}_compressed.{ext}"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(output_path, audio_bitrate=bitrate).run(
            overwrite_output=True, quiet=True
        )
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, f"Audio compression at {bitrate} failed")
    return output_filename


def extract_audio(input_path: str, job_id: str) -> str:
    """Extract audio track from video as MP3."""
    output_filename = f"{job_id}_audio.mp3"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(
            output_path, audio_bitrate="192k", vn=None
        ).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, "Audio extraction from video failed")
    return output_filename


def strip_audio_metadata(input_path: str, job_id: str) -> str:
    """Copy audio file and remove all ID3/metadata tags."""
    ext = os.path.splitext(input_path)[1].lower().lstrip(".")
    output_filename = f"{job_id}_clean.{ext}"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(
            output_path, map_metadata=-1, acodec="copy"
        ).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, "Audio metadata removal failed")
    return output_filename
