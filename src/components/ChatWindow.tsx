import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  emotion?: string;
  audio_url?: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatWindow({ messages, onSend, loading }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-lg">Start a conversation with your AI companion</p>
            <p className="text-sm mt-2 opacity-75">Choose your preferred LLM and TTS engine above</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} {...message} />
          ))
        )}
        {loading && (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Generating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-purple-500/20">
        <form onSubmit={handleSend} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}