from datasets import load_dataset
import json
import os

print("Downloading dataset...")

dataset = load_dataset(
    "cnn_dailymail",
    "3.0.0",
    split="train[:500]"
)

data = []

def generate_mermaid(summary):

    sentences = summary.split(".")
    sentences = [s.strip() for s in sentences if s.strip()]

    mermaid = "graph TD\n"

    for i, s in enumerate(sentences):
        mermaid += f"N{i}[{s}]\n"

    for i in range(len(sentences) - 1):
        mermaid += f"N{i} --> N{i+1}\n"

    return mermaid


for item in dataset:

    article = item["article"]
    summary = item["highlights"]

    mermaid = generate_mermaid(summary)

    data.append({
        "input_text": article,
        "notes": summary,
        "mermaid": mermaid
    })

os.makedirs("training/data", exist_ok=True)

with open("training/data/dataset.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Dataset created with", len(data), "samples")