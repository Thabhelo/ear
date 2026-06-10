from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class InteractionMode(StrEnum):
    just_listen = "just_listen"
    conversation = "conversation"
    deep_talk = "deep_talk"
    silent_company = "silent_company"
    study_buddy = "study_buddy"
    game_mode = "game_mode"


class CallStatus(StrEnum):
    queued = "queued"
    consent_pending = "consent_pending"
    active = "active"
    completed = "completed"
    ended_by_host = "ended_by_host"
    ended_by_user = "ended_by_user"
    expired = "expired"


class SubscriptionPlan(StrEnum):
    text_friend = "text_friend"
    friend = "friend"
    close_friend = "close_friend"
    always_there = "always_there"


class BanType(StrEnum):
    standard = "standard"
    extreme = "extreme"


class SessionType(StrEnum):
    text = "text"
    call = "call"


class SessionStatus(StrEnum):
    checkout_pending = "checkout_pending"
    paid = "paid"
    queued = "queued"
    matched = "matched"
    consent_pending = "consent_pending"
    active = "active"
    completed = "completed"
    ended = "ended"
    reported = "reported"


class OneOffProduct(StrEnum):
    text_once = "text_once"
    quick_call = "quick_call"
    standard_call = "standard_call"
    long_call = "long_call"


class CheckoutOneOffRequest(BaseModel):
    mode: InteractionMode
    product: OneOffProduct
    priority_bid_cents: int = Field(default=0, ge=0)


class CheckoutSubscriptionRequest(BaseModel):
    plan: SubscriptionPlan


class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str
    provider: str = "stripe"
    configured: bool


class QueueJoinRequest(BaseModel):
    session_id: str = Field(min_length=1)
    priority_bid_cents: int = Field(default=0, ge=0)


class QueueStatusResponse(BaseModel):
    session_id: str
    status: str
    position: int | None = None
    priority_score: float | None = None


class QueueEntry(BaseModel):
    id: str
    session_id: str
    user_id: str
    mode: InteractionMode
    priority_bid_cents: int
    waiting_time_bonus: float
    priority_score: float
    created_at: datetime


class ConsentRecordCreate(BaseModel):
    session_id: str = Field(min_length=1)
    recording_consented: bool
    terms_consented: bool


class CreateRoomRequest(BaseModel):
    session_id: str = Field(min_length=1)
    consent_given: bool


class EndCallRequest(BaseModel):
    session_id: str = Field(min_length=1)
    ended_by: str = Field(pattern="^(host|user|system)$")
    reason: str = Field(default="ended", max_length=120)
    refund_requested: bool = False


class RecordingWebhookRequest(BaseModel):
    session_id: str = Field(min_length=1)
    provider_recording_id: str | None = None
    source_url: str | None = None
    duration_seconds: int | None = Field(default=None, ge=0)


class MessageCreate(BaseModel):
    sender_id: str = Field(min_length=1)
    receiver_id: str = Field(min_length=1)
    session_id: str | None = None
    content: str = Field(min_length=1, max_length=5000)


class BanRequest(BaseModel):
    user_id: str = Field(min_length=1)
    ban_type: BanType
    reason: str = Field(min_length=3, max_length=500)


class BanAppealRequest(BaseModel):
    user_id: str = Field(min_length=1)
    ban_id: str = Field(min_length=1)
    statement: str = Field(min_length=10, max_length=5000)


class ReportRequest(BaseModel):
    session_id: str = Field(min_length=1)
    reason: str = Field(min_length=3, max_length=500)
    details: str = Field(default="", max_length=5000)


class HostStatusRequest(BaseModel):
    available: bool
    note: str = Field(default="", max_length=500)
    energy: str = Field(default="available", max_length=80)
