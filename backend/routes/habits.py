from fastapi import APIRouter, HTTPException

from models import AddHabitRequest, HabitOut
import store

router = APIRouter(prefix="/api")


@router.get("/users/{user_id}/habits", response_model=list[HabitOut])
def get_user_habits(user_id: str):
    return store.get_habits(user_id)


@router.post("/habits", response_model=HabitOut)
def add_habit(req: AddHabitRequest):
    return store.add_habit(req.userId, req.name, req.icon)


@router.delete("/habits/{habit_id}")
def delete_habit(habit_id: str):
    if not store.delete_habit(habit_id):
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"ok": True}
