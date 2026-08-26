import React from 'react';
import { useStore, TrainingMode } from '../../store/useStore';
import { Settings, Target, Activity, Sliders, Gamepad2, MousePointer2 } from 'lucide-react';

export default function MainMenu() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const startGame = useStore((state) => state.startGame);
  const stats = useStore((state) => state.stats);

  const getRank = (accuracy: number, bestReaction: number) => {
    if (accuracy === 0) return 'Unranked';
    if (accuracy > 90 && bestReaction < 180) return 'Elite';
    if (accuracy > 85 && bestReaction < 200) return 'Master';
    if (accuracy > 80 && bestReaction < 220) return 'Diamond';
    if (accuracy > 70 && bestReaction < 250) return 'Platinum';
    if (accuracy > 60 && bestReaction < 280) return 'Gold';
    if (accuracy > 50 && bestReaction < 320) return 'Silver';
    return 'Bronze';
  };

  const handleStart = (mode: TrainingMode) => {
    startGame(mode, 60);
    // Request pointer lock synchronously with the user click event
    try {
      document.body.requestPointerLock();
    } catch (e) {
      console.error("Failed to request pointer lock", e);
    }
  };

  const menuItems = [
    { name: 'Training', icon: <Target size={20} />, screen: 'training_select', action: () => handleStart('flick') },
    { name: 'Controller Lab', icon: <Gamepad2 size={20} />, screen: 'controller', action: () => setCurrentScreen('controller') },
    { name: 'Aim Assist Lab', icon: <Sliders size={20} />, screen: 'aim-assist', action: () => setCurrentScreen('aim-assist') },
    { name: 'Sensitivity', icon: <MousePointer2 size={20} />, screen: 'sensitivity', action: () => setCurrentScreen('sensitivity') },
    { name: 'Statistics', icon: <Activity size={20} />, screen: 'stats', action: () => setCurrentScreen('stats') },
    { name: 'Settings', icon: <Settings size={20} />, screen: 'settings', action: () => setCurrentScreen('settings') },
  ];

  return (
    <div className="w-full h-full bg-slate-900/90 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        
        {/* Left Column - Title & Menu */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter uppercase italic">
              Flow Aim Lab
            </h1>
            <p className="text-xl text-cyan-200 mt-2 font-medium tracking-wide">
              Train Your Aim. Control Your Flow.
            </p>
            
            {/* Controller Connection Status */}
            <div className="mt-4 flex items-center gap-2 bg-slate-800/80 w-fit px-4 py-2 rounded-full border border-slate-700">
              <Gamepad2 size={16} className={useStore((state) => state.controllerName) ? "text-cyan-400" : "text-slate-500"} />
              <span className={`text-sm font-bold tracking-wider uppercase ${useStore((state) => state.controllerName) ? "text-cyan-400" : "text-slate-400"}`}>
                {useStore((state) => state.controllerName) ? `Controller: Connected` : 'Controller: Not Connected'}
              </span>
              {useStore((state) => state.controllerName) && (
                <span className="text-xs text-cyan-200 ml-2 hidden sm:inline-block">({useStore((state) => state.controllerName)?.substring(0, 15)}...)</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className="flex items-center gap-4 bg-slate-800/80 hover:bg-cyan-600/20 focus:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500 focus:border-cyan-500 outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 px-6 py-4 rounded-xl text-left group"
              >
                <div className="text-cyan-400 group-hover:text-cyan-300">
                  {item.icon}
                </div>
                <span className="text-lg font-bold text-slate-200 group-hover:text-white uppercase tracking-wider">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
          
          <div className="mt-12 bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
             <h2 className="text-lg font-bold text-cyan-400 mb-4 uppercase">Training Scenarios</h2>
             <div className="flex gap-4">
               <button onClick={() => handleStart('flick')} className="flex-1 bg-slate-700 hover:bg-cyan-600 focus:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 px-4 py-2 rounded font-semibold transition-colors">Flick</button>
               <button onClick={() => handleStart('tracking')} className="flex-1 bg-slate-700 hover:bg-cyan-600 focus:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 px-4 py-2 rounded font-semibold transition-colors">Tracking</button>
               <button onClick={() => handleStart('switching')} className="flex-1 bg-slate-700 hover:bg-cyan-600 focus:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 px-4 py-2 rounded font-semibold transition-colors">Switching</button>
               <button onClick={() => handleStart('reaction')} className="flex-1 bg-slate-700 hover:bg-cyan-600 focus:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 px-4 py-2 rounded font-semibold transition-colors">Reaction</button>
             </div>
          </div>
        </div>

        {/* Right Column - Profile & Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-cyan-500 bg-slate-700 flex items-center justify-center mb-4 overflow-hidden">
               <Target size={40} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Player Profile</h2>
            
            <div className="w-full mt-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Rank</span>
                <span className="text-cyan-400 font-bold text-lg">{getRank((stats.hits / stats.totalShots) * 100 || 0, stats.bestReactionTime)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Accuracy</span>
                <span className="text-white font-bold">{stats.totalShots > 0 ? ((stats.hits / stats.totalShots) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                <span className="text-slate-400 font-medium">Best Reaction</span>
                <span className="text-white font-bold">{stats.bestReactionTime === 9999 ? '-' : `${Math.round(stats.bestReactionTime)}ms`}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-400 font-medium">Total Shots</span>
                <span className="text-white font-bold">{stats.totalShots}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Daily Flow Challenge</h3>
            <p className="text-slate-300 text-sm mb-4">30 targets • 60s • Min 80% Acc</p>
            <button 
              onClick={() => handleStart('daily')}
              className="w-full bg-cyan-600 hover:bg-cyan-500 focus:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white font-bold py-3 rounded-lg transition-colors shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:shadow-[0_0_25px_rgba(8,145,178,0.7)]"
            >
              PLAY CHALLENGE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
