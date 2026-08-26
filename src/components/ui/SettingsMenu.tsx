import React from 'react';
import { useStore } from '../../store/useStore';
import { Settings as SettingsIcon, ChevronLeft } from 'lucide-react';

export default function SettingsMenu() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const updateCrosshair = useStore((state) => state.updateCrosshair);

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <SettingsIcon size={32} className="text-cyan-400" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Settings</h2>
          </div>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* General & Graphics */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cyan-400 uppercase border-b border-slate-700 pb-2">General</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Field of View (FOV): {settings.fov}</label>
              <input 
                type="range" min="60" max="120" value={settings.fov}
                onChange={(e) => updateSettings({ fov: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Graphics Quality</label>
              <select 
                value={settings.graphicsQuality}
                onChange={(e) => updateSettings({ graphicsQuality: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 focus:border-cyan-500 focus:outline-none"
              >
                <option value="low">Low (Max FPS)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Bloom + AA)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Show FPS Counter</label>
              <input 
                type="checkbox" checked={settings.showFps}
                onChange={(e) => updateSettings({ showFps: e.target.checked })}
                className="w-5 h-5 accent-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Color</label>
              <input 
                type="color" value={settings.targetColor}
                onChange={(e) => updateSettings({ targetColor: e.target.value })}
                className="w-full h-10 rounded cursor-pointer bg-slate-900 border border-slate-700"
              />
            </div>
          </div>

          {/* Crosshair */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cyan-400 uppercase border-b border-slate-700 pb-2">Crosshair</h3>
            
            <div className="flex justify-center mb-6">
              {/* Mini crosshair preview */}
              <div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded flex items-center justify-center relative">
                <div style={{
                  position: 'absolute',
                  width: settings.crosshair.centerDot ? settings.crosshair.thickness : 0,
                  height: settings.crosshair.centerDot ? settings.crosshair.thickness : 0,
                  backgroundColor: settings.crosshair.color,
                  borderRadius: '50%',
                  boxShadow: settings.crosshair.outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none',
                }} />
                {settings.crosshair.type === 'cross' && (
                  <>
                    <div style={{ position: 'absolute', backgroundColor: settings.crosshair.color, width: settings.crosshair.thickness, height: settings.crosshair.size, top: `calc(50% - ${settings.crosshair.gap + settings.crosshair.size}px)`, left: `calc(50% - ${settings.crosshair.thickness / 2}px)`, boxShadow: settings.crosshair.outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none' }} />
                    <div style={{ position: 'absolute', backgroundColor: settings.crosshair.color, width: settings.crosshair.thickness, height: settings.crosshair.size, bottom: `calc(50% - ${settings.crosshair.gap + settings.crosshair.size}px)`, left: `calc(50% - ${settings.crosshair.thickness / 2}px)`, boxShadow: settings.crosshair.outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none' }} />
                    <div style={{ position: 'absolute', backgroundColor: settings.crosshair.color, width: settings.crosshair.size, height: settings.crosshair.thickness, left: `calc(50% - ${settings.crosshair.gap + settings.crosshair.size}px)`, top: `calc(50% - ${settings.crosshair.thickness / 2}px)`, boxShadow: settings.crosshair.outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none' }} />
                    <div style={{ position: 'absolute', backgroundColor: settings.crosshair.color, width: settings.crosshair.size, height: settings.crosshair.thickness, right: `calc(50% - ${settings.crosshair.gap + settings.crosshair.size}px)`, top: `calc(50% - ${settings.crosshair.thickness / 2}px)`, boxShadow: settings.crosshair.outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none' }} />
                  </>
                )}
                {settings.crosshair.type === 'circle' && (
                  <div style={{ position: 'absolute', borderColor: settings.crosshair.color, borderWidth: settings.crosshair.thickness, width: settings.crosshair.size * 4, height: settings.crosshair.size * 4, borderRadius: '50%', boxShadow: settings.crosshair.outline ? `0 0 0 1px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.8)` : 'none' }} />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select 
                value={settings.crosshair.type}
                onChange={(e) => updateCrosshair({ type: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 focus:border-cyan-500 focus:outline-none"
              >
                <option value="cross">Cross</option>
                <option value="dot">Dot Only</option>
                <option value="circle">Circle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Size: {settings.crosshair.size}</label>
              <input type="range" min="1" max="20" value={settings.crosshair.size} onChange={(e) => updateCrosshair({ size: parseInt(e.target.value) })} className="w-full accent-cyan-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Thickness: {settings.crosshair.thickness}</label>
              <input type="range" min="1" max="10" value={settings.crosshair.thickness} onChange={(e) => updateCrosshair({ thickness: parseInt(e.target.value) })} className="w-full accent-cyan-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gap: {settings.crosshair.gap}</label>
              <input type="range" min="0" max="20" value={settings.crosshair.gap} onChange={(e) => updateCrosshair({ gap: parseInt(e.target.value) })} className="w-full accent-cyan-500" />
            </div>
            
            <div className="flex gap-4">
               <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                <input type="color" value={settings.crosshair.color} onChange={(e) => updateCrosshair({ color: e.target.value })} className="w-full h-10 rounded cursor-pointer bg-slate-900 border border-slate-700" />
               </div>
               <div className="flex-1 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={settings.crosshair.centerDot} onChange={(e) => updateCrosshair({ centerDot: e.target.checked })} className="accent-cyan-500" />
                    <span className="text-sm font-medium text-slate-300">Center Dot</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={settings.crosshair.outline} onChange={(e) => updateCrosshair({ outline: e.target.checked })} className="accent-cyan-500" />
                    <span className="text-sm font-medium text-slate-300">Outline</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
