from fastapi import APIRouter, UploadFile, File, Form
from services.pipeline import run_pipeline
from services.speech import speech_to_text
import re
import asyncio  # 🚀 NEW: Import asyncio to prevent server blocking

router = APIRouter()

@router.post("/generate")
async def generate_notes(
    file: UploadFile = File(...), 
    template: str = Form("Standard Study Notes")
):
    try:
        is_chunk = file.filename == "chunk.webm"
        audio_bytes = await file.read()

        print(f"\n📥 [API HIT] Received {'Chunk' if is_chunk else 'Final'} Audio | Size: {len(audio_bytes)} bytes", flush=True)

        if len(audio_bytes) < 100:
            return {"transcript": "", "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}

        # 🚀 FIX 1: Offload Whisper to a background thread.
        # This prevents the backend from freezing when chunks arrive back-to-back.
        text = await asyncio.to_thread(speech_to_text, audio_bytes)

        if not text or len(text.strip()) < 5:
            return {"transcript": text, "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}

        if is_chunk:
            from services.summarize import generate_notes as fast_summary
            notes = ""
            try:
                # This is just string manipulation, fast enough to run directly
                notes = fast_summary(text)
            except Exception:
                pass 
            
            return {"transcript": text, "notes": notes, "diagram": '{"diagrams": [], "flashcards": []}'}

        print("🚀 Processing FINAL complete audio file...", flush=True)
        
        # 🚀 FIX 2: Offload the pipeline to a background thread.
        # Without this, the `time.sleep(6)` inside your pipeline freezes the ENTIRE server!
        result = await asyncio.to_thread(run_pipeline, text, template)
        
        result["transcript"] = text
        return result

    except Exception as e:
        print("🚨 GENERATE API ERROR:", e, flush=True)
        return {"error": str(e), "transcript": "", "notes": "", "diagram": '{"diagrams": [], "flashcards": []}'}


@router.post("/youtube")
async def generate_from_youtube(
    url: str = Form(...),
    template: str = Form("Standard Study Notes")
):
    try:
        video_id = ""
        match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
        if match:
            video_id = match.group(1)
        
        if not video_id:
            return {"error": "Invalid YouTube URL format.", "transcript": "", "notes": "", "diagram": "API FAILED"}

        text = ""
        
        try:
            from youtube_transcript_api import YouTubeTranscriptApi
            ytt_api = YouTubeTranscriptApi()
            
            # Offloading network fetch to prevent blocking
            fetched_transcript = await asyncio.to_thread(ytt_api.fetch, video_id)
            transcript_list = fetched_transcript.to_raw_data()
            text = " ".join([chunk['text'] for chunk in transcript_list])
        except Exception as e:
            raise Exception(f"Transcript Fetch Failed: {str(e)}")
        
        if not text:
            raise Exception("Could not fetch transcript")

        print(f"🗣️ YT TRANSCRIBED ({len(text)} chars)", flush=True)
        
        # Offload the pipeline here as well
        result = await asyncio.to_thread(run_pipeline, text, template)
        result["transcript"] = text
        return result

    except Exception as e:
        print("🚨 YT Error:", e, flush=True)
        return {"error": str(e), "transcript": "", "notes": f"Failed to fetch YouTube transcript: {str(e)}", "diagram": 'API FAILED'}