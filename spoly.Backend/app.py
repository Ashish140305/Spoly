import os
from flask import Flask, request, jsonify
from svix.webhooks import Webhook, WebhookVerificationError
import mysql.connector

app = Flask(__name__)

# --- CONFIGURATION ---
CLERK_SECRET = "whsec_9IqBFqGNJLxwg2uceSnsO8x5WJz6Z4nB" # Paste your secret here

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "", # Update this
    "database": "spoly_db"
}

@app.route('/api/webhooks/clerk', methods=['POST'])
def clerk_webhook():
    headers = dict(request.headers)
    payload = request.get_data()

    try:
        wh = Webhook(CLERK_SECRET)
        evt = wh.verify(payload, headers)
    except WebhookVerificationError:
        print("❌ Webhook Verification Failed!")
        return jsonify({"error": "Invalid signature"}), 400

    event_type = evt.get('type')
    data = evt.get('data')
    print(f"📥 Received event: {event_type}")

    if event_type == 'user.created':
        clerk_id = data.get('id')
        email = data['email_addresses'][0]['email_address'] if data.get('email_addresses') else ""
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        print(f"🧐 Attempting to save user: {first_name} ({clerk_id})")

        try:
            print("🔗 Connecting to MySQL...")
            conn = mysql.connector.connect(**DB_CONFIG)
            cursor = conn.cursor()
            
            sql = "INSERT INTO users (clerk_id, email, first_name, last_name) VALUES (%s, %s, %s, %s)"
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

    return jsonify({"success": True}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)