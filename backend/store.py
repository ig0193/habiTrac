"""
In-memory data store.
When ready for a real DB, replace this module's functions with actual queries.
"""

from __future__ import annotations

import uuid
from datetime import date, timedelta
import random
from typing import Optional

_users: dict[str, dict] = {}        # keyed by internal id
_userid_index: dict[str, str] = {}  # userId (handle) -> internal id
_habits: dict[str, dict] = {}       # keyed by habit id
_checkins: list[dict] = []


def _uid() -> str:
    return uuid.uuid4().hex[:8]


def _today() -> str:
    return date.today().isoformat()


def _seed() -> None:
    seed_users = [
        ("u1", "arjun01", "Arjun", "2026-01-15"),
        ("u2", "sneha02", "Sneha", "2026-01-20"),
        ("u3", "rahul03", "Rahul", "2026-02-01"),
    ]
    for uid, handle, name, joined in seed_users:
        _users[uid] = {"id": uid, "userId": handle, "name": name, "joinedAt": joined}
        _userid_index[handle] = uid

    seed_habits = [
        ("h1", "u1", "Morning Run", "🏃", "2026-01-16"),
        ("h2", "u1", "Read", "📖", "2026-01-16"),
        ("h3", "u2", "Meditate", "🧘", "2026-01-21"),
        ("h4", "u2", "Drink Water", "💧", "2026-01-21"),
        ("h5", "u3", "Gym", "💪", "2026-02-02"),
        ("h6", "u3", "Journal", "✏️", "2026-02-02"),
    ]
    for hid, uid, name, icon, created in seed_habits:
        _habits[hid] = {"id": hid, "userId": uid, "name": name, "icon": icon, "createdAt": created}

    densities = {"h1": 0.75, "h2": 0.5, "h3": 0.85, "h4": 0.65, "h5": 0.4, "h6": 0.7}
    day_counts = {"h1": 40, "h2": 40, "h3": 35, "h4": 35, "h5": 25, "h6": 25}
    today = date.today()
    for hid, density in densities.items():
        for i in range(day_counts[hid]):
            if random.random() < density:
                d = (today - timedelta(days=i)).isoformat()
                _checkins.append({"id": _uid(), "habitId": hid, "date": d})


_seed()


# ── Auth ───────────────────────────────────────────────

def join_user(user_id: str, name: str) -> Optional[dict]:
    """Returns None if userId is already taken."""
    if user_id in _userid_index:
        return None
    internal_id = _uid()
    user = {"id": internal_id, "userId": user_id, "name": name, "joinedAt": _today()}
    _users[internal_id] = user
    _userid_index[user_id] = internal_id
    return user


def login_user(user_id: str) -> Optional[dict]:
    internal_id = _userid_index.get(user_id)
    if internal_id is None:
        return None
    return _users[internal_id]


def get_users_public() -> list[dict]:
    return [{"id": u["id"], "name": u["name"], "joinedAt": u["joinedAt"]} for u in _users.values()]


def get_user_count() -> int:
    return len(_users)


# ── Habits ─────────────────────────────────────────────

def get_habits(user_internal_id: str) -> list[dict]:
    return [h for h in _habits.values() if h["userId"] == user_internal_id]


def add_habit(user_internal_id: str, name: str, icon: str) -> dict:
    hid = _uid()
    habit = {"id": hid, "userId": user_internal_id, "name": name, "icon": icon, "createdAt": _today()}
    _habits[hid] = habit
    return habit


def delete_habit(habit_id: str) -> bool:
    global _checkins
    if habit_id not in _habits:
        return False
    del _habits[habit_id]
    _checkins = [c for c in _checkins if c["habitId"] != habit_id]
    return True


# ── Check-ins ──────────────────────────────────────────

def get_checkins(habit_id: str) -> list[dict]:
    return [c for c in _checkins if c["habitId"] == habit_id]


def checkin(habit_id: str, day: str) -> dict:
    existing = next((c for c in _checkins if c["habitId"] == habit_id and c["date"] == day), None)
    if existing:
        return existing
    ci = {"id": _uid(), "habitId": habit_id, "date": day}
    _checkins.append(ci)
    return ci


def uncheckin(habit_id: str, day: str) -> bool:
    global _checkins
    before = len(_checkins)
    _checkins = [c for c in _checkins if not (c["habitId"] == habit_id and c["date"] == day)]
    return len(_checkins) < before


# ── Community ──────────────────────────────────────────

def get_community() -> list[dict]:
    result = []
    for user in _users.values():
        user_public = {"id": user["id"], "name": user["name"], "joinedAt": user["joinedAt"]}
        user_habits = [h for h in _habits.values() if h["userId"] == user["id"]]
        habit_ids = {h["id"] for h in user_habits}
        user_checkins = [c for c in _checkins if c["habitId"] in habit_ids]
        result.append({"user": user_public, "habits": user_habits, "checkIns": user_checkins})
    return result
