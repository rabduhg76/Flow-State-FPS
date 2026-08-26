import React from 'react';
import { useStore } from '../../store/useStore';
import { Target, Zap, Activity, Award, Home, RotateCcw } from 'lucide-react';

export default function PostGameScreen() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const startGame = useStore((state) => state.startGame);
  const gameState = useStore((state) => state.gameState);
  const mode = useStore((state) => state.trainingMode);

  const getRank = (accuracy: number, reaction: number) => {
    if (accuracy === 0) return 'UNRANKED';
    if (accuracy > 90 && reaction < 180) return 'ELITE';
    if (accuracy > 85 && reaction < 200) return 'MASTER';
    if (accuracy > 80 && reaction < 220) return 'DIAMOND';
    if (accuracy > 70 && reaction < 250) return 'PLATINUM';
    if (accuracy > 60 && reaction < 280) return 'GOLD';
    if (accuracy > 50 && reaction < 320) return 'SILVER';
    return 'BRONZE';
  };

  // Calculate average reaction time for the session
  const avgReaction = gameState.recentReactionTimes.length > 0 
    ? gameState.recentReactionTimes.reduce((a, b) => a + b, 0) / gameState.recentReactionTimes.length 
    : 0;

  const currentRank = getRank(gameState.accuracy, avgReaction || 9999);

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
        
        {/* Decorator */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-600" />
        
        <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-2">
          {mode === 'daily' ? 'Daily Challenge Complete' : 'Session Complete'}
        </h2>
        <p className="text-cyan-400 font-bold uppercase tracking-wider mb-8">
          Mode: {mode}
        </p>

        {mode === 'daily' && (
          <div className={`mb-8 p-4 rounded-xl border ${gameState.accuracy >= 80 ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'}`}>
            <h3 className={`text-xl font-bold uppercase ${gameState.accuracy >= 80 ? 'text-green-400' : 'text-red-400'}`}>
              {gameState.accuracy >= 80 ? 'Challenge Passed!' : 'Challenge Failed (Min 80% Accuracy Required)'}
            </h3>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center">
            <Award size={32} className="text-cyan-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Final Score</span>
            <span className="text-3xl font-black text-white mt-1">{Math.floor(gameState.score).toLocaleString()}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center">
            <Target size={32} className="text-cyan-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Accuracy</span>
            <span className="text-3xl font-black text-white mt-1">{gameState.accuracy.toFixed(1)}%</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center">
            <Zap size={32} className="text-cyan-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Avg Reaction</span>
            <span className="text-3xl font-black text-white mt-1">{avgReaction > 0 ? `${Math.round(avgReaction)}ms` : '-'}</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center">
            <Activity size={32} className="text-cyan-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Session Rank</span>
            <span className="text-2xl font-black text-white mt-1">{currentRank}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => startGame(mode, 60)}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 focus:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(8,145,178,0.7)] uppercase tracking-wider"
          >
            <RotateCcw size={20} /> Play Again
          </button>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white font-bold px-8 py-4 rounded-xl transition-colors uppercase tracking-wider"
          >
            <Home size={20} /> Main Menu
          </button>
        </div>

      </div>
    </div>
  );
}
