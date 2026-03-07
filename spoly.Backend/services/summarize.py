from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

tokenizer = None
model = None


def load_model():
    global tokenizer, model

    if tokenizer is None:

        tokenizer = T5Tokenizer.from_pretrained("training/model")
        model = T5ForConditionalGeneration.from_pretrained("training/model")


def generate_notes(text):

    load_model()

    prompt = "Convert this lecture text into structured notes and mermaid diagram:\n" + text

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=300
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)