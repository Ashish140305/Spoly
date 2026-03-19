import json
import torch
from transformers import (
    T5Tokenizer,
    T5ForConditionalGeneration,
    Trainer,
    TrainingArguments
)

MODEL_NAME = "google/flan-t5-small"

print("Loading model...")

tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)

print("Loading dataset...")

with open("training/data/dataset.json") as f:
    data = json.load(f)

inputs = []
targets = []

for item in data:

    prompt = """Extract ONLY important technical concepts from the lecture. Ignore filler speech. Generate concise notes and a Mermaid diagram only if a concept exists.   
    Lecture:
    """
    inp = prompt + item["input_text"]

    out = item["notes"] + "\n<MERMAID>\n" + item["mermaid"]

    inputs.append(inp)
    targets.append(out)

print("Tokenizing...")

encodings = tokenizer(
    inputs,
    padding=True,
    truncation=True,
    max_length=512,
)

labels = tokenizer(
    targets,
    padding=True,
    truncation=True,
    max_length=256,
).input_ids


# Build dataset in dictionary format expected by Trainer
dataset = []

for i in range(len(inputs)):

    dataset.append({
        "input_ids": torch.tensor(encodings["input_ids"][i]),
        "attention_mask": torch.tensor(encodings["attention_mask"][i]),
        "labels": torch.tensor(labels[i])
    })


training_args = TrainingArguments(
    output_dir="training/model",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    logging_steps=10,
    save_steps=100,
    learning_rate=5e-5
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset
)

print("Training started...")

trainer.train()

print("Saving model...")

model.save_pretrained("training/model")
tokenizer.save_pretrained("training/model")

print("Training completed")