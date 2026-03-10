import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from svix.webhooks import Webhook, WebhookVerificationError
import mysql.connector
import os
from dotenv import load_dotenv
from routes import notes

app = FastAPI()

@app.get("/api/webhooks/clerk")
def webhook_test():
    return {"message": "Webhook endpoint. Use POST."}

# ---------------- CONFIGURATION ----------------

load_dotenv()

CLERK_SECRET = os.getenv("CLERK_SECRET")

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
    "port": os.getenv("DB_PORT")
}

# ---------------- ROUTES ----------------

app.include_router(notes.router)


@app.get("/")
def home():
    return {"message": "Spoly Notes Backend Running"}


# ---------------- CLERK WEBHOOK ----------------

@app.post("/api/webhooks/clerk")
async def clerk_webhook(request: Request):

    headers = dict(request.headers)
    payload = await request.body()

    try:
        wh = Webhook(CLERK_SECRET)
        evt = wh.verify(payload, headers)

    except WebhookVerificationError:
        print("❌ Webhook Verification Failed!")
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = evt.get("type")
    data = evt.get("data")

    print(f"📥 Received event: {event_type}")

    if event_type == "user.created":

        clerk_id = data.get("id")

        email = ""
        if data.get("email_addresses"):
            email = data["email_addresses"][0]["email_address"]

        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")

        print(f"🧐 Attempting to save user: {first_name} ({clerk_id})")

        try:
            print("🔗 Connecting to MySQL...")

            conn = mysql.connector.connect(**DB_CONFIG)
            print("Connected to MySQL:", conn.is_connected())
            cursor = conn.cursor()

            sql = """
            INSERT INTO users (clerk_id, email, first_name, last_name)
            VALUES (%s, %s, %s, %s)
            """

            cursor.execute(sql, (clerk_id, email, first_name, last_name))

            print("💾 Executing INSERT... sending Commit...")

            conn.commit()

            print("✅ DATABASE UPDATED SUCCESSFULLY!")

        except mysql.connector.Error as err:
            print(f"❌ MYSQL ERROR: {err}")

        except Exception as e:
            print(f"❌ GENERAL ERROR: {e}")

        finally:
            if 'conn' in locals() and conn.is_connected():
                cursor.close()
                conn.close()
                print("🔌 Connection closed.")

    return JSONResponse(content={"success": True})