import React, { useEffect, useState, useRef } from 'react';

export default function ControllerDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const pollGamepads = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const info = [];
      for (let i = 0; i < pads.length; i++) {
        const pad = pads[i];
        if (pad) {
          info.push({
            id: pad.id,
            index: pad.index,
            mapping: pad.mapping,
            connected: pad.connected,
            buttons: pad.buttons.map((b, idx) => ({ index: idx, pressed: b.pressed, value: b.value })),
            axes: pad.axes.map((a, idx) => ({ index: idx, value: a }))
          });
        }
      }
      setDebugInfo(info);
      animationFrameId = requestAnimationFrame(pollGamepads);
    };
    pollGamepads();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (debugInfo.length === 0) {
    return (
      <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-white p-4 font-mono text-xs max-w-[400px] rounded border border-red-500 overflow-y-auto max-h-[80vh] pointer-events-none">
        <h3 className="text-red-400 font-bold mb-2">DEBUG CONTROLLER</h3>
        <p>No controllers detected.</p>
        <p>Press a button on your controller to wake it up.</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-white p-4 font-mono text-xs max-w-[400px] rounded border border-cyan-500 overflow-y-auto max-h-[80vh] pointer-events-none">
      <h3 className="text-cyan-400 font-bold mb-2">DEBUG CONTROLLER ({debugInfo.length})</h3>
      {debugInfo.map((pad, i) => (
        <div key={i} className="mb-4 border-b border-gray-700 pb-2">
          <div><strong>ID:</strong> {pad.id}</div>
          <div><strong>Index:</strong> {pad.index}</div>
          <div><strong>Mapping:</strong> {pad.mapping}</div>
          <div><strong>Connected:</strong> {pad.connected ? 'Yes' : 'No'}</div>
          <div><strong>Buttons:</strong> {pad.buttons.length}</div>
          <div><strong>Axes:</strong> {pad.axes.length}</div>
          
          <div className="mt-2 text-[10px]">
            <strong>Axes Live:</strong>
            <div className="grid grid-cols-2 gap-1 mt-1">
              {pad.axes.map((a: any) => (
                <div key={a.index} className={Math.abs(a.value) > 0.1 ? 'text-cyan-300' : 'text-gray-500'}>
                  [{a.index}]: {a.value.toFixed(3)}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 text-[10px]">
            <strong>Buttons Live:</strong>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {pad.buttons.map((b: any) => (
                <div key={b.index} className={b.pressed || b.value > 0 ? 'text-cyan-300 bg-cyan-900/50 rounded px-1' : 'text-gray-500'}>
                  [{b.index}]: {b.pressed ? 'ON' : b.value.toFixed(2)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
