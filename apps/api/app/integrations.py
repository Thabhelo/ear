from datetime import timedelta
from typing import Any, Literal

import stripe
from google.cloud import storage, tasks_v2
from livekit import api as livekit_api

from app.firestore_store import utc_now
from app.settings import settings

ONE_OFF_PRODUCTS = {
    "text_once": {"name": "Text once", "amount_cents": 699, "duration_minutes": 0, "type": "text"},
    "quick_call": {"name": "Quick Call", "amount_cents": 299, "duration_minutes": 3, "type": "call"},
    "standard_call": {"name": "Standard Call", "amount_cents": 699, "duration_minutes": 25, "type": "call"},
    "long_call": {"name": "Long Call", "amount_cents": 1499, "duration_minutes": 60, "type": "call"},
}

SUBSCRIPTION_PRODUCTS = {
    "text_friend": {"name": "Text Friend", "amount_cents": 499},
    "friend": {"name": "Friend", "amount_cents": 1900},
    "close_friend": {"name": "Close Friend", "amount_cents": 2999},
    "always_there": {"name": "Always There", "amount_cents": 4900},
}


def provider_configured(value: str | None) -> bool:
    return bool(value and value.strip() and not value.startswith("replace-me"))


class StripeClient:
    def __init__(self) -> None:
        self.configured = provider_configured(settings.stripe_secret_key)
        if self.configured:
            stripe.api_key = settings.stripe_secret_key

    def create_one_off_checkout(
        self, *, session_id: str, product_key: str, priority_bid_cents: int
    ) -> dict[str, Any]:
        product = ONE_OFF_PRODUCTS[product_key]
        total_cents = product["amount_cents"] + priority_bid_cents
        if not self.configured:
            return {
                "configured": False,
                "checkout_url": f"{settings.app_base_url}/queue?session={session_id}&preview=1",
                "stripe_session_id": f"preview_{session_id}",
            }

        checkout = stripe.checkout.Session.create(
            mode="payment",
            success_url=f"{settings.app_base_url}/queue?session={session_id}",
            cancel_url=f"{settings.app_base_url}/start?cancelled=1",
            client_reference_id=session_id,
            metadata={"session_id": session_id, "product": product_key},
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": total_cents,
                        "product_data": {"name": product["name"]},
                    },
                }
            ],
        )
        return {
            "configured": True,
            "checkout_url": checkout.url,
            "stripe_session_id": checkout.id,
        }

    def create_subscription_checkout(self, *, user_id: str, plan_key: str) -> dict[str, Any]:
        product = SUBSCRIPTION_PRODUCTS[plan_key]
        if not self.configured:
            return {
                "configured": False,
                "checkout_url": f"{settings.app_base_url}/start?plan={plan_key}&activated=1",
                "stripe_session_id": f"preview_subscription_{user_id}_{plan_key}",
            }

        checkout = stripe.checkout.Session.create(
            mode="subscription",
            success_url=f"{settings.app_base_url}/account?subscription=success",
            cancel_url=f"{settings.app_base_url}/start?cancelled=1",
            client_reference_id=user_id,
            metadata={"user_id": user_id, "plan": plan_key},
            line_items=[
                {
                    "quantity": 1,
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": product["amount_cents"],
                        "recurring": {"interval": "month"},
                        "product_data": {"name": product["name"]},
                    },
                }
            ],
        )
        return {
            "configured": True,
            "checkout_url": checkout.url,
            "stripe_session_id": checkout.id,
        }


class CallsClient:
    @property
    def configured(self) -> bool:
        return all(
            [
                provider_configured(settings.livekit_url),
                provider_configured(settings.livekit_api_key),
                provider_configured(settings.livekit_api_secret),
            ]
        )

    def _room_name(self, session_id: str) -> str:
        return f"pickup-{session_id}"

    def _access_token(
        self,
        *,
        session_id: str,
        identity: str,
        display_name: str,
        role: Literal["caller", "host"],
    ) -> str:
        room_name = self._room_name(session_id)
        grants = livekit_api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=True,
            can_subscribe=True,
            can_publish_sources=["microphone"],
            room_admin=role == "host",
        )
        return (
            livekit_api.AccessToken(settings.livekit_api_key, settings.livekit_api_secret)
            .with_identity(identity)
            .with_name(display_name)
            .with_grants(grants)
            .to_jwt()
        )

    def create_room(
        self,
        *,
        session_id: str,
        user_id: str,
        role: Literal["caller", "host"] = "caller",
    ) -> dict[str, Any]:
        room_name = self._room_name(session_id)
        token = None
        if self.configured:
            identity = settings.host_user_id if role == "host" else user_id
            display_name = "Host" if role == "host" else "Guest"
            token = self._access_token(
                session_id=session_id,
                identity=identity,
                display_name=display_name,
                role=role,
            )

        return {
            "configured": self.configured,
            "provider": "livekit",
            "livekit_url": settings.livekit_url,
            "room_name": room_name,
            "join_url": f"{settings.app_base_url}/call?session={session_id}",
            "token": token,
        }


class StorageClient:
    @property
    def configured(self) -> bool:
        return provider_configured(settings.google_cloud_storage_bucket)

    def signed_recording_url(self, *, object_name: str) -> str | None:
        if not self.configured:
            return None
        client = storage.Client(project=settings.google_cloud_project)
        blob = client.bucket(settings.google_cloud_storage_bucket).blob(object_name)
        return blob.generate_signed_url(
            version="v4",
            expiration=timedelta(minutes=15),
            method="PUT",
            content_type="application/octet-stream",
        )


class TasksClient:
    @property
    def configured(self) -> bool:
        return bool(settings.google_cloud_project and settings.cloud_tasks_queue)

    def enqueue_session_timeout(self, *, session_id: str, delay_seconds: int) -> dict[str, Any]:
        if not self.configured:
            return {"configured": False, "task_name": None}
        client = tasks_v2.CloudTasksClient()
        parent = client.queue_path(
            settings.google_cloud_project,
            settings.cloud_tasks_location,
            settings.cloud_tasks_queue,
        )
        task = {
            "schedule_time": utc_now() + timedelta(seconds=delay_seconds),
            "http_request": {
                "http_method": tasks_v2.HttpMethod.POST,
                "url": f"{settings.app_base_url}/api/internal/session-timeout/{session_id}",
            },
        }
        created = client.create_task(parent=parent, task=task)
        return {"configured": True, "task_name": created.name}


stripe_client = StripeClient()
calls_client = CallsClient()
storage_client = StorageClient()
tasks_client = TasksClient()
