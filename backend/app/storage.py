import json
import uuid
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Optional

from pymongo.errors import DuplicateKeyError

from app.config import settings
from app.db import close_mongo_connection, connect_to_mongo, get_database
from app.utils import serialize_doc


class DuplicateEmailError(Exception):
    pass


class Storage(ABC):
    async def connect(self) -> None:
        pass

    async def close(self) -> None:
        pass

    @abstractmethod
    async def get_user_by_email(self, email: str) -> Optional[dict[str, Any]]:
        pass

    @abstractmethod
    async def get_user_by_id(self, user_id: str) -> Optional[dict[str, Any]]:
        pass

    @abstractmethod
    async def create_user(self, user_doc: dict[str, Any]) -> dict[str, Any]:
        pass

    @abstractmethod
    async def create_plan(self, plan_doc: dict[str, Any]) -> dict[str, Any]:
        pass

    @abstractmethod
    async def add_generation_steps(self, steps: list[dict[str, Any]]) -> None:
        pass

    @abstractmethod
    async def list_user_plans(self, user_id: str) -> list[dict[str, Any]]:
        pass

    @abstractmethod
    async def get_plan_by_id(self, plan_id: str) -> Optional[dict[str, Any]]:
        pass

    @abstractmethod
    async def delete_user_plan(self, plan_id: str, user_id: str) -> None:
        pass

    @abstractmethod
    async def create_feedback(self, feedback_doc: dict[str, Any]) -> dict[str, Any]:
        pass

    @abstractmethod
    async def get_feedback_summary(self, user_id: str) -> dict[str, Any]:
        pass


class LocalJsonStorage(Storage):
    def __init__(self, file_path: str):
        backend_dir = Path(__file__).resolve().parent.parent
        self.file_path = backend_dir / file_path
        self.data: dict[str, list[dict[str, Any]]] = {
            "users": [],
            "plans": [],
            "generation_steps": [],
            "feedback": [],
        }

    async def connect(self) -> None:
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if self.file_path.exists():
            with self.file_path.open("r", encoding="utf-8") as file:
                loaded = json.load(file)
            self.data.update(
                {
                    "users": loaded.get("users", []),
                    "plans": loaded.get("plans", []),
                    "generation_steps": loaded.get("generation_steps", []),
                    "feedback": loaded.get("feedback", []),
                }
            )
        else:
            await self._save()

    async def get_user_by_email(self, email: str) -> Optional[dict[str, Any]]:
        return self._find_one("users", email=email)

    async def get_user_by_id(self, user_id: str) -> Optional[dict[str, Any]]:
        return self._find_one("users", _id=user_id)

    async def create_user(self, user_doc: dict[str, Any]) -> dict[str, Any]:
        if await self.get_user_by_email(user_doc["email"]):
            raise DuplicateEmailError()
        saved = self._with_id(user_doc)
        self.data["users"].append(saved)
        await self._save()
        return saved

    async def create_plan(self, plan_doc: dict[str, Any]) -> dict[str, Any]:
        saved = self._with_id(plan_doc)
        self.data["plans"].append(saved)
        await self._save()
        return saved

    async def add_generation_steps(self, steps: list[dict[str, Any]]) -> None:
        self.data["generation_steps"].extend([self._with_id(step) for step in steps])
        await self._save()

    async def list_user_plans(self, user_id: str) -> list[dict[str, Any]]:
        plans = [plan for plan in self.data["plans"] if plan.get("user_id") == user_id]
        return sorted(plans, key=lambda plan: plan.get("created_at", ""), reverse=True)

    async def get_plan_by_id(self, plan_id: str) -> Optional[dict[str, Any]]:
        return self._find_one("plans", _id=plan_id)

    async def delete_user_plan(self, plan_id: str, user_id: str) -> None:
        self.data["plans"] = [
            plan
            for plan in self.data["plans"]
            if not (plan.get("_id") == plan_id and plan.get("user_id") == user_id)
        ]
        self.data["generation_steps"] = [
            step
            for step in self.data["generation_steps"]
            if not (step.get("plan_id") == plan_id and step.get("user_id") == user_id)
        ]
        self.data["feedback"] = [
            item
            for item in self.data["feedback"]
            if not (item.get("plan_id") == plan_id and item.get("user_id") == user_id)
        ]
        await self._save()

    async def create_feedback(self, feedback_doc: dict[str, Any]) -> dict[str, Any]:
        saved = self._with_id(feedback_doc)
        self.data["feedback"].append(saved)
        await self._save()
        return saved

    async def get_feedback_summary(self, user_id: str) -> dict[str, Any]:
        items = [item for item in self.data["feedback"] if item.get("user_id") == user_id]
        return _feedback_summary(items)

    def _find_one(self, collection: str, **filters: Any) -> Optional[dict[str, Any]]:
        for item in self.data[collection]:
            if all(item.get(key) == value for key, value in filters.items()):
                return item
        return None

    def _with_id(self, document: dict[str, Any]) -> dict[str, Any]:
        saved = serialize_doc(document)
        saved["_id"] = saved.get("_id") or uuid.uuid4().hex
        return saved

    async def _save(self) -> None:
        with self.file_path.open("w", encoding="utf-8") as file:
            json.dump(self.data, file, indent=2)


class MongoStorage(Storage):
    async def connect(self) -> None:
        await connect_to_mongo()

    async def close(self) -> None:
        await close_mongo_connection()

    async def get_user_by_email(self, email: str) -> Optional[dict[str, Any]]:
        return await get_database().users.find_one({"email": email})

    async def get_user_by_id(self, user_id: str) -> Optional[dict[str, Any]]:
        from bson import ObjectId

        if not ObjectId.is_valid(user_id):
            return None
        return await get_database().users.find_one({"_id": ObjectId(user_id)})

    async def create_user(self, user_doc: dict[str, Any]) -> dict[str, Any]:
        try:
            result = await get_database().users.insert_one(user_doc)
        except DuplicateKeyError as exc:
            raise DuplicateEmailError() from exc
        user_doc["_id"] = result.inserted_id
        return user_doc

    async def create_plan(self, plan_doc: dict[str, Any]) -> dict[str, Any]:
        result = await get_database().plans.insert_one(plan_doc)
        plan_doc["_id"] = result.inserted_id
        return plan_doc

    async def add_generation_steps(self, steps: list[dict[str, Any]]) -> None:
        if steps:
            await get_database().generation_steps.insert_many(steps)

    async def list_user_plans(self, user_id: str) -> list[dict[str, Any]]:
        cursor = get_database().plans.find({"user_id": user_id}).sort("created_at", -1)
        return [serialize_doc(plan) async for plan in cursor]

    async def get_plan_by_id(self, plan_id: str) -> Optional[dict[str, Any]]:
        from bson import ObjectId

        if not ObjectId.is_valid(plan_id):
            return None
        return await get_database().plans.find_one({"_id": ObjectId(plan_id)})

    async def delete_user_plan(self, plan_id: str, user_id: str) -> None:
        from bson import ObjectId

        if not ObjectId.is_valid(plan_id):
            return
        await get_database().plans.delete_one({"_id": ObjectId(plan_id), "user_id": user_id})
        await get_database().generation_steps.delete_many({"plan_id": plan_id, "user_id": user_id})
        await get_database().feedback.delete_many({"plan_id": plan_id, "user_id": user_id})

    async def create_feedback(self, feedback_doc: dict[str, Any]) -> dict[str, Any]:
        result = await get_database().feedback.insert_one(feedback_doc)
        feedback_doc["_id"] = result.inserted_id
        return feedback_doc

    async def get_feedback_summary(self, user_id: str) -> dict[str, Any]:
        items = await get_database().feedback.find({"user_id": user_id}).to_list(length=None)
        return _feedback_summary(items)


storage: Optional[Storage] = None


async def initialize_storage() -> None:
    global storage
    if settings.storage_mode.lower() == "mongo":
        storage = MongoStorage()
    else:
        storage = LocalJsonStorage(settings.local_data_file)
    await storage.connect()


async def close_storage() -> None:
    if storage is not None:
        await storage.close()


def get_storage() -> Storage:
    if storage is None:
        raise RuntimeError("Storage has not been initialized")
    return storage


def _feedback_summary(items: list[dict[str, Any]]) -> dict[str, Any]:
    score_keys = [
        "clarity_score",
        "coherence_score",
        "completeness_score",
        "feasibility_score",
        "usefulness_score",
    ]
    if not items:
        return {
            "feedback_count": 0,
            "average_scores": {key: 0.0 for key in score_keys},
        }
    return {
        "feedback_count": len(items),
        "average_scores": {
            key: round(sum(item.get(key, 0) for item in items) / len(items), 2)
            for key in score_keys
        },
    }
