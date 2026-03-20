from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import RedirectResponse
from sqlmodel.ext.asyncio.session import AsyncSession
import httpx
from typing import Optional
from app.core.database import get_session
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.crud.user import get_or_create_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


@router.get("/google")
async def google_login():
    """Redirect user to Google OAuth consent screen."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(501, "Google OAuth not configured")
    params = (
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid email profile"
        f"&access_type=offline"
    )
    return RedirectResponse(GOOGLE_AUTH_URL + params)


@router.get("/google/callback")
async def google_callback(code: str, session: AsyncSession = Depends(get_session)):
    """Handle Google OAuth callback, set JWT cookie."""
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(400, "Failed to exchange code for token")

        access_token = token_resp.json().get("access_token")
        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(400, "Failed to fetch user info")

        userinfo = userinfo_resp.json()

    user = await get_or_create_user(
        session,
        google_id=userinfo["sub"],
        email=userinfo.get("email", ""),
        display_name=userinfo.get("name", ""),
    )

    jwt_token = create_access_token({"user_id": user.id, "tier": user.tier})
    response = RedirectResponse(url="/")
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        max_age=7 * 24 * 3600,
        samesite="lax",
    )
    return response


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"status": "logged out"}


@router.get("/me")
async def get_me(
    access_token: Optional[str] = Cookie(default=None),
):
    if not access_token:
        return {"authenticated": False}
    payload = decode_access_token(access_token)
    if not payload:
        return {"authenticated": False}
    return {
        "authenticated": True,
        "user_id": payload.get("user_id"),
        "tier": payload.get("tier"),
    }
