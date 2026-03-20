from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.models.user import User


async def get_user_by_google_id(session: AsyncSession, google_id: str) -> User | None:
    result = await session.exec(select(User).where(User.google_id == google_id))
    return result.first()


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.exec(select(User).where(User.email == email))
    return result.first()


async def create_user(session: AsyncSession, google_id: str, email: str, display_name: str) -> User:
    user = User(google_id=google_id, email=email, display_name=display_name)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def get_or_create_user(session: AsyncSession, google_id: str, email: str, display_name: str) -> User:
    user = await get_user_by_google_id(session, google_id)
    if not user:
        user = await create_user(session, google_id, email, display_name)
    return user