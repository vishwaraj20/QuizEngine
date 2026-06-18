"use client";
import { ArrowLeft, Trophy, Medal, Star, Flame, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('global');

  // Hardcoded elite UI data for showcase
  const topStudents = [
    { rank: 1, name: "Arjun Verma", score: 9850, category: "UPSC", badges: ["Flawless", "Speed Demon"] },
    { rank: 2, name: "Neha Sharma", score: 9200, category: "GATE", badges: ["Consistent"] },
    { rank: 3, name: "Ravi Kumar", score: 8900, category: "MPSC", badges: ["Sharpshooter"] },
    { rank: 4, name: "Priya Singh", score: 8450, category: "GATE", badges: [] },
    { rank: 5, name: "Amit Patel", score: 8100, category: "UPSC", badges: ["Night Owl"] },
    { rank: 6, name: "Sneha Reddy", score: 7900, category: "MPSC", badges: [] },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-10 flex items-center justify-between">
           <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal
           </Link>
        </div>

        {/* Grand Header */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-2xl shadow-yellow-500/40 mb-8 border-4 border-white transform hover:scale-110 transition">
              <Trophy className="w-12 h-12 text-white" />
           </div>
           <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Hall of Fame</h1>
           <p className="text-xl text-gray-500 font-medium">The top 1% of candidates across the nation.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl mb-12 max-w-md mx-auto">
          {['global', 'upsc', 'gate', 'mpsc'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
           {topStudents.map((student, idx) => (
              <div key={student.name} className={`flex items-center p-6 sm:p-8 transition-colors hover:bg-gray-50 ${idx !== topStudents.length - 1 ? 'border-b border-gray-100' : ''}`}>
                 
                 {/* Rank Shield */}
                 <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm mr-6 ${
                    student.rank === 1 ? 'bg-yellow-100 text-yellow-600 border-2 border-yellow-200' :
                    student.rank === 2 ? 'bg-gray-200 text-gray-600 border-2 border-gray-300' :
                    student.rank === 3 ? 'bg-amber-100 text-amber-700 border-2 border-amber-200' :
                    'bg-gray-50 text-gray-400'
                 }`}>
                    {student.rank === 1 ? <Medal className="w-6 h-6" /> : `#${student.rank}`}
                 </div>

                 {/* User Info */}
                 <div className="flex-1">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                       {student.name} 
                       {student.badges.includes("Flawless") && <Flame className="w-5 h-5 text-orange-500 inline fill-orange-500" title="Flawless Victory"/>}
                       {student.badges.includes("Speed Demon") && <Zap className="w-5 h-5 text-blue-500 inline fill-blue-500" title="Speed Demon"/>}
                    </h3>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Track &middot; <span className="text-blue-500">{student.category}</span></p>
                 </div>

                 {/* Score */}
                 <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">{student.score.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total XP</p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </div>
  );
}
