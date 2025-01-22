import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Google Search API Key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
