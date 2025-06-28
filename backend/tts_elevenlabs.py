import requests
import uuid
import os
from config import ELEVENLABS_API_KEY, TTS_OUTPUT_DIR

async def tts_elevenlabs(text: str) -> str:
    """Generate speech using ElevenLabs TTS"""
    try:
        filename = f"elevenlabs_{uuid.uuid4().hex[:8]}.wav"
        filepath = os.path.join(TTS_OUTPUT_DIR, filename)
        
        # ElevenLabs API call (requires API key)
        if ELEVENLABS_API_KEY == "your-elevenlabs-api-key-here":
            raise Exception("ElevenLabs API key not configured")
        
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            return filepath
        else:
            raise Exception(f"ElevenLabs API error: {response.status_code}")
            
    except Exception as e:
        print(f"ElevenLabs TTS Error: {e}")
        # Fallback to placeholder
        import wave
        import numpy as np
        
        sample_rate = 22050
        duration = len(text) * 0.1
        samples = np.zeros(int(sample_rate * duration), dtype=np.int16)
        
        with wave.open(filepath, 'w') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(samples.tobytes())
        
        return filepath