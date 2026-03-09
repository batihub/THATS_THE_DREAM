from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.api.routes import audio, auth, document, image, jobs, payments, pdf, video
from app.core.database import init_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_database()
    yield

app = FastAPI(title="FileConvert")

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,   #########
    allow_headers = ["*"],
    allow_methods = ["*"],
)

app.include_router(pdf.router)
app.include_router(audio.router)
app.include_router(auth.router)
app.include_router(document.router)
app.include_router(image.router)
app.include_router(jobs.router)
app.include_router(payments.router)
app.include_router(video.router)