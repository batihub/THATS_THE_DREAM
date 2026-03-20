from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.job import JobStatus


class JobRead(BaseModel):
    job_id: str
    status: JobStatus
    conversion_type: str
    input_filename: str
    output_filename: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
