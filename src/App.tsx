/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { useGamepadMenu } from './hooks/useGamepadMenu';
import MainMenu from './components/ui/MainMenu';
import HUD from './components/ui/HUD';
import GameCanvas from './components/game/GameCanvas';
import SettingsMenu from './components/ui/SettingsMenu';
import StatsScreen from './components/ui/StatsScreen';
import SensitivityLab from './components/ui/SensitivityLab';
import ControllerLab from './components/ui/ControllerLab';
import AimAssistLab from './components/ui/AimAssistLab';
import CrosshairOverlay from './components/ui/CrosshairOverlay';
import PostGameScreen from './components/ui/PostGameScreen';
import ControllerDebugPanel from './components/ui/ControllerDebugPanel';

const DEBUG_CONTROLLER = true;

export default function App() {
  const currentScreen = useStore((state) => state.currentScreen);
  const isPlaying = useStore((state) => state.gameState.isPlaying);

  // Hook for controller UI navigation
  useGamepadMenu(!isPlaying);

  // Auto-lock pointer when playing starts
  useEffect(() => {
    if (isPlaying && currentScreen === 'training') {
      const onPointerLockChange = () => {
        if (document.pointerLockElement !== document.body && useStore.getState().gameState.isPlaying) {
          // If we lose pointer lock, we should pause or go to menu. For now, end game.
          useStore.getState().endGame();
        }
      };

      document.addEventListener('pointerlockchange', onPointerLockChange);
      return () => document.removeEventListener('pointerlockchange', onPointerLockChange);
    }
  }, [isPlaying, currentScreen]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none flex relative">
      {/* 3D Game Layer */}
      <div className="absolute inset-0 z-0">
        <GameCanvas />
      </div>

      {/* Crosshair Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <CrosshairOverlay />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Enable pointer events only for the active UI components */}
        <div className="w-full h-full pointer-events-auto flex items-center justify-center">
          {currentScreen === 'menu' && <MainMenu />}
          {currentScreen === 'settings' && <SettingsMenu />}
          {currentScreen === 'stats' && <StatsScreen />}
          {currentScreen === 'sensitivity' && <SensitivityLab />}
          {currentScreen === 'controller' && <ControllerLab />}
          {currentScreen === 'aim-assist' && <AimAssistLab />}
          {currentScreen === 'post-game' && <PostGameScreen />}
          {currentScreen === 'training' && <HUD />}
        </div>
      </div>
      {DEBUG_CONTROLLER && <ControllerDebugPanel />}
    </div>
  );
}

