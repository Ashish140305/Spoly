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
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CLERK_SECRET = os.getenv("CLERK_SECRET")

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "spoly_db")
