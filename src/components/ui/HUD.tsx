import React from 'react';
import { useStore } from '../../store/useStore';

export default function HUD() {
  const gameState = useStore((state) => state.gameState);
  const trainingMode = useStore((state) => state.trainingMode);
  const settings = useStore((state) => state.settings);

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between pointer-events-none">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        {/* Left Stats */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl w-64 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
             <span className="text-slate-400 font-bold text-sm uppercase">Score</span>
             <span className="text-2xl font-black text-cyan-400">{Math.floor(gameState.score).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
             <span className="text-slate-400 font-medium text-sm">Accuracy</span>
             <span className="text-white font-bold">{gameState.accuracy.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center mb-1">
             <span className="text-slate-400 font-medium text-sm">Streak</span>
             <span className="text-white font-bold">{gameState.streak}</span>
          </div>
        </div>

        {/* Center Title */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider uppercase italic">
            Flow Aim Lab
          </h2>
          <span className="bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded text-sm font-bold uppercase tracking-widest mt-1">
            {trainingMode}
          </span>
        </div>

        {/* Right Stats */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-xl w-64 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
           <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
             <span className="text-slate-400 font-bold text-sm uppercase">Time</span>
             <span className="text-2xl font-black text-white">
               {Math.floor(gameState.timeRemaining)}s
             </span>
          </div>
          <div className="flex justify-between items-center mb-1">
             <span className="text-slate-400 font-medium text-sm">Hits</span>
             <span className="text-white font-bold">{gameState.targetsHit}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
             <span className="text-slate-400 font-medium text-sm">Misses</span>
             <span className="text-white font-bold">{gameState.targetsMissed}</span>
          </div>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-between items-end">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-xs uppercase block">Sensitivity</span>
            <span className="text-white font-mono text-sm">{settings.dpi} DPI / {settings.mouseSens}</span>
          </div>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-lg flex gap-6">
          <div>
            <span className="text-slate-400 text-xs uppercase block">Controller</span>
            <span className={`font-mono text-sm font-bold ${useStore((state) => state.controllerName) ? 'text-cyan-400' : 'text-slate-500'}`}>
              {useStore((state) => state.controllerName) ? `Connected: ${useStore((state) => state.controllerName)?.substring(0, 15)}...` : 'Not Connected'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-xs uppercase block">Aim Assist</span>
            <span className={`font-mono text-sm font-bold ${settings.aimAssist.mode === 'OFF' ? 'text-slate-500' : 'text-cyan-400'}`}>
              {settings.aimAssist.mode} {settings.aimAssist.mode !== 'OFF' && `(${Math.round(settings.aimAssist.strength * 100)}%)`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Esc to quit hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-mono tracking-widest opacity-50">
        PRESS ESC TO MENU
      </div>
    </div>
  );
}
