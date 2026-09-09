from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import get_current_user
from backend.app.services.auth_service import auth_service
from backend.app.schemas.auth import UserLogin, UserRegister, AuthResponse
from backend.app.schemas.user import ProfileResponse

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new user account."""
    return auth_service.register(db, payload)

@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate and obtain JWT token."""
    return auth_service.login(db, payload)

@router.get("/me", response_model=ProfileResponse)
def get_me(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get currently logged-in user profile."""
    from backend.app.models.db_models import Profile
    profile = db.query(Profile).filter(Profile.id == user["id"]).first()
    return profile
