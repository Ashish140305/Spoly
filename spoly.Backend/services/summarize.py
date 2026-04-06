from transformers import T5Tokenizer, T5ForConditionalGeneration

tokenizer = None
model = None


def load_model():
    global tokenizer, model
    if tokenizer is None:
        tokenizer = T5Tokenizer.from_pretrained("training/model")
        model = T5ForConditionalGeneration.from_pretrained("training/model")


def generate_notes(text):

    if not text:
        return "No input"

    prompt = f"""
Extract structured notes from this lecture.

Rules:
- Convert into bullet points
- Remove conversational words (like "so", "now", "let's")
- Focus on concepts, definitions, and key ideas
- Make it clean and professional

Text:
{text}
"""

    # TEMP fallback logic (since local model is weak)
    sentences = text.split(".")
    important = []

    for s in sentences:
        s = s.strip()

        # remove filler lines
        if any(x in s.lower() for x in ["so", "now", "let's", "today"]):
            continue

        if len(s) > 20:
            important.append(s)

    notes = "\n".join([f"- {s}" for s in important[:6]])

    return notes if notes else text[:200]


def clean_text(text):
    lines = text.split(". ")
    unique = []
    for line in lines:
        line = line.strip()
        if line and line not in unique:
            unique.append(line)
    return ". ".join(unique)


def basic_notes_fallback(text):
    sentences = text.split(".")[:5]
    return "\n".join([f"- {s.strip()}" for s in sentences if s.strip()])
