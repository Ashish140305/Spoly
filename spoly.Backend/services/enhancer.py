import requests
from utils.config import GROQ_API_KEY

def enhance_notes(notes):
    if not GROQ_API_KEY:
        return None

    # 🚀 The detailed notes prompt
    prompt = f"""
Convert this into highly detailed and comprehensive structured study notes.

FORMAT STRICTLY:

📌 Title

• Definition:
• Key Concepts:
• Properties:
• Applications:
• Important Points:

RULES:
- Bullet points only
- Provide IN-DEPTH explanations for each point
- Do not skip any important details
- Be as comprehensive and educational as possible

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
            timeout=30
        )

        if res.status_code == 200:
            output = res.json()["choices"][0]["message"]["content"]
            if "Definition" in output:
                return output.strip()
        else:
            print("❌ Notes API Error:", res.text[:200])

    except Exception as e:
        print("❌ Notes API ERROR:", e)

    return None


def enhance_diagram(notes):
    from utils.config import GROQ_API_KEY
    import requests

    print("🔑 API KEY loaded for Diagram")
    url = "https://api.groq.com/openai/v1/chat/completions"

    prompt = f"""Convert this into a detailed Mermaid flowchart.

STRICT MERMAID SYNTAX RULES:
1. The FIRST line must be exactly "graph TD"
2. The SECOND line must start your first node. DO NOT put nodes on the same line as "graph TD".
3. NO subgraphs.
4. NO notes.
5. Node IDs MUST NOT contain spaces (e.g., Use KeyConcepts, NOT Key Concepts).
6. Every node and connection MUST be on its own line.
7. Only output raw Mermaid code.

EXAMPLE OF PERFECT OUTPUT:
graph TD
A["Definition"]
KeyConcepts["Key Concepts"]
A --> KeyConcepts

Input Notes:
{notes}
"""

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
            timeout=30
        )
        
        if res.status_code == 200:
            output = res.json()["choices"][0]["message"]["content"]
            return output.strip()
        else:
            print("📥 DIAGRAM ERROR RESPONSE:", res.text[:300])

    except Exception as e:
        print("❌ ERROR:", e)

    return None