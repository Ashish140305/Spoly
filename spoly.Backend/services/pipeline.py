import time
from services.summarize import generate_notes
from services.diagram import generate_diagram_local
from services.enhancer import enhance_notes, enhance_diagram

# 🚀 NEW: Accept the template argument
def run_pipeline(text, template="Standard Study Notes"):

    notes = generate_notes(text)

    # Pass the template to the note enhancer
    improved_notes = enhance_notes(notes, template)
    if improved_notes:
        notes = improved_notes

    print("⏳ Pausing for 6 seconds to bypass Groq's 429 Rate Limit...")
    time.sleep(6)

    # Pass the template to the diagram enhancer
    diagram = enhance_diagram(notes, template)

    if not diagram or diagram == "API FAILED":
        print("⚠️ AI Diagram failed, using safe local fallback.")
        fallback_diagram = generate_diagram_local(text)
        # Wrap fallback in JSON format to match new architecture
        import json
        fallback_json = json.dumps({"diagrams": [{"title": "Fallback Flowchart", "code": fallback_diagram}]})
        return {
            "notes": notes,
            "diagram": fallback_json
        }

    return {
        "notes": notes,
        "diagram": diagram
    }