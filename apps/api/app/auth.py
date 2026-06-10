from functools import lru_cache

import firebase_admin
from fastapi import Header, HTTPException
from firebase_admin import auth as firebase_auth

from app.settings import settings


@lru_cache
def firebase_app() -> firebase_admin.App:
    try:
        return firebase_admin.get_app()
    except ValueError:
        options = {}
        if settings.firebase_project_id:
            options["projectId"] = settings.firebase_project_id
        return firebase_admin.initialize_app(options=options)


def current_user_id(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Firebase sign-in is required.")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        firebase_app()
        decoded = firebase_auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase token.") from exc

    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid Firebase token.")
    return uid
