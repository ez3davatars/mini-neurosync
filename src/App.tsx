import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Mic, Volume2, Settings, Power } from 'lucide-react';
import ChatWindow from './components/ChatWindow';
import ModelSelector from './components/ModelSelector';
import TTSSelector from './components/TTSSelector';
import EmotionSelector from './components/EmotionSelector';
import StatusPanel from './components/StatusPanel';
import { sendMessage } from './api/api';
import './styles/NeonStyles.css';

interface Message {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  emotion?: string;
  audio_url?: string;
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [llmChoice, setLLMChoice] = useState("phi3");
  const [ttsChoice, setTTSChoice] = useState("openai");
  const [emotionOverride, setEmotionOverride] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [stats, setStats] = useState({
    totalMessages: 0,
    avgResponseTime: 0,
    emotionsDetected: 0
  });

  useEffect(() => {
    // Check backend connection on mount
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('connecting');
    try {
      const response = await fetch('http://localhost:8000/health');
      setConnectionStatus(response.ok ? 'connected' : 'disconnected');
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  const handleSend = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      message: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    const startTime = Date.now();
    
    try {
      const res = await sendMessage({
        message: input,
        llm_choice: llmChoice,
        tts_choice: ttsChoice,
        emotion: emotionOverride
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: res.text,
        sender: 'bot',
        emotion: res.emotion,
        audio_url: res.audio_url,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Update stats
      const responseTime = Date.now() - startTime;
      setStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        avgResponseTime: Math.round((prev.avgResponseTime * prev.totalMessages + responseTime) / (prev.totalMessages + 1)),
        emotionsDetected: res.emotion !== 'neutral' ? prev.emotionsDetected + 1 : prev.emotionsDetected
      }));

      // Play audio if available
      if (res.audio_url) {
        const audio = new Audio(`http://localhost:8000/${res.audio_url}`);
        audio.play().catch(console.error);
      }
    } catch (e) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: "⚠️ Connection error: Could not reach the backend server",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mini-NeuroSync
            </h1>
            <Cpu className="w-10 h-10 text-purple-400" />
          </div>
          <p className="text-gray-300 text-lg">
            Where Innovation Meets Gaming Excellence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
              {/* Control Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    <Brain className="w-4 h-4" />
                    LLM Model
                  </label>
                  <ModelSelector value={llmChoice} onChange={setLLMChoice} />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-purple-400">
                    <Volume2 className="w-4 h-4" />
                    TTS Engine
                  </label>
                  <TTSSelector value={ttsChoice} onChange={setTTSChoice} />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-pink-400">
                    <Settings className="w-4 h-4" />
                    Emotion Override
                  </label>
                  <EmotionSelector value={emotionOverride} onChange={setEmotionOverride} />
                </div>
              </div>

              {/* Chat Window */}
              <ChatWindow
                messages={messages}
                onSend={handleSend}
                loading={loading}
              />
            </div>
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-1">
            <StatusPanel 
              connectionStatus={connectionStatus}
              stats={stats}
              onReconnect={checkConnection}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p className="text-sm">
            Powered by <span className="text-cyan-400 font-semibold">OpenAI</span>, 
            <span className="text-purple-400 font-semibold"> Phi-3 Mini</span> and 
            <span className="text-pink-400 font-semibold"> Runtime Metahuman Lip Sync</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;