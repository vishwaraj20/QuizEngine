"use client";
import { ArrowLeft, Trophy, Medal, Star, Flame, Award, Zap, Building, GraduationCap, Target } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LeaderboardPage() {
  const [mainTab, setMainTab] = useState('global');
  const [subTab, setSubTab] = useState('all');
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const examCategories = ['UPSC', 'MPSC', 'GATE', 'SSC'];
  const companyCategories = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'IBM', 'Tech Mahindra', 'HCLTech', 'Deloitte', 'KPMG', 'EY', 'PwC', 'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'JP Morgan', 'Oracle', 'Cisco', 'LTIMindtree', 'Hexaware'];

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch("http://localhost:5000/api/leaderboard");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        // Map backend data to frontend format
        const formattedData = data.map((item, index) => ({
          rank: index + 1,
          name: item.user_name || 'Anonymous',
          score: item.score || 0,
          category: item.category || 'General',
          badges: index === 0 ? ["Flawless", "Speed Demon"] : index === 1 ? ["Consistent"] : []
        }));
        
        setTopStudents(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  // Filter students based on active tabs
  const filteredStudents = topStudents.filter(s => {
    if (mainTab === 'global') return true;
    
    if (mainTab === 'exams') {
      if (subTab === 'all') {
        return examCategories.map(c => c.toLowerCase()).includes(s.category?.toLowerCase());
      }
      return s.category?.toLowerCase() === subTab.toLowerCase();
    }
    
    if (mainTab === 'companies') {
      if (subTab === 'all') {
        return companyCategories.map(c => c.toLowerCase()).includes(s.category?.toLowerCase());
      }
      return s.category?.toLowerCase() === subTab.toLowerCase();
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Navigation */}
        <div className="mb-10 flex items-center justify-between">
           <Link href="/dashboard" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition">
              <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal
           </Link>
        </div>

        {/* Grand Header */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-2xl shadow-yellow-500/40 mb-8 border-4 border-white transform hover:scale-110 transition">
              <Trophy className="w-12 h-12 text-white" />
           </div>
           <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">Hall of Fame</h1>
           <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">The top 1% of candidates across the nation.</p>
        </div>

        {/* Filters Section */}
        <div className="mb-12">
          {/* Main Tier Tabs */}
          <div className="flex bg-gray-200/50 p-2 rounded-3xl mb-6 max-w-2xl mx-auto shadow-inner">
            {['global', 'exams', 'companies'].map(tab => (
              <button 
                key={tab}
                onClick={() => { setMainTab(tab); setSubTab('all'); }}
                className={`flex-1 py-4 px-4 text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 flex justify-center items-center gap-2 ${mainTab === tab ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-lg shadow-gray-200/50 scale-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white scale-95 hover:scale-100 hover:bg-gray-200/80'}`}
              >
                {tab === 'global' && <Trophy className="w-5 h-5" />}
                {tab === 'exams' && <GraduationCap className="w-5 h-5" />}
                {tab === 'companies' && <Building className="w-5 h-5" />}
                <span className="hidden sm:inline">{tab === 'exams' ? 'Competitive Exams' : tab === 'companies' ? 'Placement Prep' : 'Global Ranking'}</span>
                <span className="sm:hidden">{tab}</span>
              </button>
            ))}
          </div>

          {/* Sub Tier Track Selector */}
          {mainTab !== 'global' && (
            <div className="max-w-4xl mx-auto relative group">
               {/* Fade edges for scroll indicator */}
               <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none z-10 rounded-l-full"></div>
               <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none z-10 rounded-r-full"></div>
               
               <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-2 custom-scrollbar smooth-scroll snap-x">
                  <button
                     onClick={() => setSubTab('all')}
                     className={`shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all snap-start ${subTab === 'all' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 scale-105 border-transparent' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300'}`}
                  >
                     All {mainTab === 'exams' ? 'Exams' : 'Companies'}
                  </button>
                  {(mainTab === 'exams' ? examCategories : companyCategories).map(cat => (
                    <button
                       key={cat}
                       onClick={() => setSubTab(cat)}
                       className={`shrink-0 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all snap-start ${subTab === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/30 scale-105 border-transparent' : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white hover:bg-gray-100 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300'}`}
                    >
                       {cat}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {/* Leaderboard List */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 dark:border-slate-700 overflow-hidden relative">
           {/* Decorative Header Bar */}
           <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 absolute top-0 left-0 right-0"></div>

           {loading ? (
             <div className="p-24 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
                <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-sm animate-pulse">Summoning Legends...</p>
             </div>
           ) : filteredStudents.length === 0 ? (
             <div className="p-24 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Target className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-xl mb-2">No legends found yet.</p>
                <p className="text-gray-400 font-medium">Be the first to claim the top spot in this track!</p>
             </div>
           ) : (
             filteredStudents.map((student, idx) => (
               <div key={student.name + idx} className={`flex items-center p-6 sm:p-8 transition-colors hover:bg-blue-50/50 ${idx !== filteredStudents.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''} group`}>
                 
                 {/* Rank Shield */}
                 <div className={`w-16 h-16 shrink-0 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm mr-6 group-hover:scale-110 transition-transform ${
                    (idx + 1) === 1 ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 border-2 border-yellow-300' :
                    (idx + 1) === 2 ? 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-500 dark:text-gray-400 border-2 border-gray-300' :
                    (idx + 1) === 3 ? 'bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 border-2 border-amber-200' :
                    'bg-gray-50 dark:bg-slate-900 text-gray-400'
                 }`}>
                    {(idx + 1) === 1 ? <Medal className="w-8 h-8" /> : `#${idx + 1}`}
                 </div>

                 {/* User Info */}
                 <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                       {student.name} 
                       {student.badges.includes("Flawless") && <Flame className="w-6 h-6 text-orange-500 inline fill-orange-500 drop-shadow-sm" title="Flawless Victory"/>}
                       {student.badges.includes("Speed Demon") && <Zap className="w-6 h-6 text-blue-500 inline fill-blue-500 drop-shadow-sm" title="Speed Demon"/>}
                    </h3>
                    <div className="flex items-center mt-1.5 gap-2">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          examCategories.includes(student.category) ? 'bg-indigo-100 text-indigo-600' : 
                          companyCategories.includes(student.category) ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'
                       }`}>
                          {student.category}
                       </span>
                    </div>
                 </div>

                 {/* Score */}
                 <div className="text-right">
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter group-hover:text-blue-600 transition-colors">{student.score.toLocaleString()}</p>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1">Total XP</p>
                 </div>
               </div>
             ))
           )}
        </div>

      </div>
    </div>
  );
}
