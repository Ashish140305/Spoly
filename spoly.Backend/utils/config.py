# import os

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")
# CLERK_SECRET = os.getenv("CLERK_SECRET")

# # DB_HOST = os.getenv("DB_HOST")
# # DB_USER = os.getenv("DB_USER")
# # DB_PASSWORD = os.getenv("DB_PASSWORD")
# # DB_NAME = os.getenv("DB_NAME")
# # DB_PORT = os.getenv("DB_PORT")


# MONGO_URI = os.getenv("MONGO_URI")
# MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

import os
from pathlib import Path
from dotenv import load_dotenv

# Always load this backend's own .env file, even when started from the project root.
# Prefer it over a stale MINIMOTH_API_KEY inherited from the Windows environment.
BACKEND_ENV_FILE = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=BACKEND_ENV_FILE, override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CLERK_SECRET = os.getenv("CLERK_SECRET")
MINIMOTH_API_KEY = os.getenv("MINIMOTH_API_KEY")

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "spoly_db")
