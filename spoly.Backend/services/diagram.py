def detect_diagram_type(text):
    text = text.lower()

    if "linked list" in text:
        return "linked"
    if "graph" in text or "tree" in text:
        return "graph"
    if "database" in text:
        return "erd"
    if "api" in text or "request" in text:
        return "sequence"
    
    return "flowchart"


def generate_diagram_local(text):

    dtype = detect_diagram_type(text)

    if dtype == "linked":
        return """flowchart LR
Head --> Node1 --> Node2 --> NULL
"""

    elif dtype == "graph":
        return """graph TD
A --> B
A --> C
B --> D
C --> D
"""

    elif dtype == "erd":
        return """erDiagram
USER ||--o{ ORDER : places
ORDER ||--|{ ITEM : contains
"""

    elif dtype == "sequence":
        return """sequenceDiagram
User->>Server: Request
Server-->>User: Response
"""

    else:
        return """flowchart TD
Start --> Step1 --> Step2 --> End
"""