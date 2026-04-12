# import os
# from dotenv import load_dotenv

# # ✅ MUST BE FIRST
# load_dotenv()

# from fastapi import FastAPI, Request, HTTPException
# from fastapi.responses import JSONResponse
# from pymongo import MongoClient

# # 🚀 FIX: Import CORSMiddleware
# from fastapi.middleware.cors import CORSMiddleware
# from svix.webhooks import Webhook, WebhookVerificationError

# from routes import notes
# from utils.config import MONGO_URI, MONGO_DB_NAME, CLERK_SECRET

# app = FastAPI()

# # 🚀 FIX: Add CORS Middleware so your React frontend is allowed to talk to the API
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins (localhost:5173, etc.)
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
#     allow_headers=["*"],  # Allows all headers
# )

# # ---------------- ROUTES ----------------

# app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])


# @app.get("/")
# def home():
#     return {"message": "Spoly Notes Backend Running"}


# @app.get("/api/webhooks/clerk")
# def webhook_test():
#     return {"message": "Webhook endpoint. Use POST."}


# # ---------------- CLERK WEBHOOK ----------------


# @app.post("/api/webhooks/clerk")
# async def clerk_webhook(request: Request):

#     headers = dict(request.headers)
#     payload = await request.body()

#     try:
#         wh = Webhook(CLERK_SECRET)
#         evt = wh.verify(payload, headers)
#     except WebhookVerificationError:
#         raise HTTPException(status_code=400, detail="Invalid signature")

#     event_type = evt.get("type")
#     data = evt.get("data")

#     if event_type == "user.created":
#         try:
#             # 🚀 Connect to Mongo
#             client = MongoClient(MONGO_URI)
#             db = client[MONGO_DB_NAME]
#             users_collection = db["users"]

#             user_doc = {
#                 "clerk_id": data.get("id"),
#                 "email": data.get("email_addresses", [{}])[0].get("email_address", ""),
#                 "first_name": data.get("first_name", ""),
#                 "last_name": data.get("last_name", ""),
#             }

#             # 🚀 UPSERT: If user exists, update them. If not, insert them.
#             users_collection.update_one(
#                 {"clerk_id": user_doc["clerk_id"]}, {"$set": user_doc}, upsert=True
#             )

#         except Exception as e:
#             print("🚨 DB ERROR:", e)

#     return JSONResponse(content={"success": True})

import os
import sys
import io

if sys.stdout.encoding is not None and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
    except AttributeError:
        pass

from dotenv import load_dotenv

# MUST BE FIRST
load_dotenv()

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from pymongo import MongoClient

# CORS Middleware
from fastapi.middleware.cors import CORSMiddleware
from svix.webhooks import Webhook, WebhookVerificationError

from routes import notes, users, templates
from utils.config import MONGO_URI, MONGO_DB_NAME, CLERK_SECRET

app = FastAPI()

# Add CORS Middleware so your React frontend is allowed to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (localhost:5173, etc.)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

# ---------------- ROUTES ----------------

app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(templates.router, prefix="/api/templates", tags=["Templates"])


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
            # 🚀 Connect to Mongo
            client = MongoClient(MONGO_URI)
            db = client[MONGO_DB_NAME]
            users_collection = db["users"]

            user_doc = {
                "clerk_id": data.get("id"),
                "email": data.get("email_addresses", [{}])[0].get("email_address", ""),
                "first_name": data.get("first_name", ""),
                "last_name": data.get("last_name", ""),
            }

            # 🚀 UPSERT: If user exists, update them. If not, insert them.
            users_collection.update_one(
                {"clerk_id": user_doc["clerk_id"]}, {"$set": user_doc}, upsert=True
            )

        except Exception as e:
            print("🚨 DB ERROR:", e)

    return JSONResponse(content={"success": True})
