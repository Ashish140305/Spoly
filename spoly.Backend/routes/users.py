from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import Dict, Any
from utils.db import db
import traceback

router = APIRouter()
users_collection = db["users"]

class SettingsPayload(BaseModel):
    clerk_id: str
    settings: Dict[str, Any]

@router.get("/settings/{clerk_id}")
async def get_user_settings(clerk_id: str):
    try:
        user = users_collection.find_one({"clerk_id": clerk_id}, {"_id": 0, "settings": 1})
        if not user or "settings" not in user:
            return {"settings": {}}
        return {"settings": user["settings"]}
    except Exception as e:
        print("🚨 Error fetching settings:", e)
        raise HTTPException(status_code=500, detail="Database error")

@router.post("/settings")
async def save_user_settings(payload: SettingsPayload):
    try:
        users_collection.update_one(
            {"clerk_id": payload.clerk_id},
            {"$set": {"settings": payload.settings}},
            upsert=True
        )
        return {"success": True, "message": "Settings updated"}
    except Exception as e:
        print("🚨 Error saving settings:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error")
