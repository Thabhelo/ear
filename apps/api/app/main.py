from datetime import UTC, datetime
from uuid import UUID, uuid4

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.models import ConsentRecordCreate, MessageCreate, QueueEntry, QueueEntryCreate
from app.settings import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ear-api"}


@app.get("/catalog")
def catalog() -> dict[str, list[dict[str, str | int]]]:
    return {
        "one_offs": [
            {"name": "Quick Call", "amount_cents": 299, "duration_minutes": 3},
            {"name": "Standard Call", "amount_cents": 699, "duration_minutes": 25},
            {"name": "Long Call", "amount_cents": 1499, "duration_minutes": 60},
            {"name": "Text Session", "amount_cents": 199, "duration_minutes": 0},
        ],
        "subscriptions": [
            {"name": "Text Friend", "amount_cents": 499, "interval": "month"},
            {"name": "Friend", "amount_cents": 1900, "interval": "month"},
            {"name": "Close Friend", "amount_cents": 2999, "interval": "month"},
            {"name": "Always There", "amount_cents": 4900, "interval": "month"},
        ],
    }


@app.post("/queue", response_model=QueueEntry, status_code=status.HTTP_201_CREATED)
def join_queue(entry: QueueEntryCreate) -> QueueEntry:
    waiting_time_bonus = 0.0
    return QueueEntry(
        id=uuid4(),
        user_id=entry.user_id,
        mode=entry.mode,
        bid_amount_cents=entry.bid_amount_cents,
        waiting_time_bonus=waiting_time_bonus,
        priority_score=(entry.bid_amount_cents / 100) + waiting_time_bonus,
        created_at=datetime.now(UTC),
    )


@app.post("/calls/{call_id}/consent", status_code=status.HTTP_201_CREATED)
def record_consent(call_id: UUID, consent: ConsentRecordCreate) -> dict[str, str]:
    if call_id != consent.call_id:
        raise HTTPException(status_code=400, detail="Call ID mismatch.")
    if not consent.recording_consented or not consent.terms_consented:
        raise HTTPException(status_code=403, detail="Consent is required before joining.")
    return {"status": "recorded"}


@app.post("/calls/{call_id}/panic-end")
def panic_end_call(call_id: UUID) -> dict[str, str]:
    return {"status": "ended_by_host", "call_id": str(call_id)}


@app.post("/messages", status_code=status.HTTP_201_CREATED)
def create_message(message: MessageCreate) -> dict[str, str]:
    return {"status": "accepted", "message_id": str(uuid4())}


@app.post("/stripe/webhook")
def stripe_webhook() -> dict[str, str]:
    return {"status": "received"}
