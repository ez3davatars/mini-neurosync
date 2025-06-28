import React from 'react';
import { Play, User, Bot } from 'lucide-react';
import EmotionBadge from './EmotionBadge';

interface MessageBubbleProps {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  emotion?: string;
  audio_url?: string;
  timestamp: Date;
}

export default function MessageBubble({ message, sender, emotion, audio_url, timestamp }: MessageBubbleProps) {
  const playAudio = () => {
    if (audio_url) {
      const audio = new Audio(`http://localhost:8000/${audio_url}`);
      audio.play().catch(console.error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-3 max-w-[80%] ${sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          sender === 'user' 
            ? 'bg-gradient-to-br from-cyan-400 to-blue-500' 
            : 'bg-gradient-to-br from-purple-500 to-pink-500'
        }`}>
          {sender === 'user' ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${sender === 'user' ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            sender === 'user'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
              : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
          } backdrop-blur-sm`}>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
            
            {/* Bot message extras */}
            {sender === 'bot' && (
              <div className="flex items-center gap-2 mt-2">
                {emotion && <EmotionBadge emotion={emotion} />}
                {audio_url && (
                  <button
                    onClick={playAudio}
                    className="flex items-center gap-1 px-2 py-1 bg-purple-500/30 rounded-lg text-xs text-purple-200 hover:bg-purple-500/50 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Play Audio
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-gray-500 mt-1 px-2">
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
}