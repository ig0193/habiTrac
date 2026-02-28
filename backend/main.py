from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, habits, checkins, community

app = FastAPI(title="habiTrac API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(checkins.router)
app.include_router(community.router)
