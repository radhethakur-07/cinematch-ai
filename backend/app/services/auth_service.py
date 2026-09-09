import uuid
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import jwt
from sqlalchemy.orm import Session
from app.models.db_models import Profile, UserPreference
from app.schemas.auth import UserLogin, UserRegister, AuthResponse
from app.schemas.user import ProfileResponse
from app.core.config import settings
from app.core.errors import AppException
from fastapi import status

SECRET_KEY = settings.SUPABASE_JWT_SECRET or "cinematch-secret-development-jwt-key-32-chars"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class AuthService:
    def register(self, db: Session, user_data: UserRegister) -> AuthResponse:
        existing = db.query(Profile).filter(Profile.email == user_data.email).first()
        if existing:
            raise AppException(
                code="USER_ALREADY_EXISTS",
                message="An account with this email address already exists.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        new_profile = Profile(
            id=str(uuid.uuid4()),
            email=user_data.email,
            full_name=user_data.full_name or user_data.email.split("@")[0],
            is_admin=False,
            onboarding_completed=False
        )
        db.add(new_profile)

        # Create empty user preferences
        pref = UserPreference(
            user_id=new_profile.id,
            favorite_genres=[],
            onboarding_done=False
        )
        db.add(pref)
        db.commit()
        db.refresh(new_profile)

        token = create_access_token({"sub": new_profile.id, "email": new_profile.email, "is_admin": False})
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=ProfileResponse.model_validate(new_profile)
        )

    def login(self, db: Session, credentials: UserLogin) -> AuthResponse:
        user = db.query(Profile).filter(Profile.email == credentials.email).first()
        if not user:
            # For development demo convenience, if user doesn't exist, auto-create profile
            return self.register(db, UserRegister(email=credentials.email, password=credentials.password))

        token = create_access_token({"sub": user.id, "email": user.email, "is_admin": user.is_admin})
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=ProfileResponse.model_validate(user)
        )

auth_service = AuthService()
