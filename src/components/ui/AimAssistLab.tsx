import React from 'react';
import { useStore } from '../../store/useStore';
import { Sliders, ChevronLeft } from 'lucide-react';

export default function AimAssistLab() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const aimAssist = useStore((state) => state.settings.aimAssist);
  const updateAimAssist = useStore((state) => state.updateAimAssist);

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <Sliders size={32} className="text-cyan-400" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Aim Assist Lab</h2>
          </div>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Simulation Mode</label>
            <div className="flex gap-4">
              {['OFF', 'TRAINING', 'SIMULATION'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    updateAimAssist({ mode: m as any });
                    if (m === 'TRAINING') updateAimAssist({ strength: 0.35, slowdown: 0.4 });
                    if (m === 'SIMULATION') updateAimAssist({ strength: 0.8, slowdown: 0.7 });
                    if (m === 'OFF') updateAimAssist({ strength: 0, slowdown: 0 });
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    aimAssist.mode === m 
                      ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-2">
              {aimAssist.mode === 'OFF' && "Raw input. No assistance applied."}
              {aimAssist.mode === 'TRAINING' && "Light assistance to help develop stick control."}
              {aimAssist.mode === 'SIMULATION' && "Heavy assistance simulating modern console shooters."}
            </p>
          </div>

          <div className={`space-y-6 ${aimAssist.mode === 'OFF' ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Overall Strength</label>
                <span className="text-cyan-400 font-bold">{Math.round(aimAssist.strength * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" value={aimAssist.strength}
                onChange={(e) => updateAimAssist({ strength: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Slowdown (Friction)</label>
                <span className="text-cyan-400 font-bold">{Math.round(aimAssist.slowdown * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05" value={aimAssist.slowdown}
                onChange={(e) => updateAimAssist({ slowdown: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <p className="text-xs text-slate-500 mt-1">Reduces sensitivity when crosshair is over a target.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
