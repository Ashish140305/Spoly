# # from fastapi import APIRouter, UploadFile, File, Form
# # from pydantic import BaseModel
# # from utils.db import save_note_to_db, get_notes_from_db, delete_note_from_db
# # from services.pipeline import run_pipeline
# # from services.speech import speech_to_text
# # import re
# # import asyncio  # 🚀 NEW: Import asyncio to prevent server blocking

# # router = APIRouter()


# # @router.post("/generate")
# # async def generate_notes(
# #     file: UploadFile = File(...), template: str = Form("Standard Study Notes")
# # ):
# #     try:
# #         is_chunk = file.filename == "chunk.webm"
# #         audio_bytes = await file.read()

# #         print(
# #             f"\n📥 [API HIT] Received {'Chunk' if is_chunk else 'Final'} Audio | Size: {len(audio_bytes)} bytes",
# #             flush=True,
# #         )

# #         if len(audio_bytes) < 100:
# #             return {
# #                 "transcript": "",
# #                 "notes": "",
# #                 "diagram": '{"diagrams": [], "flashcards": []}',
# #             }

# #         # 🚀 FIX 1: Offload Whisper to a background thread.
# #         # This prevents the backend from freezing when chunks arrive back-to-back.
# #         text = await asyncio.to_thread(speech_to_text, audio_bytes, file.filename)

# #         if not text or len(text.strip()) < 5:
# #             return {
# #                 "transcript": text,
# #                 "notes": "",
# #                 "diagram": '{"diagrams": [], "flashcards": []}',
# #             }

# #         if is_chunk:
# #             from services.summarize import generate_notes as fast_summary

# #             notes = ""
# #             try:
# #                 # This is just string manipulation, fast enough to run directly
# #                 notes = fast_summary(text)
# #             except Exception:
# #                 pass

# #             return {
# #                 "transcript": text,
# #                 "notes": notes,
# #                 "diagram": '{"diagrams": [], "flashcards": []}',
# #             }

# #         print("🚀 Processing FINAL complete audio file...", flush=True)

# #         # 🚀 FIX 2: Offload the pipeline to a background thread.
# #         # Without this, the `time.sleep(6)` inside your pipeline freezes the ENTIRE server!
# #         result = await asyncio.to_thread(run_pipeline, text, template)

# #         result["transcript"] = text
# #         return result

# #     except Exception as e:
# #         print("🚨 GENERATE API ERROR:", e, flush=True)
# #         return {
# #             "error": str(e),
# #             "transcript": "",
# #             "notes": "",
# #             "diagram": '{"diagrams": [], "flashcards": []}',
# #         }


# # @router.post("/process-text")
# # async def process_raw_text(
# #     transcript: str = Form(...), template: str = Form("Standard Study Notes")
# # ):
# #     try:
# #         if not transcript or len(transcript.strip()) < 10:
# #             raise Exception("Transcript is too short or empty.")

# #         print(
# #             f"🧠 Processing Raw Text via Extension Hack ({len(transcript)} chars)",
# #             flush=True,
# #         )

# #         # Skip audio/YouTube fetching entirely, just run the AI pipeline!
# #         result = await asyncio.to_thread(run_pipeline, transcript, template)
# #         result["transcript"] = transcript
# #         return result

# #     except Exception as e:
# #         print("🚨 Text Processing Error:", e, flush=True)
# #         return {
# #             "error": str(e),
# #             "transcript": transcript,
# #             "notes": f"Failed to process text: {str(e)}",
# #             "diagram": "API FAILED",
# #         }


# # @router.post("/youtube")
# # async def generate_from_youtube(
# #     url: str = Form(...), template: str = Form("Standard Study Notes")
# # ):
# #     try:
# #         video_id = ""
# #         match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
# #         if match:
# #             video_id = match.group(1)

# #         if not video_id:
# #             return {
# #                 "error": "Invalid YouTube URL format.",
# #                 "transcript": "",
# #                 "notes": "",
# #                 "diagram": "API FAILED",
# #             }

# #         text = ""

# #         try:
# #             from youtube_transcript_api import YouTubeTranscriptApi

# #             ytt_api = YouTubeTranscriptApi()

# #             # Offloading network fetch to prevent blocking
# #             fetched_transcript = await asyncio.to_thread(ytt_api.fetch, video_id)
# #             transcript_list = fetched_transcript.to_raw_data()
# #             text = " ".join([chunk["text"] for chunk in transcript_list])
# #         except Exception as e:
# #             raise Exception(f"Transcript Fetch Failed: {str(e)}")

# #         if not text:
# #             raise Exception("Could not fetch transcript")

# #         print(f"🗣️ YT TRANSCRIBED ({len(text)} chars)", flush=True)

# #         # Offload the pipeline here as well
# #         result = await asyncio.to_thread(run_pipeline, text, template)
# #         result["transcript"] = text
# #         return result

# #     except Exception as e:
# #         print("🚨 YT Error:", e, flush=True)
# #         return {
# #             "error": str(e),
# #             "transcript": "",
# #             "notes": f"Failed to fetch YouTube transcript: {str(e)}",
# #             "diagram": "API FAILED",
# #         }


# # # Create a data model for what the React app will send us
# # class SaveNoteRequest(BaseModel):
# #     clerk_id: str
# #     source_type: str
# #     transcript: str
# #     notes: str
# #     diagram_data: str


# # @router.post("/save")
# # def save_note(req: SaveNoteRequest):
# #     try:
# #         success = save_note_to_db(
# #             req.clerk_id, req.source_type, req.transcript, req.notes, req.diagram_data
# #         )
# #         if success:
# #             return {"success": True, "message": "Saved to MongoDB"}
# #         return {"error": "Database insert failed"}
# #     except Exception as e:
# #         return {"error": str(e)}


# # @router.get("/user/{clerk_id}")
# # def get_user_notes(clerk_id: str):
# #     try:
# #         notes = get_notes_from_db(clerk_id)
# #         return {"success": True, "notes": notes}
# #     except Exception as e:
# #         return {"error": str(e)}


# # @router.delete("/{note_id}")
# # def delete_note(note_id: str):
# #     success = delete_note_from_db(note_id)
# #     return {"success": success}

# from fastapi import APIRouter, UploadFile, File, Form
# from pydantic import BaseModel
# import re
# import asyncio
# import PyPDF2
# import io
# from typing import List, Optional
# from services.pipeline import run_pipeline
# from services.speech import speech_to_text
# from utils.db import save_note_to_db, get_notes_from_db, delete_note_from_db

# router = APIRouter()


# # 🟢 ADD THIS HELPER FUNCTION
# async def extract_context_text(files: Optional[List[UploadFile]]) -> str:
#     if not files:
#         return ""

#     context_text = ""
#     for file in files:
#         content = await file.read()
#         if file.filename.lower().endswith(".pdf"):
#             try:
#                 reader = PyPDF2.PdfReader(io.BytesIO(content))
#                 for page in reader.pages:
#                     page_text = page.extract_text()
#                     if page_text:
#                         context_text += page_text + "\n"
#             except Exception as e:
#                 print(f"Error parsing PDF {file.filename}: {e}")
#         else:
#             try:
#                 context_text += content.decode("utf-8") + "\n"
#             except Exception as e:
#                 print(f"Error decoding {file.filename}: {e}")

#     return context_text


# # Create a data model for what the React app will send us for MongoDB
# class SaveNoteRequest(BaseModel):
#     clerk_id: str
#     source_type: str
#     transcript: str
#     notes: str
#     diagram_data: str


# @router.post("/generate")
# async def generate_notes(
#     file: UploadFile = File(...),
#     template: str = Form("Standard Study Notes"),
#     context_files: Optional[List[UploadFile]] = File(None),  # 🟢 ADD THIS
# ):
#     try:
#         is_chunk = file.filename == "chunk.webm"
#         audio_bytes = await file.read()

#         print(
#             f"\n📥 [API HIT] Received {'Chunk' if is_chunk else 'Final'} Audio | Size: {len(audio_bytes)} bytes",
#             flush=True,
#         )

#         if len(audio_bytes) < 100:
#             return {
#                 "transcript": "",
#                 "notes": "",
#                 "diagram": '{"diagrams": [], "flashcards": []}',
#             }

#         # Offload Whisper to a background thread to prevent server freezing
#         text = await asyncio.to_thread(speech_to_text, audio_bytes, file.filename)

#         if not text or len(text.strip()) < 5:
#             return {
#                 "transcript": text,
#                 "notes": "",
#                 "diagram": '{"diagrams": [], "flashcards": []}',
#             }

#         if is_chunk:
#             from services.summarize import generate_notes as fast_summary

#             notes = ""
#             try:
#                 # String manipulation is fast enough to run directly
#                 notes = fast_summary(text)
#             except Exception:
#                 pass

#             return {
#                 "transcript": text,
#                 "notes": notes,
#                 "diagram": '{"diagrams": [], "flashcards": []}',
#             }

#         print("🚀 Processing FINAL complete audio file...", flush=True)
#         context_text = await extract_context_text(context_files)

#         # Offload the LLM pipeline to a background thread
#         result = await asyncio.to_thread(run_pipeline, text, template, context_text)
#         result["transcript"] = text
#         return result

#     except Exception as e:
#         print("🚨 GENERATE API ERROR:", e, flush=True)
#         return {
#             "error": str(e),
#             "transcript": "",
#             "notes": "",
#             "diagram": '{"diagrams": [], "flashcards": []}',
#         }


# @router.post("/process-text")
# async def process_raw_text(
#     transcript: str = Form(...), template: str = Form("Standard Study Notes")
# ):
#     try:
#         if not transcript or len(transcript.strip()) < 10:
#             raise Exception("Transcript is too short or empty.")

#         print(
#             f"🧠 Processing Raw Text via Extension Hack ({len(transcript)} chars)",
#             flush=True,
#         )

#         # Skip audio fetching entirely, just run the AI pipeline
#         result = await asyncio.to_thread(run_pipeline, transcript, template)
#         result["transcript"] = transcript
#         return result

#     except Exception as e:
#         print("🚨 Text Processing Error:", e, flush=True)
#         return {
#             "error": str(e),
#             "transcript": transcript,
#             "notes": f"Failed to process text: {str(e)}",
#             "diagram": "API FAILED",
#         }


# @router.post("/youtube")
# async def generate_from_youtube(
#     url: str = Form(...), template: str = Form("Standard Study Notes")
# ):
#     try:
#         video_id = ""
#         match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
#         if match:
#             video_id = match.group(1)

#         if not video_id:
#             return {
#                 "error": "Invalid YouTube URL format.",
#                 "transcript": "",
#                 "notes": "",
#                 "diagram": "API FAILED",
#             }

#         text = ""

#         try:
#             from youtube_transcript_api import YouTubeTranscriptApi

#             def get_translated_transcript(vid_id):
#                 # 1. Get the list of all available transcripts
#                 transcript_list = YouTubeTranscriptApi.list_transcripts(vid_id)

#                 try:
#                     # 2. Try to find standard English first
#                     transcript = transcript_list.find_transcript(
#                         ["en", "en-US", "en-GB"]
#                     )
#                 except:
#                     # 3. FALLBACK: If no English, grab the very first available transcript
#                     # and translate it to English!
#                     for t in transcript_list:
#                         transcript = t.translate("en")
#                         break

#                 # 4. Fetch the actual JSON data
#                 return transcript.fetch()

#             # Offloading network fetch to prevent blocking
#             transcript_data = await asyncio.to_thread(
#                 get_translated_transcript, video_id
#             )

#             # Extract just the text from the JSON array
#             text = " ".join([chunk["text"] for chunk in transcript_data])

#         except Exception as e:
#             raise Exception(f"Transcript Fetch Failed: {str(e)}")

#         if not text:
#             raise Exception("Could not fetch transcript")

#         print(f"🗣️ YT TRANSCRIBED ({len(text)} chars)", flush=True)

#         # Offload the LLM pipeline
#         result = await asyncio.to_thread(run_pipeline, text, template)
#         result["transcript"] = text
#         return result

#     except Exception as e:
#         print("🚨 YT Error:", e, flush=True)
#         return {
#             "error": str(e),
#             "transcript": "",
#             "notes": f"Failed to fetch YouTube transcript: {str(e)}",
#             "diagram": "API FAILED",
#         }


# # ---------------- MONGODB DATABASE ROUTES ----------------


# @router.post("/save")
# def save_note(req: SaveNoteRequest):
#     try:
#         success = save_note_to_db(
#             req.clerk_id, req.source_type, req.transcript, req.notes, req.diagram_data
#         )
#         if success:
#             return {"success": True, "message": "Saved to MongoDB"}
#         return {"error": "Database insert failed"}
#     except Exception as e:
#         return {"error": str(e)}


# @router.get("/user/{clerk_id}")
# def get_user_notes(clerk_id: str):
#     try:
#         notes = get_notes_from_db(clerk_id)
#         return {"success": True, "notes": notes}
#     except Exception as e:
#         return {"error": str(e)}


# @router.delete("/{note_id}")
# def delete_note(note_id: str):
#     success = delete_note_from_db(note_id)
#     return {"success": success}


from fastapi import APIRouter
from pymongo import MongoClient, ASCENDING, DESCENDING
from bson.objectid import ObjectId
from datetime import datetime, timezone
from utils.config import MONGO_URI, MONGO_DB_NAME

router = APIRouter()

# Initialize MongoDB Connection
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client[MONGO_DB_NAME]
    notes_collection = db["notes"]

    # 🟢 LOGICAL UPGRADE: Create an index for lightning-fast querying
    # This ensures searching by clerk_id and sorting by date takes milliseconds
    notes_collection.create_index([("clerk_id", ASCENDING), ("created_at", DESCENDING)])
    print("✅ MongoDB Connected and Indexed Successfully.")
except Exception as e:
    print(f"🚨 CRITICAL: Failed to connect to MongoDB: {e}")


def save_note_to_db(
    clerk_id: str, source_type: str, transcript: str, notes: str, diagram: str
):
    """Saves generated notes as a MongoDB Document with validation."""
    if not clerk_id:
        print("🚨 Error: Missing Clerk ID")
        return False

    try:
        note_doc = {
            "clerk_id": clerk_id,
            "source_type": source_type or "Untitled Note",
            "original_transcript": transcript or "",
            "generated_notes": notes or "",
            "diagram_data": diagram or '{"diagrams":[],"flashcards":[]}',
            "created_at": datetime.now(timezone.utc),
        }
        notes_collection.insert_one(note_doc)
        return True

    except Exception as e:
        print(f"🚨 MongoDB Error (Save): {e}")
        return False


def get_notes_from_db(clerk_id: str):
    """Fetches all saved notes for a specific user with backwards compatibility."""
    if not clerk_id:
        return []

    try:
        # Sort by newest first
        cursor = notes_collection.find({"clerk_id": clerk_id}).sort("created_at", -1)

        notes_list = []
        for doc in cursor:
            # Convert MongoDB's _id to a string 'id' for React
            doc["id"] = str(doc["_id"])
            del doc["_id"]

            # 🟢 LOGICAL UPGRADE: Safe fallbacks in case older DB records are missing fields
            doc["source_type"] = doc.get("source_type", "Untitled Note")
            doc["original_transcript"] = doc.get("original_transcript", "")
            doc["generated_notes"] = doc.get("generated_notes", "")
            doc["diagram_data"] = doc.get(
                "diagram_data", '{"diagrams":[],"flashcards":[]}'
            )

            notes_list.append(doc)

        return notes_list

    except Exception as e:
        print(f"🚨 MongoDB Error (Fetch): {e}")
        return []


def delete_note_from_db(note_id: str):
    """Deletes a specific note with strict ID validation."""
    try:
        # 🟢 LOGICAL UPGRADE: Prevent crashes if an invalid string is passed
        if not ObjectId.is_valid(note_id):
            print(f"🚨 Invalid Note ID format: {note_id}")
            return False

        result = notes_collection.delete_one({"_id": ObjectId(note_id)})
        return result.deleted_count > 0

    except Exception as e:
        print(f"🚨 MongoDB Error (Delete): {e}")
        return False


# ---------------- FASTAPI ROUTE HANDLERS ----------------

from fastapi import UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import re


class SaveNoteRequest(BaseModel):
    clerk_id: str
    source_type: str
    transcript: str
    notes: str
    diagram_data: str


@router.post("/generate")
async def generate_notes(
    file: UploadFile = File(...),
    template: str = Form("Standard Study Notes"),
):
    try:
        from services.speech import speech_to_text
        from services.pipeline import run_pipeline

        is_chunk = file.filename == "chunk.webm"
        audio_bytes = await file.read()

        print(
            f"\n📥 [API HIT] Received {'Chunk' if is_chunk else 'Final'} Audio | Size: {len(audio_bytes)} bytes",
            flush=True,
        )

        if len(audio_bytes) < 100:
            return {
                "transcript": "",
                "notes": "",
                "diagram": '{"diagrams": [], "flashcards": []}',
            }

        text = await asyncio.to_thread(speech_to_text, audio_bytes, file.filename)

        if not text or len(text.strip()) < 5:
            return {
                "transcript": text,
                "notes": "",
                "diagram": '{"diagrams": [], "flashcards": []}',
            }

        if is_chunk:
            from services.summarize import generate_notes as fast_summary
            notes = ""
            try:
                notes = fast_summary(text)
            except Exception:
                pass
            return {
                "transcript": text,
                "notes": notes,
                "diagram": '{"diagrams": [], "flashcards": []}',
            }

        print("🚀 Processing FINAL complete audio file...", flush=True)
        result = await asyncio.to_thread(run_pipeline, text, template)
        result["transcript"] = text
        return result

    except Exception as e:
        print("🚨 GENERATE API ERROR:", e, flush=True)
        return {
            "error": str(e),
            "transcript": "",
            "notes": "",
            "diagram": '{"diagrams": [], "flashcards": []}',
        }


@router.post("/process-text")
async def process_raw_text(
    transcript: str = Form(...), template: str = Form("Standard Study Notes")
):
    try:
        from services.pipeline import run_pipeline

        if not transcript or len(transcript.strip()) < 10:
            raise Exception("Transcript is too short or empty.")

        print(f"🧠 Processing Raw Text ({len(transcript)} chars)", flush=True)
        result = await asyncio.to_thread(run_pipeline, transcript, template)
        result["transcript"] = transcript
        return result

    except Exception as e:
        print("🚨 Text Processing Error:", e, flush=True)
        return {
            "error": str(e),
            "transcript": transcript,
            "notes": f"Failed to process text: {str(e)}",
            "diagram": "API FAILED",
        }


@router.post("/youtube")
async def generate_from_youtube(
    url: str = Form(...), template: str = Form("Standard Study Notes")
):
    try:
        from services.pipeline import run_pipeline

        video_id = ""
        match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        if match:
            video_id = match.group(1)

        if not video_id:
            return {
                "error": "Invalid YouTube URL format.",
                "transcript": "",
                "notes": "",
                "diagram": "API FAILED",
            }

        def get_transcript(vid_id):
            from youtube_transcript_api import YouTubeTranscriptApi
            transcript_list = YouTubeTranscriptApi.list_transcripts(vid_id)
            try:
                transcript = transcript_list.find_transcript(["en", "en-US", "en-GB"])
            except Exception:
                for t in transcript_list:
                    transcript = t.translate("en")
                    break
            return transcript.fetch()

        transcript_data = await asyncio.to_thread(get_transcript, video_id)
        text = " ".join([chunk["text"] for chunk in transcript_data])

        if not text:
            raise Exception("Could not fetch transcript")

        print(f"🗣️ YT TRANSCRIBED ({len(text)} chars)", flush=True)
        result = await asyncio.to_thread(run_pipeline, text, template)
        result["transcript"] = text
        return result

    except Exception as e:
        print("🚨 YT Error:", e, flush=True)
        return {
            "error": str(e),
            "transcript": "",
            "notes": f"Failed to fetch YouTube transcript: {str(e)}",
            "diagram": "API FAILED",
        }


@router.post("/save")
def save_note(req: SaveNoteRequest):
    try:
        success = save_note_to_db(
            req.clerk_id, req.source_type, req.transcript, req.notes, req.diagram_data
        )
        if success:
            return {"success": True, "message": "Saved to MongoDB"}
        return {"error": "Database insert failed"}
    except Exception as e:
        return {"error": str(e)}


@router.get("/user/{clerk_id}")
def get_user_notes(clerk_id: str):
    try:
        notes = get_notes_from_db(clerk_id)
        return {"success": True, "notes": notes}
    except Exception as e:
        return {"error": str(e)}


@router.delete("/{note_id}")
def delete_note(note_id: str):
    success = delete_note_from_db(note_id)
    return {"success": success}
