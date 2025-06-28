import React from 'react';

interface EmotionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const EMOTION_OPTIONS = [
  { value: '', label: '🤖 Auto Detect' },
  { value: 'happy', label: '😊 Happy' },
  { value: 'sad', label: '😢 Sad' },
  { value: 'angry', label: '😡 Angry' },
  { value: 'neutral', label: '😐 Neutral' },
  { value: 'surprised', label: '😮 Surprised' },
  { value: 'fearful', label: '😱 Fearful' },
  { value: 'disgusted', label: '🤢 Disgusted' },
];

export default function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200"
    >
      {EMOTION_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-900">
          {option.label}
        </option>
      ))}
    </select>
  );
}