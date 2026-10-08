import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from utils.config import MINIMOTH_API_KEY


router = APIRouter()
MINIMOTH_API_URL = "https://api.minimoth.dev/v1"


class SendOtpRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)


class VerifyOtpRequest(SendOtpRequest):
    code: str = Field(pattern=r"^\d{6}$")


class RefreshSessionRequest(BaseModel):
    refresh_token: str = Field(min_length=1)


def minimoth_request(path: str, payload: dict):
    if not MINIMOTH_API_KEY:
        raise HTTPException(status_code=500, detail="MiniMoth authentication is not configured")

    try:
        response = requests.post(
            f"{MINIMOTH_API_URL}{path}",
            headers={
                "X-Api-Key": MINIMOTH_API_KEY,
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=15,
        )
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Unable to reach MiniMoth")

    try:
        body = response.json()
    except ValueError:
        body = {}

    if not response.ok:
        detail = {
            "message": body.get("message") or body.get("error") or "MiniMoth request failed",
            "code": body.get("code"),
            "request_id": body.get("request_id"),
        }
        raise HTTPException(status_code=response.status_code, detail=detail)

    return body


@router.get("/status")
def auth_status():
    key = MINIMOTH_API_KEY or ""
    return {
        "configured": bool(key),
        "mode": "live" if key.startswith("mm_live_") else "test" if key.startswith("mm_test_") else "unknown",
    }


@router.get("/otp-status/{otp_id}")
def otp_status(otp_id: str):
    if not MINIMOTH_API_KEY:
        raise HTTPException(status_code=500, detail="MiniMoth authentication is not configured")
    try:
        response = requests.get(
            f"{MINIMOTH_API_URL}/otp/status/{otp_id}",
            headers={"X-Api-Key": MINIMOTH_API_KEY},
            timeout=15,
        )
    except requests.RequestException:
        raise HTTPException(status_code=502, detail="Unable to reach MiniMoth")
    try:
        body = response.json()
    except ValueError:
        body = {}
    if not response.ok:
        raise HTTPException(
            status_code=response.status_code,
            detail={
                "message": body.get("message") or body.get("error") or "Unable to check OTP delivery",
                "code": body.get("code"),
                "request_id": body.get("request_id"),
            },
        )
    return body


@router.post("/send-otp")
def send_otp(payload: SendOtpRequest):
    return minimoth_request("/otp/send", {"phone": payload.phone})


@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpRequest):
    return minimoth_request("/otp/verify", {"phone": payload.phone, "code": payload.code})


@router.post("/refresh")
def refresh_session(payload: RefreshSessionRequest):
    return minimoth_request("/session/refresh", {"refresh_token": payload.refresh_token})


@router.post("/logout")
def logout(payload: RefreshSessionRequest):
    return minimoth_request("/session/logout", {"refresh_token": payload.refresh_token})
