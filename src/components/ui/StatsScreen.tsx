import React from 'react';
import { useStore } from '../../store/useStore';
import { Activity, ChevronLeft, Target, Crosshair, Zap, Flame } from 'lucide-react';

export default function StatsScreen() {
  const setCurrentScreen = useStore((state) => state.setCurrentScreen);
  const stats = useStore((state) => state.stats);

  const accuracy = stats.totalShots > 0 ? ((stats.hits / stats.totalShots) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full h-full bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800/80 border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <Activity size={32} className="text-cyan-400" />
            <h2 className="text-3xl font-black text-white uppercase tracking-wider">Statistics</h2>
          </div>
          <button 
            onClick={() => setCurrentScreen('menu')}
            className="flex items-center gap-2 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} /> Back to Menu
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Stat Cards */}
          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center">
            <Target size={32} className="text-cyan-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-sm">Total Accuracy</span>
            <span className="text-4xl font-black text-white">{accuracy}%</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center">
            <Zap size={32} className="text-yellow-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-sm">Best Reaction</span>
            <span className="text-4xl font-black text-white">{stats.bestReactionTime === 9999 ? '-' : `${Math.round(stats.bestReactionTime)}ms`}</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center">
            <Crosshair size={32} className="text-red-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-sm">Total Hits</span>
            <span className="text-4xl font-black text-white">{stats.hits.toLocaleString()}</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-xl flex flex-col items-center justify-center">
            <Flame size={32} className="text-orange-400 mb-2" />
            <span className="text-slate-400 font-bold uppercase text-sm">Highest Streak</span>
            <span className="text-4xl font-black text-white">{stats.highestStreak}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
             <h3 className="text-lg font-bold text-cyan-400 uppercase mb-4">Detailed Breakdown</h3>
             <ul className="space-y-3">
               <li className="flex justify-between border-b border-slate-800 pb-2">
                 <span className="text-slate-400">Total Shots Fired</span>
                 <span className="text-white font-bold">{stats.totalShots.toLocaleString()}</span>
               </li>
               <li className="flex justify-between border-b border-slate-800 pb-2">
                 <span className="text-slate-400">Total Misses</span>
                 <span className="text-white font-bold">{stats.misses.toLocaleString()}</span>
               </li>
               <li className="flex justify-between border-b border-slate-800 pb-2">
                 <span className="text-slate-400">Average Reaction Time</span>
                 <span className="text-white font-bold">{Math.round(stats.averageReactionTime)}ms</span>
               </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
