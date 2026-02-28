from fastapi import APIRouter, UploadFile, File
import shutil
import os

from services.speech import speech_to_text
from services.translate import translate_to_english
from services.summarize import generate_notes
from services.diagram import generate_mermaid

router = APIRouter()

@router.post("/generate-notes")
async def generate(audio: UploadFile = File(...)):

    file_location = f"temp_{audio.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    transcript, language = speech_to_text(file_location)

    if language != "en":
        transcript = translate_to_english(transcript)

    notes = generate_notes(transcript)
    mermaid = generate_mermaid(notes)

    os.remove(file_location)

    return {
        "transcript": transcript,
        "notes": notes,
        "mermaid": mermaid
    }