from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.db import db
from bson.objectid import ObjectId
import traceback

router = APIRouter()
templates_collection = db["templates"]

class TemplatePayload(BaseModel):
    clerk_id: str
    name: str
    desc: str
    prompt: str
    category: str = "Custom"
    theme: str = "custom"

@router.get("/{clerk_id}")
async def get_user_templates(clerk_id: str):
    try:
        cursor = templates_collection.find({"clerk_id": clerk_id})
        templates = []
        for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            templates.append(doc)
        return {"templates": templates}
    except Exception as e:
        print("🚨 Error fetching templates:", e)
        raise HTTPException(status_code=500, detail="Database error")

@router.post("/")
async def create_template(payload: TemplatePayload):
    try:
        doc = payload.dict()
        result = templates_collection.insert_one(doc)
        # Build the response template with a clean string id
        response_template = {
            "id": str(result.inserted_id),
            "name": doc["name"],
            "desc": doc["desc"],
            "prompt": doc["prompt"],
            "category": doc.get("category", "Custom"),
            "theme": doc.get("theme", "custom"),
            "isCustom": True,
        }
        return {"success": True, "template": response_template}
    except Exception as e:
        print("🚨 Error saving template:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Database error")

@router.delete("/{template_id}")
async def delete_template(template_id: str):
    try:
        if not ObjectId.is_valid(template_id):
            raise HTTPException(status_code=400, detail="Invalid template id")
        result = templates_collection.delete_one({"_id": ObjectId(template_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Template not found")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print("🚨 Error deleting template:", e)
        raise HTTPException(status_code=500, detail="Database error")
