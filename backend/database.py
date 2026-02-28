"""
MongoDB connection via Motor (async driver).
All collections are accessed through this module.
To swap to a different DB, only this file and store.py need to change.
"""

from __future__ import annotations

import os
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

_client: Optional[AsyncIOMotorClient] = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        uri = os.environ.get("MONGODB_URI")
        if not uri:
            raise RuntimeError("MONGODB_URI not set in environment")
        _client = AsyncIOMotorClient(uri)
    return _client


def get_db():
    return get_client()["habitrac"]


def users():
    return get_db()["users"]


def habits():
    return get_db()["habits"]


def checkins():
    return get_db()["checkins"]
