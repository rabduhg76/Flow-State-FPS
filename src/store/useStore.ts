import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Screen = 'menu' | 'training' | 'settings' | 'stats' | 'sensitivity' | 'controller' | 'aim-assist' | 'post-game';
export type TrainingMode = 'flick' | 'tracking' | 'switching' | 'reaction' | 'daily';
export type AimAssistMode = 'OFF' | 'TRAINING' | 'SIMULATION';

export interface CrosshairSettings {
  type: 'cross' | 'dot' | 'circle';
  size: number;
  thickness: number;
  gap: number;
  opacity: number;
  centerDot: boolean;
  color: string;
  outline: boolean;
}

export interface ControllerSettings {
  leftStickSens: number;
  rightStickSens: number;
  horizontalSens: number;
  verticalSens: number;
  adsSens: number;
  deadzone: number;
  responseCurve: 'linear' | 'exponential' | 'dynamic';
  aimAcceleration: number;
}

export interface AimAssistSettings {
  mode: AimAssistMode;
  strength: number;
  slowdown: number;
  magnetism: number;
  rotationAssist: number;
  targetRadius: number;
  activationDistance: number;
}

export interface Settings {
  fov: number;
  mouseSens: number;
  dpi: number;
  audioVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high';
  showFps: boolean;
  cameraShake: boolean;
  targetColor: string;
  crosshair: CrosshairSettings;
  controller: ControllerSettings;
  aimAssist: AimAssistSettings;
}

export interface Stats {
  totalShots: number;
  hits: number;
  misses: number;
  averageReactionTime: number; // ms
  bestReactionTime: number; // ms
  trackingAccuracy: number; // %
  flickScore: number;
  switchingScore: number;
  trainingTime: number; // seconds
  highestStreak: number;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  timeRemaining: number;
  targetsHit: number;
  targetsMissed: number;
  streak: number;
  accuracy: number;
  recentReactionTimes: number[];
}

export type InputMode = 'keyboardMouse' | 'controller';

interface AppState {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  controllerName: string | null;
  setControllerName: (name: string | null) => void;
  
  trainingMode: TrainingMode;
  setTrainingMode: (mode: TrainingMode) => void;

  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateCrosshair: (newCrosshair: Partial<CrosshairSettings>) => void;
  updateController: (newController: Partial<ControllerSettings>) => void;
  updateAimAssist: (newAimAssist: Partial<AimAssistSettings>) => void;

  stats: Stats;
  updateStats: (newStats: Partial<Stats>) => void;
  addShotResult: (hit: boolean, reactionTime?: number) => void;
  
  gameState: GameState;
  startGame: (mode: TrainingMode, duration?: number) => void;
  endGame: () => void;
  updateGameState: (newState: Partial<GameState>) => void;
  registerHit: (reactionTime?: number) => void;
  registerMiss: () => void;
  tickTime: (delta: number) => void;
}

const defaultSettings: Settings = {
  fov: 90,
  mouseSens: 5.0,
  dpi: 800,
  audioVolume: 0.5,
  graphicsQuality: 'high',
  showFps: true,
  cameraShake: true,
  targetColor: '#ff9900',
  crosshair: {
    type: 'cross',
    size: 6,
    thickness: 2,
    gap: 4,
    opacity: 1,
    centerDot: false,
    color: '#00ffff',
    outline: true,
  },
  controller: {
    leftStickSens: 5,
    rightStickSens: 5,
    horizontalSens: 5,
    verticalSens: 5,
    adsSens: 0.85,
    deadzone: 0.12,
    responseCurve: 'dynamic',
    aimAcceleration: 0.5,
  },
  aimAssist: {
    mode: 'OFF',
    strength: 0,
    slowdown: 0.5,
    magnetism: 0.3,
    rotationAssist: 0.2,
    targetRadius: 1.5,
    activationDistance: 10,
  }
};

const defaultStats: Stats = {
  totalShots: 0,
  hits: 0,
  misses: 0,
  averageReactionTime: 0,
  bestReactionTime: 9999,
  trackingAccuracy: 0,
  flickScore: 0,
  switchingScore: 0,
  trainingTime: 0,
  highestStreak: 0,
};

const defaultGameState: GameState = {
  isPlaying: false,
  score: 0,
  timeRemaining: 60,
  targetsHit: 0,
  targetsMissed: 0,
  streak: 0,
  accuracy: 0,
  recentReactionTimes: [],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentScreen: 'menu',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      
      inputMode: 'keyboardMouse',
      setInputMode: (mode) => set({ inputMode: mode }),
      controllerName: null,
      setControllerName: (name) => set({ controllerName: name }),
      
      trainingMode: 'flick',
      setTrainingMode: (mode) => set({ trainingMode: mode }),

      settings: defaultSettings,
      updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
      updateCrosshair: (newCrosshair) => set((state) => ({ settings: { ...state.settings, crosshair: { ...state.settings.crosshair, ...newCrosshair } } })),
      updateController: (newController) => set((state) => ({ settings: { ...state.settings, controller: { ...state.settings.controller, ...newController } } })),
      updateAimAssist: (newAimAssist) => set((state) => ({ settings: { ...state.settings, aimAssist: { ...state.settings.aimAssist, ...newAimAssist } } })),

      stats: defaultStats,
      updateStats: (newStats) => set((state) => ({ stats: { ...state.stats, ...newStats } })),
      addShotResult: (hit, reactionTime) => set((state) => {
        const hits = state.stats.hits + (hit ? 1 : 0);
        const totalShots = state.stats.totalShots + 1;
        const misses = state.stats.misses + (hit ? 0 : 1);
        
        let newBestRt = state.stats.bestReactionTime;
        let newAvgRt = state.stats.averageReactionTime;

        if (hit && reactionTime) {
            newBestRt = Math.min(newBestRt, reactionTime);
            // simple moving average for demonstration
            newAvgRt = newAvgRt === 0 ? reactionTime : (newAvgRt * 0.95) + (reactionTime * 0.05);
        }

        return {
          stats: {
            ...state.stats,
            hits,
            totalShots,
            misses,
            bestReactionTime: newBestRt,
            averageReactionTime: newAvgRt,
          }
        };
      }),

      gameState: defaultGameState,
      startGame: (mode, duration = 60) => set({ 
        trainingMode: mode,
        currentScreen: 'training',
        gameState: { 
          ...defaultGameState, 
          isPlaying: true,
          timeRemaining: duration,
        }
      }),
      endGame: () => set((state) => {
        // Here we could update global stats with game results
        const { streak } = state.gameState;
        
        return {
          currentScreen: 'post-game',
          gameState: { ...state.gameState, isPlaying: false },
          stats: {
              ...state.stats,
              highestStreak: Math.max(state.stats.highestStreak, streak)
          }
        };
      }),
      updateGameState: (newState) => set((state) => ({ gameState: { ...state.gameState, ...newState } })),
      // registerHit: Called when a user successfully shoots a target.
      // - Calculates new streak (combo multiplier)
      // - Increases total score with streak scaling
      // - Keeps a sliding window of recent reaction times
      // - Updates global statistics through addShotResult
      registerHit: (reactionTime) => set((state) => {
        const hits = state.gameState.targetsHit + 1;
        const streak = state.gameState.streak + 1;
        const score = state.gameState.score + (100 * (1 + streak * 0.1));
        const total = hits + state.gameState.targetsMissed;
        const accuracy = total > 0 ? (hits / total) * 100 : 0;
        
        const rts = [...state.gameState.recentReactionTimes];
        if (reactionTime) rts.push(reactionTime);
        if (rts.length > 10) rts.shift(); // Keep last 10 reaction times for avg

        get().addShotResult(true, reactionTime);

        if (state.trainingMode === 'daily' && total >= 30) {
          setTimeout(() => get().endGame(), 0);
        }

        return {
          gameState: {
            ...state.gameState,
            targetsHit: hits,
            streak,
            score,
            accuracy,
            recentReactionTimes: rts
          }
        };
      }),
      // registerMiss: Called when the user shoots but misses all targets.
      // - Resets current streak
      // - Updates active game accuracy
      registerMiss: () => set((state) => {
        const misses = state.gameState.targetsMissed + 1;
        const hits = state.gameState.targetsHit;
        const total = hits + misses;
        const accuracy = total > 0 ? (hits / total) * 100 : 0;
        
        get().addShotResult(false);

        if (state.trainingMode === 'daily' && total >= 30) {
          setTimeout(() => get().endGame(), 0);
        }

        return {
          gameState: {
            ...state.gameState,
            targetsMissed: misses,
            streak: 0,
            accuracy
          }
        };
      }),
      tickTime: (delta) => set((state) => {
        if (!state.gameState.isPlaying) return {};
        const newTime = Math.max(0, state.gameState.timeRemaining - delta);
        if (newTime === 0) {
            setTimeout(() => get().endGame(), 0);
        }
        return {
          gameState: {
            ...state.gameState,
            timeRemaining: newTime
          }
        };
      })
    }),
    {
      name: 'flow-aim-lab-storage',
      partialize: (state) => ({ settings: state.settings, stats: state.stats }),
    }
  )
);
