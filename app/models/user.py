from sqlmodel import SQLModel, Field, Relationship
from typing import Optional,List
from enum import Enum

class UserRole(str, Enum):
    INTERN = "intern"
    ADMIN = "admin"
    ROOT = "root"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default= None, primary_key=True)
    username : str = Field(unique=True, index=True, max_length=40)
    password_hash : str
    role : UserRole = Field(default=UserRole.INTERN)
    jobs : Optional[List[Job]] = Field(default= None)