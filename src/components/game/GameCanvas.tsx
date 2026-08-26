import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useStore } from '../../store/useStore';
import Environment from './Environment';
import Player from './Player';
import TargetManager from './TargetManager';

// A component to tick the game timer
function GameManager() {
  const tickTime = useStore((state) => state.tickTime);
  const isPlaying = useStore((state) => state.gameState.isPlaying);

  useFrame((_, delta) => {
    if (isPlaying) {
      tickTime(delta);
    }
  });

  return null;
}

export default function GameCanvas() {
  const currentScreen = useStore((state) => state.currentScreen);
  const graphicsQuality = useStore((state) => state.settings.graphicsQuality);

  return (
    <Canvas shadows gl={{ antialias: graphicsQuality !== 'low', powerPreference: "high-performance" }}>
      {/* Basic scene setup */}
      <color attach="background" args={['#020617']} />
      
      {/* Game Components */}
      <Environment />
      {(currentScreen === 'training' || currentScreen === 'menu') && <TargetManager />}
      <Player />
      <GameManager />

      {/* Post Processing */}
      {graphicsQuality === 'high' && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
