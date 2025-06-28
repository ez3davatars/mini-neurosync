import openai
import soundfile as sf
import io
import uuid
import os
from config import OPENAI_API_KEY, TTS_OUTPUT_DIR, AUDIO_SAMPLE_RATE

openai.api_key = OPENAI_API_KEY

async def tts_openai(text: str) -> str:
    """Generate speech using OpenAI TTS"""
    try:
        response = await openai.Audio.speech.acreate(
            model="tts-1",
            voice="nova",
            input=text,
            response_format="wav"
        )
        
        # Generate unique filename
        filename = f"openai_{uuid.uuid4().hex[:8]}.wav"
        filepath = os.path.join(TTS_OUTPUT_DIR, filename)
        
        # Save audio data
        audio_data = response.content
        
        # Convert to proper WAV format for lip sync plugin
        audio_array, original_rate = sf.read(io.BytesIO(audio_data))
        sf.write(filepath, audio_array, original_rate, subtype='PCM_16')
        
        return filepath
        
    except Exception as e:
        print(f"OpenAI TTS Error: {e}")
        raise Exception(f"TTS generation failed: {e}")