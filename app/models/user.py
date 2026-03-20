from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from app.models.job import Job


class UserTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ADMIN = "admin"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    google_id: Optional[str] = Field(default=None, unique=True, index=True)
    email: Optional[str] = Field(default=None, unique=True, index=True)
    display_name: Optional[str] = None
    tier: UserTier = Field(default=UserTier.FREE)

    jobs: List["Job"] = Relationship(back_populates="user")
