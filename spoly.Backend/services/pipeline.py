from services.summarize import generate_notes
from services.diagram import generate_diagram_local
from services.enhancer import enhance_notes, enhance_diagram


def run_pipeline(text):

    notes = generate_notes(text)

    improved_notes = enhance_notes(notes)
    if improved_notes:
        notes = improved_notes

    diagram = enhance_diagram(notes)

    if not diagram:
        return {
        "notes": notes,
        "diagram": "API FAILED"
    }

    return {
        "notes": notes,
        "diagram": diagram
    }