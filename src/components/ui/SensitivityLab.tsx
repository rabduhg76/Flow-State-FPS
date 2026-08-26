import React from 'react';
import { useStore } from '../../store/useStore';
import { MousePointer2, ChevronLeft } from 'lucide-react';

export default function SensitivityLab() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);

  // Approximate calculation, assuming 1 unit of movement = standard yaw calculation in typical FPS
  // Source engine constant is usually 0.022. 
  // 360 / (sens * 0.022 * dpi) = inches/360. * 2.54 for cm
  const calculateCmPer360 = (dpi: number, sens: number) => {
    if (sens === 0 || dpi === 0) return 0;
    const degreesPerDot = sens * 0.022;
    const dotsPer360 = 360 / degreesPerDot;
    const inchesPer360 = dotsPer360 / dpi;
    const cmPer360 = inchesPer360 * 2.54;
    return cmPer360.toFixed(1);
  };

  const cm360 = calculateCmPer360(settings.dpi, settings.mouseSens);

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <MousePointer2 size={32} className="text-cyan-400" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Sensitivity Lab</h2>
          </div>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>

        <div className="space-y-8">
          
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 flex flex-col items-center">
             <span className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Effective Sensitivity</span>
             <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-cyan-400">{cm360}</span>
                <span className="text-xl text-slate-500 font-bold mb-1">cm/360</span>
             </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Mouse DPI</label>
                <span className="text-cyan-400 font-bold">{settings.dpi}</span>
              </div>
              <input 
                type="range" min="400" max="3200" step="50" value={settings.dpi}
                onChange={(e) => updateSettings({ dpi: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <div className="flex gap-2 mt-2">
                 {[400, 800, 1600, 3200].map(d => (
                    <button key={d} onClick={() => updateSettings({ dpi: d })} className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 py-1 rounded transition-colors">
                      {d}
                    </button>
                 ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">In-Game Sensitivity</label>
                <span className="text-cyan-400 font-bold">{settings.mouseSens.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.1" max="20" step="0.1" value={settings.mouseSens}
                onChange={(e) => updateSettings({ mouseSens: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
