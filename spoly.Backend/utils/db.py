# import mysql.connector
# from utils.config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

# DB_CONFIG = {
#     "host": DB_HOST,
#     "user": DB_USER,
#     "password": DB_PASSWORD,
#     "database": DB_NAME,
#     "port": DB_PORT,
# }


# def save_note_to_db(
#     clerk_id: str, source_type: str, transcript: str, notes: str, diagram: str
# ):
#     """Executes the SQL transaction to save generated notes."""
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         cursor = conn.cursor()

#         insert_query = """
#             INSERT INTO notes (clerk_id, source_type, original_transcript, generated_notes, diagram_data)
#             VALUES (%s, %s, %s, %s, %s)
#         """
#         cursor.execute(
#             insert_query, (clerk_id, source_type, transcript, notes, diagram)
#         )

#         conn.commit()
#         return True

#     except Exception as e:
#         print(f"🚨 SQL Error: {e}")
#         return False
#     finally:
#         if "conn" in locals() and conn.is_connected():
#             cursor.close()
#             conn.close()


# def get_notes_from_db(clerk_id: str):
#     """Fetches all saved notes for a specific user."""
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         cursor = conn.cursor(dictionary=True)

#         query = """
#             SELECT id, source_type, original_transcript, generated_notes, diagram_data, created_at
#             FROM notes
#             WHERE clerk_id = %s
#             ORDER BY created_at DESC
#         """
#         cursor.execute(query, (clerk_id,))
#         notes = cursor.fetchall()

#         return notes

#     except Exception as e:
#         print(f"🚨 SQL Error fetching notes: {e}")
#         return []
#     finally:
#         if "conn" in locals() and conn.is_connected():
#             cursor.close()
#             conn.close()


# def delete_note_from_db(note_id: int):
#     """Deletes a specific note from the database."""
#     try:
#         conn = mysql.connector.connect(**DB_CONFIG)
#         cursor = conn.cursor()

#         cursor.execute("DELETE FROM notes WHERE id = %s", (note_id,))
#         conn.commit()

#         return True

#     except Exception as e:
#         print(f"🚨 SQL Error deleting note: {e}")
#         return False
#     finally:
#         if "conn" in locals() and conn.is_connected():
#             cursor.close()
#             conn.close()

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timezone
from utils.config import MONGO_URI, MONGO_DB_NAME

# Initialize MongoDB Connection
client = MongoClient(MONGO_URI)
db = client[MONGO_DB_NAME]
notes_collection = db["notes"]


def save_note_to_db(
    clerk_id: str, source_type: str, transcript: str, notes: str, diagram: str
):
    """Saves generated notes as a MongoDB Document."""
    try:
        note_doc = {
            "clerk_id": clerk_id,
            "source_type": source_type,
            "original_transcript": transcript,
            "generated_notes": notes,
            "diagram_data": diagram,
            "created_at": datetime.now(timezone.utc),
        }
        notes_collection.insert_one(note_doc)
        return True

    except Exception as e:
        print(f"🚨 MongoDB Error (Save): {e}")
        return False


def get_notes_from_db(clerk_id: str):
    """Fetches all saved notes for a specific user."""
    try:
        # Sort by newest first
        cursor = notes_collection.find({"clerk_id": clerk_id}).sort("created_at", -1)

        notes_list = []
        for doc in cursor:
            # CRITICAL FIX: Convert MongoDB's _id to a string 'id' for React
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            notes_list.append(doc)

        return notes_list

    except Exception as e:
        print(f"🚨 MongoDB Error (Fetch): {e}")
        return []


def delete_note_from_db(note_id: str):
    """Deletes a specific note. Note ID is now a string instead of an int."""
    try:
        result = notes_collection.delete_one({"_id": ObjectId(note_id)})
        return result.deleted_count > 0

    except Exception as e:
        print(f"🚨 MongoDB Error (Delete): {e}")
        return False
