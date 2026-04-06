# import os
# import tempfile
# from faster_whisper import WhisperModel

# # 🚀 FIX: Suppress PyAV (FFmpeg) terminal warnings.
# # Live browser audio chunks lack "end of file" tags, which makes PyAV print terminal spam
# # even though it successfully extracts the audio. This completely silences it.
# try:
#     import av
#     av.logging.set_level(av.logging.FATAL)
# except ImportError:
#     pass

# model = WhisperModel("base", device="cpu", compute_type="int8")

# def speech_to_text(audio_bytes):

#     # 🚀 FIX: Save the temp file as .webm, matching what your React frontend actually sends.
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
#         temp_audio.write(audio_bytes)
#         temp_path = temp_audio.name

#     try:
#         # Transcribe using faster-whisper
#         segments, info = model.transcribe(
#             temp_path,
#             language="en",
#             condition_on_previous_text=False
#         )

#         # faster-whisper returns a generator, so we join the text segments
#         text = " ".join([segment.text for segment in segments])
#         return text

#     finally:
#         # Clean up temp file
#         os.remove(temp_path)

import os
import tempfile
from faster_whisper import WhisperModel

# Suppress FFmpeg terminal spam
try:
    import av

    av.logging.set_level(av.logging.FATAL)
except ImportError:
    pass

# 🚀 SPEED FIX 1: Set cpu_threads to use more of your processor (e.g., 4 or 8)
# NOTE: If you have an NVIDIA GPU, change device="cpu" to device="cuda" for instant transcriptions.
model = WhisperModel("base", device="cpu", compute_type="int8", cpu_threads=4)


def speech_to_text(audio_bytes, filename="audio.webm"):
    # 🚀 FIX: Dynamically grab the file extension (.mp3, .webm, .wav, etc.)
    _, ext = os.path.splitext(filename)
    if not ext:
        ext = ".webm"  # Fallback

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_path = temp_audio.name

    try:
        # Transcribe using faster-whisper
        segments, info = model.transcribe(
            temp_path,
            language="en",
            condition_on_previous_text=False,
            # 🚀 SPEED FIX 2: Greedy decoding (much faster than default beam_size=5)
            beam_size=1,
            # 🚀 SPEED FIX 3: Skip silence so the AI doesn't waste time processing dead air
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=500),
        )

        text = " ".join([segment.text for segment in segments])
        return text

    finally:
        os.remove(temp_path)
