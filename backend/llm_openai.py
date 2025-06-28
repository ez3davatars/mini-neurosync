import openai
from config import OPENAI_API_KEY, MAX_TOKENS, TEMPERATURE

openai.api_key = OPENAI_API_KEY

async def generate_openai(prompt: str) -> str:
    """Generate response using OpenAI GPT-4"""
    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a Metahuman character. Keep responses conversational and engaging."},
                {"role": "user", "content": prompt}
            ],
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return "I'm sorry, I'm having trouble connecting to my cloud brain right now. Please try again."