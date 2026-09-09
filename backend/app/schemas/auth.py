from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.user import ProfileResponse

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: ProfileResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    is_admin: bool = False
