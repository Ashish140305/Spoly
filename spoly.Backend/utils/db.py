import mysql.connector
from utils.config import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

DB_CONFIG = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "port": DB_PORT,
}


def save_note_to_db(
    clerk_id: str, source_type: str, transcript: str, notes: str, diagram: str
):
    """Executes the SQL transaction to save generated notes."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO notes (clerk_id, source_type, original_transcript, generated_notes, diagram_data)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(
            insert_query, (clerk_id, source_type, transcript, notes, diagram)
        )

        conn.commit()
        return True

    except Exception as e:
        print(f"🚨 SQL Error: {e}")
        return False
    finally:
        if "conn" in locals() and conn.is_connected():
            cursor.close()
            conn.close()


def get_notes_from_db(clerk_id: str):
    """Fetches all saved notes for a specific user."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT id, source_type, original_transcript, generated_notes, diagram_data, created_at
            FROM notes
            WHERE clerk_id = %s
            ORDER BY created_at DESC
        """
        cursor.execute(query, (clerk_id,))
        notes = cursor.fetchall()

        return notes

    except Exception as e:
        print(f"🚨 SQL Error fetching notes: {e}")
        return []
    finally:
        if "conn" in locals() and conn.is_connected():
            cursor.close()
            conn.close()


def delete_note_from_db(note_id: int):
    """Deletes a specific note from the database."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cursor.execute("DELETE FROM notes WHERE id = %s", (note_id,))
        conn.commit()

        return True

    except Exception as e:
        print(f"🚨 SQL Error deleting note: {e}")
        return False
    finally:
        if "conn" in locals() and conn.is_connected():
            cursor.close()
            conn.close()
