import time
import json
from services.summarize import generate_notes
from services.diagram import generate_diagram_local
from services.enhancer import enhance_notes, enhance_diagram


def run_pipeline(text, template="Standard Study Notes", context_text=""):

    notes = generate_notes(text)

    # Pass the template to the note enhancer
    improved_notes = enhance_notes(notes, template, context_text)
    if improved_notes:
        notes = improved_notes

    print("⏳ Pausing for 6 seconds to bypass Groq's 429 Rate Limit...")
    time.sleep(6)

    # Pass the template to the diagram enhancer
    diagram_json_string = enhance_diagram(notes, template)

    # Safely parse the AI output
    try:
        parsed_data = json.loads(diagram_json_string)

        # 🟢 CRITICAL FIX: Extract the arrays
        graphs = parsed_data.get("diagrams", [])
        flashcards = parsed_data.get("flashcards", [])

    except Exception as e:
        print("⚠️ AI JSON Parse Error:", e)
        # Safe local fallback if the AI hallucinates bad JSON
        graphs = [{"title": "Fallback Flowchart", "code": generate_diagram_local(text)}]
        flashcards = []

    # 🟢 CRITICAL FIX: Send the exact keys your React frontend is looking for
    return {
        "notes": notes,
        "graphs": graphs,  # NoteDetailView.jsx strictly requires this key!
        "flashcards": flashcards,  # NoteDetailView.jsx strictly requires this key!
        # We keep this for backwards compatibility just in case
        "diagram": diagram_json_string,
    }
