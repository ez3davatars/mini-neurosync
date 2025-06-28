import os
import asyncio
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

# Import handlers
from llm_openai import generate_openai
from llm_phi3 import generate_phi3
from llm_mistral import generate_mistral
from tts_openai import tts_openai
from tts_coqui import tts_coqui
from tts_edge import tts_edge
from tts_elevenlabs import tts_elevenlabs
from emotion import detect_emotion
from unreal_bridge import send_to_lip_sync
from config import TTS_OUTPUT_DIR, ALLOWED_ORIGINS

# Create output directory
os.makedirs(TTS_OUTPUT_DIR, exist_ok=True)

app = FastAPI(title="Mini-NeuroSync API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static audio files
app.mount("/tts_audio", StaticFiles(directory=TTS_OUTPUT_DIR), name="tts_audio")

class ChatInput(BaseModel):
    message: str
    llm_choice: str  # "openai", "phi3", "mistral"
    tts_choice: str  # "openai", "coqui", "edge", "elevenlabs"
    emotion: Optional[str] = None  # manual emotion override

class ChatResponse(BaseModel):
    text: str
    emotion: str
    audio_url: Optional[str] = None
    response_time: float

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/chat", response_model=ChatResponse)
async def chat(input: ChatInput):
    start_time = datetime.now()
    
    try:
        # 1. Generate LLM response
        if input.llm_choice == "openai":
            reply = await generate_openai(input.message)
        elif input.llm_choice == "mistral":
            reply = await generate_mistral(input.message)
        else:  # default to phi3
            reply = await generate_phi3(input.message)
        
        # 2. Detect or use manual emotion
        emotion = input.emotion if input.emotion else detect_emotion(reply)
        
        # 3. Generate TTS audio
        audio_path = None
        try:
            if input.tts_choice == "openai":
                audio_path = await tts_openai(reply)
            elif input.tts_choice == "coqui":
                audio_path = await tts_coqui(reply)
            elif input.tts_choice == "edge":
                audio_path = await tts_edge(reply)
            elif input.tts_choice == "elevenlabs":
                audio_path = await tts_elevenlabs(reply)
            else:
                audio_path = await tts_openai(reply)  # fallback
        except Exception as e:
            print(f"TTS Error: {e}")
            # Continue without audio
        
        # 4. Send to Unreal Engine (async, don't wait)
        if audio_path:
            asyncio.create_task(send_to_lip_sync(audio_path, reply, emotion))
        
        # 5. Calculate response time
        response_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return ChatResponse(
            text=reply,
            emotion=emotion,
            audio_url=os.path.basename(audio_path) if audio_path else None,
            response_time=round(response_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@app.get("/models")
async def get_available_models():
    return {
        "llm_models": ["openai", "phi3", "mistral"],
        "tts_engines": ["openai", "coqui", "edge", "elevenlabs"],
        "emotions": ["happy", "sad", "angry", "neutral", "surprised", "fearful", "disgusted"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)