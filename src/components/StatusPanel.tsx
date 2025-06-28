import React from 'react';
import { Activity, Zap, Heart, RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';

interface StatusPanelProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
  stats: {
    totalMessages: number;
    avgResponseTime: number;
    emotionsDetected: number;
  };
  onReconnect: () => void;
}

export default function StatusPanel({ connectionStatus, stats, onReconnect }: StatusPanelProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'disconnected': return 'text-red-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-5 h-5" />;
      case 'connecting': return <RefreshCw className="w-5 h-5 animate-spin" />;
      case 'disconnected': return <WifiOff className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          System Status
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Backend</span>
            <div className={`flex items-center gap-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
            </div>
          </div>
          
          {connectionStatus === 'disconnected' && (
            <button
              onClick={onReconnect}
              className="w-full px-3 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg text-red-300 hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-200 text-sm"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Performance
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Messages</span>
            <span className="text-cyan-400 font-semibold">{stats.totalMessages}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Avg Response
            </span>
            <span className="text-purple-400 font-semibold">{stats.avgResponseTime}ms</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Emotions
            </span>
            <span className="text-pink-400 font-semibold">{stats.emotionsDetected}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 text-sm">
            Clear Chat
          </button>
          
          <button className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 text-sm">
            Export Chat
          </button>
        </div>
      </div>
    </div>
  );
}