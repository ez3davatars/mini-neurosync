import React from 'react';
import { Volume2, Mic, Speaker } from 'lucide-react';

interface TTSSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TTS_OPTIONS = [
  { value: 'openai', label: 'OpenAI TTS', icon: Volume2, description: 'High-quality neural voices' },
  { value: 'coqui', label: 'Coqui TTS', icon: Mic, description: 'Open-source synthesis' },
  { value: 'edge', label: 'Microsoft Edge', icon: Speaker, description: 'Fast cloud synthesis' },
  { value: 'elevenlabs', label: 'ElevenLabs', icon: Volume2, description: 'Premium voice cloning' },
];

export default function TTSSelector({ value, onChange }: TTSSelectorProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
    >
      {TTS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-900">
          {option.label}
        </option>
      ))}
    </select>
  );
}