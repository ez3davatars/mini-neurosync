from transformers import pipeline
import asyncio

# Global emotion classifier (loaded once)
_emotion_classifier = None

async def load_emotion_model():
    """Load emotion classification model"""
    global _emotion_classifier
    
    if _emotion_classifier is None:
        print("Loading emotion classification model...")
        _emotion_classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=1
        )
        print("Emotion model loaded successfully!")

def detect_emotion(text: str) -> str:
    """Detect emotion from text"""
    try:
        # Load model if not already loaded
        if _emotion_classifier is None:
            asyncio.create_task(load_emotion_model())
            return "neutral"  # fallback while loading
        
        emotions = _emotion_classifier(text)
        
        if emotions and len(emotions) > 0:
            emotion_label = emotions[0]['label'].lower()
            
            # Map model emotions to our supported emotions
            emotion_mapping = {
                'joy': 'happy',
                'anger': 'angry',
                'sadness': 'sad',
                'fear': 'fearful',
                'surprise': 'surprised',
                'disgust': 'disgusted',
                'neutral': 'neutral'
            }
            
            return emotion_mapping.get(emotion_label, 'neutral')
        
        return "neutral"
        
    except Exception as e:
        print(f"Emotion detection error: {e}")
        return "neutral"

# Pre-load the model for faster inference
async def initialize_emotion_detector():
    """Initialize emotion detector on startup"""
    await load_emotion_model()