import os
import tempfile
from faster_whisper import WhisperModel

# 🚀 FIX: Suppress PyAV (FFmpeg) terminal warnings.
# Live browser audio chunks lack "end of file" tags, which makes PyAV print terminal spam
# even though it successfully extracts the audio. This completely silences it.
try:
    import av
    av.logging.set_level(av.logging.FATAL)
except ImportError:
    pass

model = WhisperModel("base", device="cpu", compute_type="int8")

def speech_to_text(audio_bytes):

    # 🚀 FIX: Save the temp file as .webm, matching what your React frontend actually sends.
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
        temp_audio.write(audio_bytes)
        temp_path = temp_audio.name

    try:
        # Transcribe using faster-whisper
        segments, info = model.transcribe(
            temp_path, 
            language="en", 
            condition_on_previous_text=False
        )
        
        # faster-whisper returns a generator, so we join the text segments
        text = " ".join([segment.text for segment in segments])
        return text

    finally:
        # Clean up temp file
        os.remove(temp_path)