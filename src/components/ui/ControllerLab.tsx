import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Gamepad2, ChevronLeft } from 'lucide-react';

export default function ControllerLab() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const controller = useStore((state) => state.settings.controller);
  const updateController = useStore((state) => state.updateController);

  const [connected, setConnected] = useState(false);
  const [gamepadId, setGamepadId] = useState('');
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });

  const requestRef = useRef<number>();

  useEffect(() => {
    const checkGamepads = () => {
      const pads = navigator.getGamepads();
      let found = false;
      for (const pad of pads) {
        if (pad) {
          setConnected(true);
          setGamepadId(pad.id);
          
          let rx = pad.axes[2] || 0;
          let ry = pad.axes[3] || 0;

          // Apply deadzone visually
          if (Math.abs(rx) < controller.deadzone) rx = 0;
          if (Math.abs(ry) < controller.deadzone) ry = 0;

          setStickPos({ x: rx, y: ry });
          found = true;
          break;
        }
      }
      if (!found) {
        setConnected(false);
      }
      requestRef.current = requestAnimationFrame(checkGamepads);
    };

    requestRef.current = requestAnimationFrame(checkGamepads);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [controller.deadzone]);

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <Gamepad2 size={32} className="text-cyan-400" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Controller Lab</h2>
          </div>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>

        <div className="mb-8 p-4 rounded-xl border border-slate-700 flex items-center justify-between bg-slate-900/50">
          <div>
            <span className="block text-sm text-slate-400 uppercase font-bold mb-1">Status</span>
            {connected ? (
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                CONNECTED
              </span>
            ) : (
              <span className="text-red-400 font-bold">DISCONNECTED</span>
            )}
          </div>
          <div className="text-right">
            <span className="block text-sm text-slate-400 uppercase font-bold mb-1">Device</span>
            <span className="text-white text-sm">{connected ? gamepadId : 'Press any button to connect'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Settings */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Horizontal Sensitivity</label>
                <span className="text-cyan-400 font-bold">{controller.horizontalSens}</span>
              </div>
              <input 
                type="range" min="1" max="20" step="1" value={controller.horizontalSens}
                onChange={(e) => updateController({ horizontalSens: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Vertical Sensitivity</label>
                <span className="text-cyan-400 font-bold">{controller.verticalSens}</span>
              </div>
              <input 
                type="range" min="1" max="20" step="1" value={controller.verticalSens}
                onChange={(e) => updateController({ verticalSens: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">Deadzone</label>
                <span className="text-cyan-400 font-bold">{controller.deadzone.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0" max="0.5" step="0.01" value={controller.deadzone}
                onChange={(e) => updateController({ deadzone: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Response Curve</label>
              <select 
                value={controller.responseCurve}
                onChange={(e) => updateController({ responseCurve: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded p-2 focus:border-cyan-500 focus:outline-none"
              >
                <option value="linear">Linear</option>
                <option value="exponential">Exponential (Recommended)</option>
                <option value="dynamic">Dynamic</option>
              </select>
            </div>
          </div>

          {/* Visualizer */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Right Stick Output</h3>
            <div className="relative w-64 h-64 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
              {/* Deadzone visual */}
              <div 
                className="absolute rounded-full border border-red-500/50 bg-red-500/10"
                style={{
                  width: `${controller.deadzone * 100}%`,
                  height: `${controller.deadzone * 100}%`
                }}
              />
              {/* Crosshair lines */}
              <div className="absolute w-full h-[1px] bg-slate-800" />
              <div className="absolute h-full w-[1px] bg-slate-800" />
              
              {/* Stick position */}
              <div 
                className="absolute w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10"
                style={{
                  transform: `translate(${stickPos.x * 128}px, ${stickPos.y * 128}px)`
                }}
              />
            </div>
            <p className="mt-6 text-sm text-slate-500 text-center">Move the right stick to test deadzone and response.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
