import React from 'react';

const EMOTION_CONFIG = {
  happy: { emoji: "😊", color: "from-yellow-400 to-orange-400", textColor: "text-yellow-100" },
  sad: { emoji: "😢", color: "from-blue-400 to-indigo-400", textColor: "text-blue-100" },
  angry: { emoji: "😡", color: "from-red-400 to-pink-400", textColor: "text-red-100" },
  neutral: { emoji: "😐", color: "from-gray-400 to-gray-500", textColor: "text-gray-100" },
  surprised: { emoji: "😮", color: "from-purple-400 to-pink-400", textColor: "text-purple-100" },
  fearful: { emoji: "😱", color: "from-indigo-400 to-purple-400", textColor: "text-indigo-100" },
  disgusted: { emoji: "🤢", color: "from-green-400 to-teal-400", textColor: "text-green-100" },
  joy: { emoji: "😄", color: "from-yellow-400 to-orange-400", textColor: "text-yellow-100" },
};

interface EmotionBadgeProps {
  emotion: string;
}

export default function EmotionBadge({ emotion }: EmotionBadgeProps) {
  const config = EMOTION_CONFIG[emotion as keyof typeof EMOTION_CONFIG] || EMOTION_CONFIG.neutral;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${config.color} ${config.textColor} text-xs font-medium`}>
      <span>{config.emoji}</span>
      <span className="capitalize">{emotion}</span>
    </div>
  );
}