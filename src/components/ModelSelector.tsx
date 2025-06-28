import React from 'react';
import { Brain, Cpu, Globe } from 'lucide-react';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const MODEL_OPTIONS = [
  { value: 'openai', label: 'OpenAI GPT-4', icon: Globe, description: 'Cloud-powered intelligence' },
  { value: 'phi3', label: 'Phi-3 Mini', icon: Cpu, description: 'Local lightning-fast AI' },
  { value: 'mistral', label: 'Mistral-7B', icon: Brain, description: 'Local advanced reasoning' },
];

export default function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
    >
      {MODEL_OPTIONS.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-900">
          {option.label}
        </option>
      ))}
    </select>
  );
}