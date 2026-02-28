from fastapi import APIRouter

from models import CheckInRequest, CheckInOut
import store

router = APIRouter(prefix="/api")


@router.get("/habits/{habit_id}/checkins", response_model=list[CheckInOut])
async def get_checkins(habit_id: str):
    return await store.get_checkins(habit_id)


@router.post("/habits/{habit_id}/checkin", response_model=CheckInOut)
async def do_checkin(habit_id: str, req: CheckInRequest):
    return await store.checkin(habit_id, req.date)


@router.delete("/habits/{habit_id}/checkin/{day}")
async def undo_checkin(habit_id: str, day: str):
    await store.uncheckin(habit_id, day)
    return {"ok": True}
