import requests
from utils.config import GROQ_API_KEY

def enhance_notes(notes):

    from utils.config import GROQ_API_KEY
    import requests

    if not GROQ_API_KEY:
        return None

    prompt = f"""
Convert this into structured study notes.

FORMAT STRICTLY:

📌 Title

• Definition:
• Key Concepts:
• Properties:
• Applications:
• Important Points:

RULES:
- Bullet points only
- No paragraphs
- No filler text
- Make it concise but informative

Input:
{notes}
"""

    try:
        res = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=15
        )

        if res.status_code == 200:
            output = res.json()["choices"][0]["message"]["content"]

            if "Definition" in output:
                return output.strip()

    except Exception as e:
        print("❌ Notes API ERROR:", e)

    return None

def enhance_diagram(notes):

    from utils.config import GROQ_API_KEY
    import requests

    print("🔑 API KEY:", GROQ_API_KEY)

    url = "https://api.groq.com/openai/v1/chat/completions"

    prompt = f"Convert this into a detailed Mermaid diagram:\n{notes}"

    try:
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
            timeout=15
        )

        print("📥 STATUS:", res.status_code)
        print("📥 RESPONSE:", res.text[:300])

        if res.status_code == 200:
            output = res.json()["choices"][0]["message"]["content"]
            return output.strip()   # ⚠️ RETURN DIRECTLY (no filtering)

    except Exception as e:
        print("❌ ERROR:", e)

    return None