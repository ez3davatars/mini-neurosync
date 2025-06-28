import requests
import base64
import asyncio
from config import UNREAL_LIPSYNC_URL

async def send_to_lip_sync(audio_path: str, text: str, emotion: str = "neutral") -> bool:
    """Send audio and text to Unreal Engine Runtime Metahuman Lip Sync plugin"""
    try:
        # Read audio file and encode to base64
        with open(audio_path, "rb") as audio_file:
            audio_b64 = base64.b64encode(audio_file.read()).decode("utf-8")
        
        payload = {
            "audio": audio_b64,
            "text": text,
            "emotion": emotion,
            "timestamp": asyncio.get_event_loop().time()
        }
        
        # Send POST request to Unreal plugin
        response = requests.post(
            UNREAL_LIPSYNC_URL,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=5.0  # 5 second timeout
        )
        
        if response.status_code == 200:
            print(f"✅ Successfully sent lip sync data to Unreal Engine")
            return True
        else:
            print(f"⚠️ Unreal Engine returned status: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("⚠️ Could not connect to Unreal Engine - is the Runtime Metahuman Lip Sync plugin running?")
        return False
    except requests.exceptions.Timeout:
        print("⚠️ Timeout connecting to Unreal Engine")
        return False
    except Exception as e:
        print(f"❌ Error sending to Unreal Engine: {e}")
        return False

async def test_unreal_connection() -> bool:
    """Test connection to Unreal Engine plugin"""
    try:
        # Send a simple test payload
        test_payload = {
            "text": "Connection test",
            "emotion": "neutral"
        }
        
        response = requests.post(
            UNREAL_LIPSYNC_URL,
            json=test_payload,
            timeout=3.0
        )
        
        return response.status_code == 200
        
    except:
        return False