export interface ChatMessage {
  message: string;
  llm_choice: string;
  tts_choice: string;
  emotion?: string;
}

export interface ChatResponse {
  text: string;
  emotion: string;
  audio_url?: string;
}

export async function sendMessage(payload: ChatMessage): Promise<ChatResponse> {
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8000/health');
    return response.ok;
  } catch {
    return false;
  }
}