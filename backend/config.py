import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-openai-api-key-here")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "your-elevenlabs-api-key-here")

# Unreal Engine Integration
UNREAL_LIPSYNC_URL = os.getenv("UNREAL_LIPSYNC_URL", "http://127.0.0.1:5100/lip_sync")

# Model Settings
LOCAL_MODEL_CACHE = os.getenv("LOCAL_MODEL_CACHE", "./models")
TTS_OUTPUT_DIR = os.getenv("TTS_OUTPUT_DIR", "./tts_audio")
AUDIO_SAMPLE_RATE = int(os.getenv("AUDIO_SAMPLE_RATE", "22050"))

# Performance Settings
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "200"))
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.7"))

# CORS Settings
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")