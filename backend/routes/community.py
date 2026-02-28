from fastapi import APIRouter

from models import CommunityMember, StatsOut
import store

router = APIRouter(prefix="/api")


@router.get("/community", response_model=list[CommunityMember])
async def get_community():
    return await store.get_community()


@router.get("/stats", response_model=StatsOut)
async def get_stats():
    return StatsOut(userCount=await store.get_user_count())
