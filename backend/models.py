from __future__ import annotations

from pydantic import BaseModel


class JoinRequest(BaseModel):
    userId: str
    name: str


class LoginRequest(BaseModel):
    userId: str


class AddHabitRequest(BaseModel):
    userId: str  # internal user id
    name: str
    icon: str


class CheckInRequest(BaseModel):
    date: str  # YYYY-MM-DD


class UserPublic(BaseModel):
    """Returned in community/public endpoints — never exposes userId."""
    id: str
    name: str
    joinedAt: str


class UserPrivate(BaseModel):
    """Returned to the user themselves on join/login — includes userId."""
    id: str
    userId: str
    name: str
    joinedAt: str


class HabitOut(BaseModel):
    id: str
    userId: str  # internal user id (not the private handle)
    name: str
    icon: str
    createdAt: str


class CheckInOut(BaseModel):
    id: str
    habitId: str
    date: str


class CommunityMember(BaseModel):
    user: UserPublic
    habits: list[HabitOut]
    checkIns: list[CheckInOut]


class StatsOut(BaseModel):
    userCount: int
