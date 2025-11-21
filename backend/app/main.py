"""Application entrypoint."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db, close_db
from .routers import interviews, sessions, code_execution

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management."""
    # Startup
    logger.info("Starting MockLoop API...")
    await init_db()
    logger.info("MockLoop API started successfully!")

    yield

    # Shutdown
    logger.info("Shutting down MockLoop API...")
    await close_db()
    logger.info("MockLoop API shutdown complete!")


def create_app() -> FastAPI:
    """FastAPI factory used by ASGI servers."""
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        description="MockLoop API for technical interview practice platform",
        version="1.0.0",
        debug=settings.debug,
        lifespan=lifespan,
        docs_url="/docs",  # Swagger UI
        redoc_url="/redoc",  # ReDoc
        openapi_url="/openapi.json"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.frontend_origin,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["system"])
    def healthcheck():
        return {
            "status": "ok",
            "environment": settings.environment,
            "app_name": settings.app_name
        }

    app.include_router(interviews.router)
    app.include_router(sessions.router)
    app.include_router(code_execution.router)
    return app


app = create_app()
