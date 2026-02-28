from fastapi import APIRouter

from models import CheckInRequest, CheckInOut
import store

router = APIRouter(prefix="/api")


@router.get("/habits/{habit_id}/checkins", response_model=list[CheckInOut])
def get_checkins(habit_id: str):
    return store.get_checkins(habit_id)


@router.post("/habits/{habit_id}/checkin", response_model=CheckInOut)
def do_checkin(habit_id: str, req: CheckInRequest):
    return store.checkin(habit_id, req.date)


@router.delete("/habits/{habit_id}/checkin/{day}")
def undo_checkin(habit_id: str, day: str):
    store.uncheckin(habit_id, day)
    return {"ok": True}
