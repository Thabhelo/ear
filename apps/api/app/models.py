from datetime import datetime
from enum import StrEnum
from uuid import UUID

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
    permanent = "permanent"


class QueueEntryCreate(BaseModel):
    user_id: UUID
    mode: InteractionMode
    purchased_minutes: int = Field(gt=0)
    bid_amount_cents: int = Field(ge=0)
    payment_id: UUID


class QueueEntry(BaseModel):
    id: UUID
    user_id: UUID
    mode: InteractionMode
    bid_amount_cents: int
    waiting_time_bonus: float
    priority_score: float
    created_at: datetime


class ConsentRecordCreate(BaseModel):
    call_id: UUID
    user_id: UUID
    recording_consented: bool
    terms_consented: bool


class RecordingRecord(BaseModel):
    id: UUID
    call_id: UUID
    storage_url: str
    consent_timestamp: datetime
    created_at: datetime


class MessageCreate(BaseModel):
    sender_id: UUID
    receiver_id: UUID
    content: str = Field(min_length=1, max_length=5000)
