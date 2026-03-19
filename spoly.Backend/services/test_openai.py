from openai import OpenAI

client = OpenAI()

res = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say hello"}]
)

print(res.choices[0].message.content)