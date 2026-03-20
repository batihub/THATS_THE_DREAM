import os
import ffmpeg
from app.core.config import settings

# CRF values: lower = higher quality, larger file
QUALITY_CRF = {"low": 32, "medium": 28, "high": 22}


def _output_path(job_id: str, filename: str) -> str:
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    return os.path.join(settings.OUTPUT_DIR, filename)


def _ffmpeg_error(e: ffmpeg.Error, context: str) -> RuntimeError:
    stderr = e.stderr.decode(errors="replace").strip() if e.stderr else ""
    stdout = e.stdout.decode(errors="replace").strip() if e.stdout else ""
    detail = stderr or stdout or "No output from ffmpeg"
    return RuntimeError(f"{context}: {detail}")


def convert_video(input_path: str, job_id: str, target_format: str) -> str:
    output_filename = f"{job_id}_converted.{target_format}"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(output_path).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, f"Video conversion to {target_format} failed")
    return output_filename


def compress_video(input_path: str, job_id: str, quality: str = "medium") -> str:
    crf = QUALITY_CRF.get(quality, 28)
    output_filename = f"{job_id}_compressed.mp4"
    output_path = _output_path(job_id, output_filename)
    try:
        ffmpeg.input(input_path).output(
            output_path,
            vcodec="libx264",
            crf=crf,
            acodec="aac",
            audio_bitrate="128k",
        ).run(overwrite_output=True, quiet=True)
    except ffmpeg.Error as e:
        raise _ffmpeg_error(e, f"Video compression at quality={quality} failed")
    return output_filename
