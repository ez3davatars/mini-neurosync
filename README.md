# Mini-NeuroSync

A production-ready AI-powered Metahuman interface with real-time lip synchronization, multiple LLM support, and advanced TTS capabilities.

## Features

**Core Features**:
- Real-time chat interface with AI models (OpenAI GPT-4, Phi-3 Mini, Mistral-7B)
- Multiple TTS engines (OpenAI, Coqui, Microsoft Edge, ElevenLabs)
- Automatic emotion detection with manual override
- Runtime Metahuman Lip Sync integration
- Live performance monitoring and statistics
- Beautiful gaming-inspired neon UI

**Design Elements**:
- Modern gaming aesthetic with neon gradients and animations
- Responsive design for all screen sizes
- Real-time connection status monitoring
- Performance metrics and analytics
- Smooth animations and micro-interactions
- Professional-grade UI components

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key
- Unreal Engine with Runtime Metahuman Lip Sync plugin

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
uvicorn main:app --reload
```

### Unreal Engine Setup
1. Install the Runtime Metahuman Lip Sync plugin from https://docs.georgy.dev/runtime-metahuman-lip-sync
2. Configure the plugin to listen on `http://127.0.0.1:5100/lip_sync`
3. Ensure your Metahuman is properly set up in the scene

## Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your-openai-api-key-here
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
UNREAL_LIPSYNC_URL=http://127.0.0.1:5100/lip_sync
```

### Local LLM Setup
The system automatically downloads and caches models on first use:
- **Phi-3 Mini**: ~3.8GB (recommended for speed)
- **Mistral-7B**: ~13GB (better quality, slower)

## API Reference

### Chat Endpoint
```
POST /chat
{
  "message": "Hello there!",
  "llm_choice": "phi3",
  "tts_choice": "openai",
  "emotion": "happy"  // optional override
}
```

### Health Check
```
GET /health
```

### Available Models
```
GET /models
```

## Architecture

```
Frontend (React + TypeScript)
    ↓
Backend (FastAPI + Python)
    ↓
LLM Processing (OpenAI/Local)
    ↓
Emotion Detection (HuggingFace)
    ↓
TTS Generation (Multiple Engines)
    ↓
Unreal Engine (Runtime Metahuman Lip Sync)
```

## Performance

- **Phi-3 Mini**: ~0.2-0.5s response time (GPU)
- **OpenAI TTS**: ~0.3-0.8s generation time
- **Emotion Detection**: ~0.1s processing time
- **Total latency**: ~1-2s end-to-end

## Extending the System

### Adding New LLM Models
1. Create `backend/llm_newmodel.py`
2. Implement `async def generate_newmodel(prompt: str) -> str`
3. Add to `main.py` routing logic
4. Update frontend `ModelSelector.tsx`

### Adding New TTS Engines
1. Create `backend/tts_newengine.py`
2. Implement `async def tts_newengine(text: str) -> str`
3. Add to `main.py` routing logic
4. Update frontend `TTSSelector.tsx`

## Troubleshooting

### Common Issues
- **Connection Error**: Ensure backend is running on port 8000
- **Model Loading**: First-time model downloads can take several minutes
- **Audio Issues**: Check TTS engine configuration and API keys
- **Unreal Integration**: Verify Runtime Metahuman Lip Sync plugin is active

### Performance Optimization
- Use GPU acceleration for local LLMs
- Enable model quantization for faster inference
- Configure proper audio buffer sizes
- Monitor memory usage with multiple models

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.