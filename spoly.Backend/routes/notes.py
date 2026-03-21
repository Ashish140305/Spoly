from fastapi import APIRouter, UploadFile, File
from services.pipeline import run_pipeline
from services.speech import speech_to_text

router = APIRouter()

@router.post("/generate")
async def generate_notes(file: UploadFile = File(...)):

    audio_bytes = await file.read()

    text = speech_to_text(audio_bytes)

    print("🗣️ TRANSCRIBED:", text)

    result = run_pipeline(text)

    # 🚀 Add the transcribed text to the result dictionary so the frontend can display it
    result["transcript"] = text

    return result