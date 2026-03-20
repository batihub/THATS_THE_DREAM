from pydantic import BaseModel
from typing import Optional
from app.models.user import UserTier


class UserRead(BaseModel):
    id: int
    email: Optional[str] = None
    display_name: Optional[str] = None
    tier: UserTier

    class Config:
        from_attributes = True
