from transformers import pipeline

summarizer = pipeline(
    "text2text-generation",
    model="sshleifer/distilbart-cnn-12-6"
)

def generate_notes(text):
    prompt = f"Summarize this into structured notes:\n{text}"
    
    summary = summarizer(
        prompt,
        max_new_tokens=200,
        do_sample=False
    )
    
    return summary[0]["generated_text"]