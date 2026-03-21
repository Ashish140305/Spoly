from fastapi import APIRouter, UploadFile, File, Form
from services.pipeline import run_pipeline
from services.speech import speech_to_text

router = APIRouter()

# 🚀 UPDATED: Now extracts the `template` from the incoming form data
@router.post("/generate")
async def generate_notes(
    file: UploadFile = File(...), 
    template: str = Form("Standard Study Notes")
):

    audio_bytes = await file.read()

    text = speech_to_text(audio_bytes)

    print("🗣️ TRANSCRIBED:", text)
    print("📝 TEMPLATE USED:", template)

    # 🚀 Pass the template down to the pipeline
    result = run_pipeline(text, template)

    # Add the transcribed text to the result dictionary so the frontend can display it
    result["transcript"] = text

    return result