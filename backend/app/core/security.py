import jwt
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status, Depends
from backend.app.core.config import settings
from backend.app.core.errors import AppException

def decode_token(token: str) -> Dict[str, Any]:
    """Decode JWT token (Supabase auth token or internal token)."""
    try:
        # If secret is set, verify signature; otherwise decode payload safely
        if settings.SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
        else:
            # Decode without secret for flexible Supabase verification in dev
            payload = jwt.decode(token, options={"verify_signature": False})
        return payload
    except jwt.PyJWTError as e:
        raise AppException(
            code="INVALID_TOKEN",
            message=f"Invalid or expired authentication token: {str(e)}",
            status_code=status.HTTP_401_UNAUTHORIZED
        )

async def get_optional_current_user(
    authorization: Optional[str] = Header(None)
) -> Optional[Dict[str, Any]]:
    """Extract user payload if Authorization header is provided, otherwise return None."""
    if not authorization:
        return None
    
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
        
    token = parts[1]
    try:
        payload = decode_token(token)
        user_id = payload.get("sub") or payload.get("user_id") or payload.get("id")
        if not user_id:
            return None
        
        # Check if user has admin role
        app_metadata = payload.get("app_metadata", {})
        user_metadata = payload.get("user_metadata", {})
        is_admin = bool(
            app_metadata.get("is_admin") or 
            user_metadata.get("is_admin") or 
            payload.get("role") == "admin" or
            payload.get("is_admin")
        )

        return {
            "id": str(user_id),
            "email": payload.get("email", ""),
            "is_admin": is_admin,
            "raw_payload": payload
        }
    except Exception:
        return None

async def get_current_user(
    user: Optional[Dict[str, Any]] = Depends(get_optional_current_user)
) -> Dict[str, Any]:
    """Require valid authenticated user."""
    if not user:
        raise AppException(
            code="UNAUTHORIZED",
            message="Authentication required to perform this action",
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    return user

async def get_current_admin(
    user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Require admin privileges."""
    if not user.get("is_admin"):
        raise AppException(
            code="FORBIDDEN_ADMIN_REQUIRED",
            message="Administrative access required",
            status_code=status.HTTP_403_FORBIDDEN
        )
    return user
