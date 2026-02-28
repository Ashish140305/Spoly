import whisper

model = whisper.load_model("base")  # later you can replace

def speech_to_text(audio_path):
    result = model.transcribe(audio_path)
    return result["text"], result["language"]