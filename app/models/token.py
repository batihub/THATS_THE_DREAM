from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class ProToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    token_hash: str = Field(unique=True, index=True)
    stripe_session_id: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
