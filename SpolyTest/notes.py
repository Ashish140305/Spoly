from fastapi import APIRouter, UploadFile, File, Form
from services.pipeline import run_pipeline
from services.speech import speech_to_text
import re
import asyncio
from utils.db import save_note_to_db, get_notes_from_db, delete_note_from_db

router = APIRouter()

@router.post("/generate")
async def generate_notes(
    file: UploadFile = File(...), 
    template: str = Form("Standard Study Notes"),
    clerk_id: str = Form(...)
):
    try:
        is_chunk = file.filename == "chunk.webm"
        audio_bytes = await file.read()

        if len(audio_bytes) < 100:
            return {"transcript": "", "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}

        text = await asyncio.to_thread(speech_to_text, audio_bytes)

        if not text or len(text.strip()) < 5:
            return {"transcript": text, "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}

        if is_chunk:
            from services.summarize import generate_notes as fast_summary
            notes = fast_summary(text) if text else ""
            return {"transcript": text, "notes": notes, "diagram": '{"diagrams": [], "flashcards": []}'}
        
        result = await asyncio.to_thread(run_pipeline, text, template)
        result["transcript"] = text

        save_note_to_db(
            clerk_id=clerk_id,
            source_type="audio",
            transcript=text,
            notes=result.get("notes", ""),
            diagram=result.get("diagram", '{"diagrams": [], "flashcards": []}')
        )

        return result

    except Exception as e:
        print("API ERROR:", e, flush=True)
        return {"error": str(e), "transcript": "", "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}


@router.post("/youtube")
async def generate_from_youtube(
    url: str = Form(...),
    template: str = Form("Standard Study Notes"),
    clerk_id: str = Form(...) 
):
    try:
        video_id = ""
        match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        if match:
            video_id = match.group(1)
        
        if not video_id:
            return {"error": "Invalid YouTube URL format."}

        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            ytt_api = YouTubeTranscriptApi()
            fetched_transcript = await asyncio.to_thread(ytt_api.fetch, video_id)
            text = " ".join([chunk['text'] for chunk in fetched_transcript.to_raw_data()])
        except Exception as e:
            raise Exception(f"Transcript Fetch Failed: {str(e)}")
        
        result = await asyncio.to_thread(run_pipeline, text, template)
        result["transcript"] = text

        save_note_to_db(
            clerk_id=clerk_id,
            source_type="youtube",
            transcript=text,
            notes=result.get("notes", ""),
            diagram=result.get("diagram", '{"diagrams": [], "flashcards": []}')
        )

        return result

    except Exception as e:
        return {"error": str(e)}


@router.get("/library/{clerk_id}")
async def get_user_library(clerk_id: str):
    """API endpoint to fetch a user's entire library of saved notes."""
    try:
        notes = get_notes_from_db(clerk_id)
        return {"success": True, "notes": notes}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/library/{note_id}")
async def delete_note(note_id: int):
    """API endpoint to delete a specific note."""
    try:
        success = delete_note_from_db(note_id)
        return {"success": success}
    except Exception as e:
        return {"success": False, "error": str(e)}