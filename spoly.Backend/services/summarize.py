from transformers import T5Tokenizer, T5ForConditionalGeneration
from peft import PeftModel

model = None
tokenizer = None

def load_model():
    global model, tokenizer

    if model is None:
        tokenizer = T5Tokenizer.from_pretrained("t5-small")

        base_model = T5ForConditionalGeneration.from_pretrained("t5-small")

        model = PeftModel.from_pretrained(
            base_model,
            "training/model"
        )

        model.eval()
def generate_notes(text):

    load_model()

    prompt = "Convert this lecture text into structured notes and mermaid diagram:\n" + text

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=300
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)