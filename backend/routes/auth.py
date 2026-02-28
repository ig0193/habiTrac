from fastapi import APIRouter, HTTPException

from models import JoinRequest, LoginRequest, UserPrivate, UserPublic
import store

router = APIRouter(prefix="/api")


@router.post("/join", response_model=UserPrivate)
def join(req: JoinRequest):
    user = store.join_user(req.userId, req.name)
    if user is None:
        raise HTTPException(status_code=409, detail="userId already taken")
    return user


@router.post("/login", response_model=UserPrivate)
def login(req: LoginRequest):
    user = store.login_user(req.userId)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users", response_model=list[UserPublic])
def get_users():
    return store.get_users_public()
