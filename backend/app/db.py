from typing import Optional

from pymongo.errors import PyMongoError
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.config import settings


client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongo_url, serverSelectionTimeoutMS=3000)
    database = client[settings.database_name]

    try:
        await database.users.create_index("email", unique=True)
        await database.plans.create_index([("user_id", 1), ("created_at", -1)])
        await database.generation_steps.create_index([("plan_id", 1), ("created_at", 1)])
        await database.feedback.create_index([("user_id", 1), ("created_at", -1)])
    except PyMongoError as exc:
        print(f"MongoDB index setup skipped: {exc}")


async def close_mongo_connection() -> None:
    global client, database
    if client is not None:
        client.close()
    client = None
    database = None


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("Database connection has not been initialized")
    return database
