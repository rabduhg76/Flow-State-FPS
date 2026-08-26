import React from 'react';
import { useStore } from '../../store/useStore';

export default function CrosshairOverlay() {
  const crosshair = useStore((state) => state.settings.crosshair);
  const currentScreen = useStore((state) => state.currentScreen);

  // Only show crosshair during training
  if (currentScreen !== 'training') return null;

  const { type, size, thickness, gap, opacity, centerDot, color, outline } = crosshair;
  
  const baseStyle: React.CSSProperties = {
    backgroundColor: color,
    opacity: opacity,
    position: 'absolute',
    boxShadow: outline ? '0 0 1px 1px rgba(0,0,0,0.8)' : 'none',
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32 pointer-events-none">
      {centerDot && (
        <div 
          style={{ 
            ...baseStyle, 
            width: thickness, 
            height: thickness, 
            borderRadius: '50%' 
          }} 
        />
      )}

      {type === 'cross' && (
        <>
          {/* Top */}
          <div style={{ ...baseStyle, width: thickness, height: size, top: `calc(50% - ${gap + size}px)`, left: `calc(50% - ${thickness / 2}px)` }} />
          {/* Bottom */}
          <div style={{ ...baseStyle, width: thickness, height: size, bottom: `calc(50% - ${gap + size}px)`, left: `calc(50% - ${thickness / 2}px)` }} />
          {/* Left */}
          <div style={{ ...baseStyle, width: size, height: thickness, left: `calc(50% - ${gap + size}px)`, top: `calc(50% - ${thickness / 2}px)` }} />
          {/* Right */}
          <div style={{ ...baseStyle, width: size, height: thickness, right: `calc(50% - ${gap + size}px)`, top: `calc(50% - ${thickness / 2}px)` }} />
        </>
      )}

      {type === 'circle' && (
        <div 
          style={{ 
            borderColor: color, 
            borderWidth: thickness, 
            width: size * 4, 
            height: size * 4,
            opacity: opacity,
            borderRadius: '50%',
            position: 'absolute',
            boxShadow: outline ? `0 0 0 1px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(0,0,0,0.8)` : 'none'
          }} 
        />
      )}
    </div>
  );
}
