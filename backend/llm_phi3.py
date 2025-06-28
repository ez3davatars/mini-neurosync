import asyncio
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from config import LOCAL_MODEL_CACHE, MAX_TOKENS, TEMPERATURE

# Global model variables (loaded once)
_model = None
_tokenizer = None
_generator = None

async def load_phi3_model():
    """Load Phi-3 Mini model (called once on first use)"""
    global _model, _tokenizer, _generator
    
    if _generator is None:
        print("Loading Phi-3 Mini model...")
        _tokenizer = AutoTokenizer.from_pretrained(
            "microsoft/Phi-3-mini-4k-instruct",
            cache_dir=LOCAL_MODEL_CACHE
        )
        _model = AutoModelForCausalLM.from_pretrained(
            "microsoft/Phi-3-mini-4k-instruct",
            cache_dir=LOCAL_MODEL_CACHE,
            torch_dtype="auto",
            device_map="auto"
        )
        _generator = pipeline(
            "text-generation",
            model=_model,
            tokenizer=_tokenizer,
            torch_dtype="auto",
            device_map="auto"
        )
        print("Phi-3 Mini model loaded successfully!")

async def generate_phi3(prompt: str) -> str:
    """Generate response using local Phi-3 Mini model"""
    try:
        await load_phi3_model()
        
        # Format prompt for Phi-3 instruction format
        formatted_prompt = f"""<|system|>
You are a helpful AI assistant for a Metahuman character. Keep responses conversational and engaging.<|end|>
<|user|>
{prompt}<|end|>
<|assistant|>
"""
        
        # Run generation in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: _generator(
                formatted_prompt,
                max_new_tokens=MAX_TOKENS,
                temperature=TEMPERATURE,
                do_sample=True,
                pad_token_id=_tokenizer.eos_token_id
            )
        )
        
        # Extract only the assistant's response
        generated_text = result[0]['generated_text']
        response = generated_text.split("<|assistant|>")[-1].strip()
        
        return response if response else "I understand, but I'm having trouble formulating a response right now."
        
    except Exception as e:
        print(f"Phi-3 Generation Error: {e}")
        return "I'm experiencing some processing difficulties. Could you try rephrasing your question?"