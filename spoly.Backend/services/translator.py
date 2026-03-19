import requests
from utils.config import GROQ_API_KEY
def normalize_to_english(text):

    try:
        url = "https://api.groq.com/openai/v1/chat/completions"

        prompt = f"""
Convert this into clean, proper English.

Rules:
- Remove Hindi/Hinglish
- Fix grammar
- Keep meaning same
- Make it clear and structured

Text:
{text}
"""

        res = requests.post(
            url,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=5
        )

        if res.status_code == 200:
            output = res.json()["choices"][0]["message"]["content"]

            if len(output.strip()) > 20:
                return output

    except:
        pass

    return text  # fallback if API fails