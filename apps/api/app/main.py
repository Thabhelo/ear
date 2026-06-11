from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

from app.auth import current_user_id
from app.firestore_store import store, utc_now
from app.integrations import ONE_OFF_PRODUCTS, SUBSCRIPTION_PRODUCTS, calls_client, storage_client, stripe_client
from app.models import (
    BanAppealRequest,
    BanRequest,
    CheckoutOneOffRequest,
    CheckoutResponse,
    CheckoutSubscriptionRequest,
    ConsentRecordCreate,
    CreateRoomRequest,
    EndCallRequest,
    HostJoinRoomRequest,
    HostStatusRequest,
    MessageCreate,
    QueueJoinRequest,
    QueueStatusResponse,
    RecordingWebhookRequest,
    ReportRequest,
)
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
    return {"status": "ok", "service": "callsomeone-api", "environment": settings.environment}


@app.get("/catalog")
def catalog() -> dict[str, object]:
    return {
        "modes": [
            {"id": "just_listen", "name": "Just Listen"},
            {"id": "conversation", "name": "Conversation"},
            {"id": "deep_talk", "name": "Deep Talk"},
            {"id": "silent_company", "name": "Silent Company"},
            {"id": "study_buddy", "name": "Study Buddy"},
            {"id": "game_mode", "name": "Game Mode"},
        ],
        "one_offs": ONE_OFF_PRODUCTS,
        "subscriptions": SUBSCRIPTION_PRODUCTS,
    }


@app.post("/checkout/one-off", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout_one_off(
    payload: CheckoutOneOffRequest, user_id: str = Depends(current_user_id)
) -> CheckoutResponse:
    product = ONE_OFF_PRODUCTS[payload.product.value]
    session = store.create(
        "sessions",
        {
            "user_id": user_id,
            "mode": payload.mode.value,
            "type": product["type"],
            "duration_minutes": product["duration_minutes"],
            "price_paid": product["amount_cents"] + payload.priority_bid_cents,
            "priority_bid": payload.priority_bid_cents,
            "status": "checkout_pending",
            "started_at": None,
            "ended_at": None,
            "recording_url": None,
            "consent_given_at": None,
            "grace_extended": False,
        },
    )
    checkout = stripe_client.create_one_off_checkout(
        session_id=session["id"],
        product_key=payload.product.value,
        priority_bid_cents=payload.priority_bid_cents,
    )
    store.create(
        "payments",
        {
            "user_id": user_id,
            "session_id": session["id"],
            "amount_cents": product["amount_cents"] + payload.priority_bid_cents,
            "stripe_checkout_session_id": checkout["stripe_session_id"],
            "status": "checkout_created" if checkout["configured"] else "preview_checkout",
        },
    )
    return CheckoutResponse(
        checkout_url=checkout["checkout_url"],
        session_id=session["id"],
        configured=checkout["configured"],
    )


@app.post("/checkout/subscription", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout_subscription(
    payload: CheckoutSubscriptionRequest, user_id: str = Depends(current_user_id)
) -> CheckoutResponse:
    checkout = stripe_client.create_subscription_checkout(
        user_id=user_id,
        plan_key=payload.plan.value,
    )
    subscription = store.create(
        "subscriptions",
        {
            "user_id": user_id,
            "plan": payload.plan.value,
            "stripe_checkout_session_id": checkout["stripe_session_id"],
            "status": "checkout_created" if checkout["configured"] else "preview_checkout",
        },
    )
    return CheckoutResponse(
        checkout_url=checkout["checkout_url"],
        session_id=subscription["id"],
        configured=checkout["configured"],
    )


@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request) -> dict[str, str]:
    payload = await request.json()
    event = store.create("stripe_events", {"payload": payload, "status": "received"})
    session_id = payload.get("data", {}).get("object", {}).get("client_reference_id")
    if session_id:
        try:
            store.update("sessions", session_id, {"status": "paid"})
        except KeyError:
            pass
    return {"status": "received", "event_id": event["id"]}


@app.post("/queue/join", status_code=status.HTTP_201_CREATED)
def join_queue(payload: QueueJoinRequest, user_id: str = Depends(current_user_id)) -> dict[str, object]:
    try:
        session = store.get("sessions", payload.session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="This session belongs to another user.")

    waiting_time_bonus = 0.0
    priority_score = (payload.priority_bid_cents / 100) + waiting_time_bonus
    queue_entry = store.create(
        "queue_entries",
        {
            "user_id": user_id,
            "session_id": payload.session_id,
            "mode": session["mode"],
            "priority_bid_cents": payload.priority_bid_cents,
            "waiting_time_bonus": waiting_time_bonus,
            "priority_score": priority_score,
            "status": "queued",
        },
    )
    store.update("sessions", payload.session_id, {"status": "queued"})
    return {"status": "queued", "queue_entry": queue_entry}


@app.get("/queue/status", response_model=QueueStatusResponse)
def queue_status(session_id: str, user_id: str = Depends(current_user_id)) -> QueueStatusResponse:
    try:
        session = store.get("sessions", session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="This session belongs to another user.")

    entries = store.list_queue(limit=100)
    for index, entry in enumerate(entries, start=1):
        if entry.get("session_id") == session_id:
            return QueueStatusResponse(
                session_id=session_id,
                status=entry.get("status", "queued"),
                position=index,
                priority_score=entry.get("priority_score"),
            )
    return QueueStatusResponse(session_id=session_id, status=session.get("status", "unknown"))


@app.get("/queue/list")
def queue_list() -> dict[str, list[dict[str, object]]]:
    return {"entries": store.list_queue(limit=50)}


@app.post("/calls/consent", status_code=status.HTTP_201_CREATED)
def record_consent(consent: ConsentRecordCreate, user_id: str = Depends(current_user_id)) -> dict[str, str]:
    if not consent.recording_consented or not consent.terms_consented:
        raise HTTPException(status_code=403, detail="Consent is required before joining.")
    try:
        session = store.get("sessions", consent.session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="This session belongs to another user.")

    store.create(
        "consent_records",
        {
            "session_id": consent.session_id,
            "user_id": user_id,
            "recording_consented": consent.recording_consented,
            "terms_consented": consent.terms_consented,
            "consent_timestamp": utc_now(),
        },
    )
    store.update("sessions", consent.session_id, {"consent_given_at": utc_now(), "status": "consent_pending"})
    return {"status": "recorded", "session_id": consent.session_id}


@app.post("/calls/create-room", status_code=status.HTTP_201_CREATED)
def create_room(payload: CreateRoomRequest, user_id: str = Depends(current_user_id)) -> dict[str, object]:
    if not payload.consent_given:
        raise HTTPException(status_code=403, detail="Recording consent is required before joining.")
    try:
        session = store.get("sessions", payload.session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="This session belongs to another user.")
    room = calls_client.create_room(session_id=payload.session_id, user_id=user_id)
    store.update("sessions", payload.session_id, {"status": "active", "started_at": utc_now()})
    return {"session": session, "room": room}


@app.post("/host/join-room", status_code=status.HTTP_201_CREATED)
def host_join_room(payload: HostJoinRoomRequest) -> dict[str, object]:
    try:
        session = store.get("sessions", payload.session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    room = calls_client.create_room(
        session_id=payload.session_id,
        user_id=settings.host_user_id,
        role="host",
    )
    if session.get("status") not in {"active", "consent_pending"}:
        store.update("sessions", payload.session_id, {"status": "active", "started_at": utc_now()})
    return {"session": session, "room": room}


@app.post("/host/end-call")
def host_end_call(payload: EndCallRequest) -> dict[str, str]:
    try:
        store.get("sessions", payload.session_id)
        store.update(
            "sessions",
            payload.session_id,
            {
                "status": "ended",
                "ended_at": utc_now(),
                "ended_by": payload.ended_by,
                "end_reason": payload.reason,
                "refund_requested": payload.refund_requested,
            },
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    return {"status": "ended", "session_id": payload.session_id}


@app.post("/calls/end")
def end_call(payload: EndCallRequest, user_id: str = Depends(current_user_id)) -> dict[str, str]:
    try:
        session = store.get("sessions", payload.session_id)
        if session.get("user_id") != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        store.update(
            "sessions",
            payload.session_id,
            {
                "status": "ended",
                "ended_at": utc_now(),
                "ended_by": payload.ended_by,
                "end_reason": payload.reason,
                "refund_requested": payload.refund_requested,
            },
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Session not found.") from None
    return {"status": "ended", "session_id": payload.session_id}


@app.post("/recordings/webhook", status_code=status.HTTP_201_CREATED)
def recording_webhook(payload: RecordingWebhookRequest) -> dict[str, object]:
    object_name = f"recordings/{payload.session_id}/{payload.provider_recording_id or 'upload'}.bin"
    signed_upload_url = storage_client.signed_recording_url(object_name=object_name)
    recording = store.create(
        "recordings",
        {
            "session_id": payload.session_id,
            "provider_recording_id": payload.provider_recording_id,
            "source_url": payload.source_url,
            "storage_path": object_name,
            "signed_upload_url_created": bool(signed_upload_url),
            "duration_seconds": payload.duration_seconds,
            "created_at": utc_now(),
        },
    )
    store.update("sessions", payload.session_id, {"recording_url": object_name})
    return {"recording": recording, "signed_upload_url": signed_upload_url}


@app.post("/messages/send", status_code=status.HTTP_201_CREATED)
def create_message(message: MessageCreate) -> dict[str, str]:
    document = store.create(
        "messages",
        {
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "session_id": message.session_id,
            "content": message.content,
            "status": "sent",
        },
    )
    return {"status": "accepted", "message_id": document["id"]}


@app.post("/reports", status_code=status.HTTP_201_CREATED)
def create_report(payload: ReportRequest, user_id: str = Depends(current_user_id)) -> dict[str, object]:
    report = store.create("reports", {**payload.model_dump(), "user_id": user_id, "status": "open"})
    store.update("sessions", payload.session_id, {"status": "reported"})
    return report


@app.post("/ban", status_code=status.HTTP_201_CREATED)
def create_ban(payload: BanRequest) -> dict[str, object]:
    return store.create(
        "bans",
        {
            "user_id": payload.user_id,
            "ban_type": payload.ban_type.value,
            "reason": payload.reason,
            "appeal_eligible": payload.ban_type.value == "standard",
        },
    )


@app.post("/ban-appeal", status_code=status.HTTP_201_CREATED)
def create_ban_appeal(payload: BanAppealRequest) -> dict[str, object]:
    try:
        ban = store.get("bans", payload.ban_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Ban not found.") from None
    if not ban.get("appeal_eligible"):
        raise HTTPException(status_code=403, detail="This ban is not appeal eligible.")
    return store.create(
        "ban_appeals",
        {
            "user_id": payload.user_id,
            "ban_id": payload.ban_id,
            "statement": payload.statement,
            "review_fee_cents": 5000,
            "status": "payment_required",
        },
    )


@app.post("/host/status", status_code=status.HTTP_201_CREATED)
def update_host_status(payload: HostStatusRequest) -> dict[str, object]:
    return store.set("host_status", settings.host_user_id, payload.model_dump())
