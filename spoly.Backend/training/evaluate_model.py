import json
import evaluate
from transformers import T5Tokenizer, T5ForConditionalGeneration
from peft import PeftModel

# Load ROUGE
rouge = evaluate.load("rouge")

# Load model
tokenizer = T5Tokenizer.from_pretrained("t5-small")
base_model = T5ForConditionalGeneration.from_pretrained("t5-small")

model = PeftModel.from_pretrained(
    base_model,
    "training/model"
)

model.eval()


def summarize(text):

    inputs = tokenizer(
        "summarize: " + text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )

    output = model.generate(
        **inputs,
        max_length=150,
        num_beams=4
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)


# Load test dataset
with open("training/data/test.json") as f:
    dataset = json.load(f)

predictions = []
references = []

for item in dataset:

    transcript = item["transcript"]
    reference = item["notes"]

    pred = summarize(transcript)

    predictions.append(pred)
    references.append(reference)

scores = rouge.compute(
    predictions=predictions,
    references=references
)

print(scores)