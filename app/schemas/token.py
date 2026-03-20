from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TokenActivate(BaseModel):
    token: str


class TokenRead(BaseModel):
    is_valid: bool
    expires_at: Optional[datetime] = None
    message: str