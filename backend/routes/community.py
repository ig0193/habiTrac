from fastapi import APIRouter

from models import CommunityMember, StatsOut
import store

router = APIRouter(prefix="/api")


@router.get("/community", response_model=list[CommunityMember])
def get_community():
    return store.get_community()


@router.get("/stats", response_model=StatsOut)
def get_stats():
    return StatsOut(userCount=store.get_user_count())
