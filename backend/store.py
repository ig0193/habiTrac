"""
Data access layer — backed by MongoDB via Motor.
All functions are async. Routes must await them.
"""

from __future__ import annotations

import uuid
from datetime import date, timedelta
from typing import Optional
import random

import database as db


def _uid() -> str:
    return uuid.uuid4().hex[:8]


def _today() -> str:
    return date.today().isoformat()


def _strip_id(doc: dict) -> dict:
    """Remove MongoDB's _id before returning to callers."""
    doc.pop("_id", None)
    return doc


# ── Auth ───────────────────────────────────────────────

async def join_user(user_id: str, name: str) -> Optional[dict]:
    """Returns None if userId is already taken."""
    existing = await db.users().find_one({"userId": user_id})
    if existing:
        return None
    internal_id = _uid()
    user = {"id": internal_id, "userId": user_id, "name": name, "joinedAt": _today()}
    await db.users().insert_one({**user})
    return user


async def login_user(user_id: str) -> Optional[dict]:
    doc = await db.users().find_one({"userId": user_id})
    if not doc:
        return None
    return _strip_id(doc)


async def get_users_public() -> list[dict]:
    cursor = db.users().find({}, {"_id": 0, "userId": 0})
    return await cursor.to_list(length=None)


async def get_user_count() -> int:
    return await db.users().count_documents({})


# ── Habits ─────────────────────────────────────────────

async def get_habits(user_internal_id: str) -> list[dict]:
    cursor = db.habits().find({"userId": user_internal_id}, {"_id": 0})
    return await cursor.to_list(length=None)


async def add_habit(user_internal_id: str, name: str, icon: str) -> dict:
    hid = _uid()
    habit = {"id": hid, "userId": user_internal_id, "name": name, "icon": icon, "createdAt": _today()}
    await db.habits().insert_one({**habit})
    return habit


async def delete_habit(habit_id: str) -> bool:
    result = await db.habits().delete_one({"id": habit_id})
    if result.deleted_count == 0:
        return False
    await db.checkins().delete_many({"habitId": habit_id})
    return True


# ── Check-ins ──────────────────────────────────────────

async def get_checkins(habit_id: str) -> list[dict]:
    cursor = db.checkins().find({"habitId": habit_id}, {"_id": 0})
    return await cursor.to_list(length=None)


async def checkin(habit_id: str, day: str) -> dict:
    existing = await db.checkins().find_one({"habitId": habit_id, "date": day}, {"_id": 0})
    if existing:
        return _strip_id(existing)
    ci = {"id": _uid(), "habitId": habit_id, "date": day}
    await db.checkins().insert_one({**ci})
    return ci


async def uncheckin(habit_id: str, day: str) -> bool:
    result = await db.checkins().delete_one({"habitId": habit_id, "date": day})
    return result.deleted_count > 0


# ── Community ──────────────────────────────────────────

async def get_community() -> list[dict]:
    users_cursor = db.users().find({}, {"_id": 0, "userId": 0})
    all_users = await users_cursor.to_list(length=None)

    habits_cursor = db.habits().find({}, {"_id": 0})
    all_habits = await habits_cursor.to_list(length=None)

    checkins_cursor = db.checkins().find({}, {"_id": 0})
    all_checkins = await checkins_cursor.to_list(length=None)

    result = []
    for user in all_users:
        user_habits = [h for h in all_habits if h["userId"] == user["id"]]
        habit_ids = {h["id"] for h in user_habits}
        user_checkins = [c for c in all_checkins if c["habitId"] in habit_ids]
        result.append({"user": user, "habits": user_habits, "checkIns": user_checkins})
    return result


# ── Seed ───────────────────────────────────────────────

async def seed_if_empty() -> None:
    """Seed the DB with demo data only if users collection is empty."""
    if await db.users().count_documents({}) > 0:
        return

    seed_users = [
        ("u1", "arjun01", "Arjun", "2026-01-15"),
        ("u2", "sneha02", "Sneha", "2026-01-20"),
        ("u3", "rahul03", "Rahul", "2026-02-01"),
    ]
    for uid, handle, name, joined in seed_users:
        await db.users().insert_one({"id": uid, "userId": handle, "name": name, "joinedAt": joined})

    seed_habits = [
        ("h1", "u1", "Morning Run", "🏃", "2026-01-16"),
        ("h2", "u1", "Read", "📖", "2026-01-16"),
        ("h3", "u2", "Meditate", "🧘", "2026-01-21"),
        ("h4", "u2", "Drink Water", "💧", "2026-01-21"),
        ("h5", "u3", "Gym", "💪", "2026-02-02"),
        ("h6", "u3", "Journal", "✏️", "2026-02-02"),
    ]
    for hid, uid, name, icon, created in seed_habits:
        await db.habits().insert_one({"id": hid, "userId": uid, "name": name, "icon": icon, "createdAt": created})

    densities = {"h1": 0.75, "h2": 0.5, "h3": 0.85, "h4": 0.65, "h5": 0.4, "h6": 0.7}
    day_counts = {"h1": 40, "h2": 40, "h3": 35, "h4": 35, "h5": 25, "h6": 25}
    today = date.today()
    docs = []
    for hid, density in densities.items():
        for i in range(day_counts[hid]):
            if random.random() < density:
                d = (today - timedelta(days=i)).isoformat()
                docs.append({"id": _uid(), "habitId": hid, "date": d})
    if docs:
        await db.checkins().insert_many(docs)
