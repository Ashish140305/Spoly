import os
from dotenv import load_dotenv

# ✅ MUST BE FIRST
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
# 🚀 FIX: Import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from svix.webhooks import Webhook, WebhookVerificationError
import mysql.connector

from routes import notes
from utils.config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, CLERK_SECRET

app = FastAPI()

# 🚀 FIX: Add CORS Middleware so your React frontend is allowed to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (localhost:5173, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ---------------- DB CONFIG ----------------

DB_CONFIG = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "port": DB_PORT
}

# ---------------- ROUTES ----------------

app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/")
def home():
    return {"message": "Spoly Notes Backend Running"}

@app.get("/api/webhooks/clerk")
def webhook_test():
    return {"message": "Webhook endpoint. Use POST."}

# ---------------- CLERK WEBHOOK ----------------

@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):

    headers = dict(request.headers)
    payload = await request.body()

    try:
        wh = Webhook(CLERK_SECRET)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = evt.get("type")
    data = evt.get("data")

    if event_type == "user.created":
        try:
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()

            cursor.execute("""
            INSERT INTO users (clerk_id, email, first_name, last_name)
            VALUES (%s, %s, %s, %s)
            """, (
                data.get("id"),
                data.get("email_addresses", [{}])[0].get("email_address", ""),
                data.get("first_name", ""),
                data.get("last_name", "")
            ))

            conn.commit()

        except Exception as e:
            print("DB ERROR:", e)

        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()

    return JSONResponse(content={"success": True})