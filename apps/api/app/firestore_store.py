from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from google.cloud import firestore

from app.settings import settings


def firestore_client() -> firestore.Client:
    if settings.google_cloud_project:
        return firestore.Client(project=settings.google_cloud_project)
    return firestore.Client()


def utc_now() -> datetime:
    return datetime.now(UTC)


class FirestoreStore:
    def __init__(self) -> None:
        self.client = firestore_client()

    def create(self, collection: str, payload: dict[str, Any]) -> dict[str, Any]:
        document_id = str(uuid4())
        now = utc_now()
        document = {
            "id": document_id,
            **payload,
            "created_at": now,
            "updated_at": now,
        }
        self.client.collection(collection).document(document_id).set(document)
        return document

    def set(self, collection: str, document_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        now = utc_now()
        document = {
            "id": document_id,
            **payload,
            "created_at": payload.get("created_at", now),
            "updated_at": now,
        }
        self.client.collection(collection).document(document_id).set(document, merge=True)
        return document

    def get(self, collection: str, document_id: str) -> dict[str, Any]:
        snapshot = self.client.collection(collection).document(document_id).get()
        if not snapshot.exists:
            raise KeyError(document_id)
        return snapshot.to_dict() or {}

    def update(self, collection: str, document_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        document_ref = self.client.collection(collection).document(document_id)
        snapshot = document_ref.get()
        if not snapshot.exists:
            raise KeyError(document_id)

        document_ref.update({**payload, "updated_at": utc_now()})
        updated_snapshot = document_ref.get()
        return updated_snapshot.to_dict() or {}

    def find_by_field(self, collection: str, field: str, value: Any, limit: int = 25) -> list[dict[str, Any]]:
        snapshots = (
            self.client.collection(collection)
            .where(field, "==", value)
            .limit(limit)
            .stream()
        )
        return [snapshot.to_dict() or {} for snapshot in snapshots]

    def list_queue(self, limit: int = 25) -> list[dict[str, Any]]:
        snapshots = (
            self.client.collection("queue_entries")
            .where("status", "==", "queued")
            .order_by("priority_score", direction=firestore.Query.DESCENDING)
            .limit(limit)
            .stream()
        )
        return [snapshot.to_dict() or {} for snapshot in snapshots]


store = FirestoreStore()
