import whisper
import tempfile
import os

model = whisper.load_model("base")

def speech_to_text(audio_bytes):

    # Step 1: Save bytes to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
        temp_audio.write(audio_bytes)
        temp_path = temp_audio.name

    try:
        # Step 2: Transcribe using file path
        result = model.transcribe(temp_path, language="en")
        return result["text"]

    finally:
        # Step 3: Clean up temp file
        os.remove(temp_path)