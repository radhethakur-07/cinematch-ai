import uuid
import hashlib
import secrets
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

def hash_password(password: str) -> str:
    """Generate salted PBKDF2-HMAC-SHA256 password hash."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}:{key.hex()}"

def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    """Verify a plain password against stored salt:hash string."""
    if not hashed_password or ":" not in hashed_password:
        return False
    try:
        salt, key_hex = hashed_password.split(":", 1)
        new_key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return secrets.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = {k: (str(v) if isinstance(v, uuid.UUID) else v) for k, v in data.items()}
    expire = datetime.utcnow() + (expires_delta or timedelta(days=7))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

class AuthService:
    def register(self, db: Session, user_data: UserRegister) -> AuthResponse:
        existing = db.query(Profile).filter(Profile.email == user_data.email).first()
        if existing:
            raise AppException(
                code="USER_ALREADY_EXISTS",
                message="An account with this email address already exists. Please log in.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        new_profile = Profile(
            id=str(uuid.uuid4()),
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            full_name=user_data.full_name or user_data.email.split("@")[0],
            is_admin=False,
            onboarding_completed=False
        )
        db.add(new_profile)

        # Create empty user preferences
        pref = UserPreference(
            user_id=str(new_profile.id),
            favorite_genres=[],
            preferred_languages=["en"],
            preferred_decades=[],
            mood_preferences=[],
            onboarding_done=False
        )
        db.add(pref)
        db.commit()
        db.refresh(new_profile)

        token = create_access_token({"sub": str(new_profile.id), "email": str(new_profile.email), "is_admin": bool(new_profile.is_admin)})
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=ProfileResponse(
                id=str(new_profile.id),
                email=str(new_profile.email),
                full_name=new_profile.full_name,
                avatar_url=new_profile.avatar_url,
                is_admin=bool(new_profile.is_admin),
                onboarding_completed=bool(new_profile.onboarding_completed),
                created_at=new_profile.created_at
            )
        )

    def login(self, db: Session, credentials: UserLogin) -> AuthResponse:
        user = db.query(Profile).filter(Profile.email == credentials.email).first()
        if not user:
            raise AppException(
                code="INVALID_CREDENTIALS",
                message="No account found with this email address. Please create an account first.",
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        if not verify_password(credentials.password, user.password_hash):
            raise AppException(
                code="INVALID_CREDENTIALS",
                message="Incorrect password. Please try again.",
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        token = create_access_token({"sub": str(user.id), "email": str(user.email), "is_admin": bool(user.is_admin)})
        return AuthResponse(
            access_token=token,
            token_type="bearer",
            user=ProfileResponse(
                id=str(user.id),
                email=str(user.email),
                full_name=user.full_name,
                avatar_url=user.avatar_url,
                is_admin=bool(user.is_admin),
                onboarding_completed=bool(user.onboarding_completed),
                created_at=user.created_at
            )
        )

auth_service = AuthService()

