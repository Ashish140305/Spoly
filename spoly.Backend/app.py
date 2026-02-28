from fastapi import FastAPI
from routes import notes

app = FastAPI()

app.include_router(notes.router)

@app.get("/")
def home():
    return {"message": "Spoly Notes Backend Running"}