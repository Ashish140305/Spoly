from datasets import load_dataset
import json
import os

OUTPUT_PATH = "training/data/dataset.json"

# Number of samples to generate
SAMPLES = 5000

print("Downloading dataset...")

dataset = load_dataset(
    "cnn_dailymail",
    "3.0.0",
    split=f"train[:{SAMPLES}]"
)

data = []

def generate_mermaid(summary):

    sentences = summary.split(".")
    sentences = [s.strip() for s in sentences if s.strip()]

    mermaid = "graph TD\n"

    for i, s in enumerate(sentences):
        mermaid += f"N{i}[{s}]\n"

    for i in range(len(sentences)-1):
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

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f)

print("Dataset created")
print("Total samples:", len(data))
print("Saved to:", OUTPUT_PATH)