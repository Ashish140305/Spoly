import time
from services.summarize import generate_notes
from services.diagram import generate_diagram_local
from services.enhancer import enhance_notes, enhance_diagram

def run_pipeline(text):

    notes = generate_notes(text)

    improved_notes = enhance_notes(notes)
    if improved_notes:
        notes = improved_notes

    # 🚀 FIX: We MUST pause for 6 seconds here! 
    # Otherwise, Groq will throw a "429 Too Many Requests" error and block the diagram.
    print("⏳ Pausing for 6 seconds to bypass Groq's 429 Rate Limit...")
    time.sleep(6)

    diagram = enhance_diagram(notes)

    if not diagram or diagram == "API FAILED":
        print("⚠️ AI Diagram failed, using safe local fallback.")
        fallback_diagram = generate_diagram_local(text)
        return {
            "notes": notes,
            "diagram": fallback_diagram
        }

    return {
        "notes": notes,
        "diagram": diagram
    }