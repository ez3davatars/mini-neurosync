import asyncio
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from config import LOCAL_MODEL_CACHE, MAX_TOKENS, TEMPERATURE

# Global model variables
_model = None
_tokenizer = None
_generator = None

async def load_mistral_model():
    """Load Mistral-7B model (called once on first use)"""
    global _model, _tokenizer, _generator
    
    if _generator is None:
        print("Loading Mistral-7B model...")
        _tokenizer = AutoTokenizer.from_pretrained(
            "mistralai/Mistral-7B-Instruct-v0.2",
            cache_dir=LOCAL_MODEL_CACHE
        )
        _model = AutoModelForCausalLM.from_pretrained(
            "mistralai/Mistral-7B-Instruct-v0.2",
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
        print("Mistral-7B model loaded successfully!")

async def generate_mistral(prompt: str) -> str:
    """Generate response using local Mistral-7B model"""
    try:
        await load_mistral_model()
        
        # Format prompt for Mistral instruction format
        formatted_prompt = f"[INST] You are a helpful AI assistant for a Metahuman character. Keep responses conversational and engaging.\n\n{prompt} [/INST]"
        
        # Run generation in thread pool
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
        
        # Extract response
        generated_text = result[0]['generated_text']
        response = generated_text.split("[/INST]")[-1].strip()
        
        return response if response else "I'm here to help, but I'm having trouble with that request right now."
        
    except Exception as e:
        print(f"Mistral Generation Error: {e}")
        return "I'm experiencing some processing challenges. Please try again with a different approach."