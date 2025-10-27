import os
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from dotenv import load_dotenv, find_dotenv
from typing import AsyncGenerator


load_dotenv(find_dotenv())

Base = declarative_base()


engine = create_async_engine(os.getenv("DATABASE_URL"), echo=True, future=True, pool_pre_ping=True)


SessionLocal = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)



async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency function that yields a database session.

    This function is used as a FastAPI dependency to provide a database session
    to the application. It is an async generator that will yield a session
    when the async context manager is invoked. The session is closed when the
    context manager is exited, which is when the async function returns.

    This function is used to inject a database session into the application.
    It is intended to be used as a dependency in FastAPI routes.

    Example:

    from fastapi import FastAPI, Depends

    app = FastAPI()

    @app.get("/items/")
    async def read_items(db: AsyncSession = Depends(get_db)):
        # Use the database session here
        pass

    """
    async with SessionLocal() as session:
        yield session