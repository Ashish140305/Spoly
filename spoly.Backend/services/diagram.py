def generate_mermaid(text):
    # simple rule-based starter (you'll improve this later)
    
    lines = text.split(".")
    nodes = []
    
    for i, line in enumerate(lines):
        if line.strip():
            nodes.append(f"N{i}[{line.strip()}]")

    connections = []
    for i in range(len(nodes)-1):
        connections.append(f"N{i} --> N{i+1}")

    mermaid = "graph TD\n"
    mermaid += "\n".join(nodes) + "\n"
    mermaid += "\n".join(connections)

    return mermaid