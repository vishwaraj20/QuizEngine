"use client";
import { useEffect, useState } from 'react';
import { BrainCircuit, Trophy, ChevronRight, GraduationCap, Briefcase, TrendingUp, Target, Zap, History, Clock, CheckCircle, Award, Shield, Star, Crown, Moon, Sunrise, Compass, Diamond, Flame, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function StudentPortal() {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({ xp: 0, assessments: 0, mastery: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  // Pre-calculate empty week activity as fallback
  const defaultWeekActivity = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const currDate = new Date();
  const currDay = currDate.getDay() || 7; 
  for (let i = 1; i <= 7; i++) {
     const diff = i - currDay;
     defaultWeekActivity.push({
        day: dayNames[i-1],
        active: false,
        future: diff > 0,
        today: diff === 0
     });
  }

  const [streakData, setStreakData] = useState({ current: 0, weekActivity: defaultWeekActivity });

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) { 
      const user = JSON.parse(stored);
      setUserName(user.name || 'Student'); 
      
      // Fetch user stats & recent activity
      fetch(`http://localhost:5000/api/users/${user.id}/attempts`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const xp = data.reduce((acc, a) => acc + (a.score || 0), 0);
            const assessments = data.length;
            const validAttempts = data.filter(a => a.total > 0);
            const masteryVal = validAttempts.length > 0 
              ? (validAttempts.reduce((acc, a) => acc + (a.score / a.total), 0) / validAttempts.length) * 100 
              : 0;
            
            setStats({ xp, assessments, mastery: Math.round(masteryVal) });
            setRecentActivity(data.slice(0, 3));

            // Calculate unlocked badges
            const badges = [];
            if (data.length > 0) badges.push('First Blood');
            if (data.length >= 5) badges.push('Consistency');
            if (data.some(a => a.score === a.total && a.total > 0)) badges.push('Flawless Victory');
            if (masteryVal >= 90 && data.length >= 3) badges.push('Grandmaster');
            
            const categoryCounts = {};
            data.forEach(a => {
               if (a.category) {
                  categoryCounts[a.category] = (categoryCounts[a.category] || 0) + 1;
               }
            });
            if (Object.values(categoryCounts).some(count => count >= 3)) {
               badges.push('Track Specialist');
            }

            // NEW BADGES
            if (data.some(a => a.time_taken > 0 && a.time_taken < 30)) badges.push('Speed Demon');
            if (data.some(a => { const hr = new Date(a.completed_at).getHours(); return hr >= 0 && hr < 5; })) badges.push('Night Owl');
            if (data.some(a => { const hr = new Date(a.completed_at).getHours(); return hr >= 5 && hr < 9; })) badges.push('Early Bird');
            if (data.length >= 10) badges.push('Marathoner');
            if (Object.keys(categoryCounts).length >= 3) badges.push('Polymath');
            if (data.some(a => a.score === a.total && a.total > 0).length >= 3) badges.push('Perfectionist');
            
            setUnlockedBadges(badges);

            // Daily Streak Calculation
            const uniqueDates = [...new Set(data.map(a => new Date(a.completed_at).toDateString()))];
            uniqueDates.sort((a, b) => new Date(b) - new Date(a)); // Descending
            
            let streak = 0;
            const today = new Date();
            today.setHours(0,0,0,0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let currentCheck = new Date(today);
            
            if (uniqueDates.includes(today.toDateString())) {
               streak = 1;
               currentCheck.setDate(currentCheck.getDate() - 1);
               while(uniqueDates.includes(currentCheck.toDateString())) {
                  streak++;
                  currentCheck.setDate(currentCheck.getDate() - 1);
               }
            } else if (uniqueDates.includes(yesterday.toDateString())) {
               streak = 1;
               currentCheck = new Date(yesterday);
               currentCheck.setDate(currentCheck.getDate() - 1);
               while(uniqueDates.includes(currentCheck.toDateString())) {
                  streak++;
                  currentCheck.setDate(currentCheck.getDate() - 1);
               }
            }

            // Calculate week activity for Mon-Sun calendar
            const weekActivity = [];
            const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const currDate = new Date();
            const currDay = currDate.getDay() || 7; // 1-7, Mon-Sun
            
            for (let i = 1; i <= 7; i++) {
               const diff = i - currDay;
               const d = new Date(currDate);
               d.setDate(currDate.getDate() + diff);
               const isFuture = diff > 0;
               const isActive = uniqueDates.includes(d.toDateString());
               weekActivity.push({
                  day: dayNames[i-1],
                  active: isActive,
                  future: isFuture,
                  today: diff === 0
               });
            }

            setStreakData({ current: streak, weekActivity });
          }
        })
        .catch(console.error);
    }
  }, []);

  const examCategories = [
    { name: 'UPSC', desc: 'Civil Services Examination', icon: '🏛️' },
    { name: 'MPSC', desc: 'State Service Commission', icon: '⚖️' },
    { name: 'GATE', desc: 'Engineering Aptitude Test', icon: '⚙️' },
    { name: 'SSC', desc: 'Staff Selection Commission', icon: '📋' }
  ];

  const companyCategories = [
    { name: 'TCS', desc: 'Tata Consultancy Services', icon: '🏢' },
    { name: 'Accenture', desc: 'Accenture Cognitive & Technical', icon: '📈' },
    { name: 'AMCAT', desc: 'AMCAT Employability Assessment', icon: '📊' },
    { name: 'CoCubes', desc: 'CoCubes Pre-Assessed Prep', icon: '🧊' },
    { name: 'eLitmus', desc: 'eLitmus pH Test Prep', icon: '⚡' },
    { name: 'Infosys', desc: 'Infosys Placement Prep', icon: '💻' },
    { name: 'Wipro', desc: 'Wipro Elite & Turbo Prep', icon: '🌐' },
    { name: 'Cognizant', desc: 'GenC & GenC Next Prep', icon: '🚀' },
    { name: 'Capgemini', desc: 'Capgemini Analyst Prep', icon: '⚡' },
    { name: 'Dell', desc: 'Dell Technologies Assessment', icon: '💻' },
    { name: 'EPAM', desc: 'EPAM Systems Engineering Prep', icon: '🔧' },
    { name: 'IBM', desc: 'IBM Cognitive Assessment', icon: '🧠' },
    { name: 'Tech Mahindra', desc: 'Tech Mahindra Prep', icon: '📱' },
    { name: 'HCLTech', desc: 'HCLTech Assessment', icon: '🖥️' },
    { name: 'Deloitte', desc: 'Deloitte Aptitude Prep', icon: '📊' },
    { name: 'KPMG', desc: 'KPMG Placement Prep', icon: '📉' },
    { name: 'EY', desc: 'Ernst & Young Assessment', icon: '👁️' },
    { name: 'PwC', desc: 'PricewaterhouseCoopers', icon: '🧾' },
    { name: 'Amazon', desc: 'Amazon SDE & IT Prep', icon: '📦' },
    { name: 'Microsoft', desc: 'Microsoft Tech Prep', icon: '🪟' },
    { name: 'Google', desc: 'Google Engineering', icon: '🔍' },
    { name: 'Goldman Sachs', desc: 'Aptitude & Technical', icon: '🏦' },
    { name: 'JP Morgan', desc: 'Software Engineer Program', icon: '💳' },
    { name: 'Oracle', desc: 'Oracle Placement Prep', icon: '🗄️' },
    { name: 'Cisco', desc: 'Cisco Technical Assessment', icon: '📡' },
    { name: 'LTIMindtree', desc: 'LTIMindtree Prep', icon: '🌳' },
    { name: 'Hexaware', desc: 'Hexaware Aptitude', icon: '⚙️' }
  ];

  const aptitudeCategories = [
    { name: 'Quantitative Aptitude', desc: 'Math, numbers, and arithmetic', icon: '🧮' },
    { name: 'Verbal Ability', desc: 'English grammar and vocabulary', icon: '📖' },
    { name: 'Logical Reasoning', desc: 'Puzzles, sequences, and logic', icon: '🧩' },
    { name: 'Data Interpretation', desc: 'Charts, graphs, and data analysis', icon: '📊' }
  ];

  const getBadgeForCompany = (name) => {
    const topTier = ['TCS', 'Accenture', 'AMCAT', 'CoCubes', 'eLitmus'];
    const highYield = ['Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'Deloitte'];
    if (topTier.includes(name)) {
      return <span className="absolute top-5 right-5 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Live Series</span>;
    }
    if (highYield.includes(name)) {
      return <span className="absolute top-5 right-5 px-3 py-1 bg-indigo-500/10 text-indigo-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-indigo-500/30 shadow-sm">High Yield</span>;
    }
    return <span className="absolute top-5 right-5 px-3 py-1 bg-slate-800 text-slate-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-slate-700 shadow-sm">Practice Track</span>;
  };

  const CategoryCard = ({ cat, baseUrl = '/dashboard/category', customHref }) => (
    <Link 
      href={customHref || `${baseUrl}/${encodeURIComponent(cat.name)}`}
      className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1.5"
    >
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none"></div>
       {getBadgeForCompany(cat.name)}
       <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10">{cat.icon}</div>
       <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-400 transition-colors relative z-10">{cat.name}</h3>
       <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mb-8 line-clamp-2 relative z-10">{cat.desc}</p>
       <div className="mt-auto px-5 py-3 bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 w-full border border-gray-200/50 dark:border-slate-700/50 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-indigo-500/25 relative z-10">
         Select Track <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
       </div>
    </Link>
  );

  const allBadges = [
    { id: 'First Blood', desc: 'Complete your first quiz', icon: <Star className="w-5 h-5" />, color: 'from-blue-400 to-blue-600', textColor: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'Consistency', desc: 'Complete 5 or more quizzes', icon: <Clock className="w-5 h-5" />, color: 'from-purple-400 to-purple-600', textColor: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { id: 'Flawless Victory', desc: 'Score 100% on any quiz', icon: <Trophy className="w-5 h-5" />, color: 'from-yellow-400 to-orange-500', textColor: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'Track Specialist', desc: 'Complete 3 quizzes in one track', icon: <Shield className="w-5 h-5" />, color: 'from-emerald-400 to-emerald-600', textColor: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'Grandmaster', desc: 'Maintain 90%+ Mastery Rate', icon: <Crown className="w-5 h-5" />, color: 'from-rose-400 to-rose-600', textColor: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
    { id: 'Speed Demon', desc: 'Finish a quiz in under 30s', icon: <Zap className="w-5 h-5" />, color: 'from-cyan-400 to-cyan-600', textColor: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    { id: 'Night Owl', desc: 'Take a quiz between 12AM-5AM', icon: <Moon className="w-5 h-5" />, color: 'from-indigo-400 to-indigo-600', textColor: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { id: 'Early Bird', desc: 'Take a quiz between 5AM-9AM', icon: <Sunrise className="w-5 h-5" />, color: 'from-orange-400 to-red-500', textColor: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { id: 'Marathoner', desc: 'Complete 10 or more quizzes', icon: <Target className="w-5 h-5" />, color: 'from-red-400 to-red-600', textColor: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
    { id: 'Polymath', desc: 'Quizzes in 3 different tracks', icon: <Compass className="w-5 h-5" />, color: 'from-teal-400 to-teal-600', textColor: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-900/30' },
    { id: 'Perfectionist', desc: 'Score 100% on 3 quizzes', icon: <Diamond className="w-5 h-5" />, color: 'from-fuchsia-400 to-fuchsia-600', textColor: 'text-fuchsia-500 dark:text-fuchsia-400', bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30' }
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full mx-auto z-10 relative">
        
        {/* Header Section */}
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="mb-16 flex flex-col md:flex-row justify-between items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-10 rounded-[3rem] shadow-sm border border-white/20 dark:border-slate-700/50"
        >
           <div>
              <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-3">Student Dashboard</p>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">Welcome, {userName}! 👋</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Which career path are you crushing today?</p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-0">
              <Link href="/analytics" className="p-5 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-600/25 hover:bg-indigo-500 transition flex items-center gap-3 group">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 transform group-hover:scale-125 transition-transform animate-pulse" />
                 </div>
                 <div className="text-left pr-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">AI Diagnosis</p>
                    <p className="font-bold text-lg">Smart Analytics</p>
                 </div>
              </Link>

              <Link href="/dashboard/leaderboard" className="p-5 bg-slate-800 text-white rounded-3xl shadow-xl shadow-slate-900/20 hover:bg-slate-700 transition flex items-center gap-3 group border border-slate-700">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 transform group-hover:scale-125 transition-transform text-amber-400" />
                 </div>
                 <div className="text-left pr-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Ranking</p>
                    <p className="font-bold text-lg">Hall of Fame</p>
                 </div>
              </Link>
           </div>
        </motion.div>

        {/* Analytics Dashboard Widget */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
           <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total XP Earned</p>
                 <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.xp.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                 <Zap className="w-8 h-8" />
              </div>
           </div>
           
           <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Assessments Taken</p>
                 <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.assessments} <span className="text-lg text-gray-400">/20</span></p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                 <Target className="w-8 h-8" />
              </div>
           </div>

           <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white/20 dark:border-slate-700/50 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-xl hover:-translate-y-1">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Mastery Rate</p>
                 <p className="text-4xl font-black text-green-500 tracking-tighter">{stats.mastery}%</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-8 h-8" />
              </div>
           </div>
        </motion.div>

        {/* Activity & Achievements Grid */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.4 }}
           className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
           
           {/* Left Column Container */}
           <div className="flex flex-col gap-8">
              {/* Recent Activity Feed */}
              <div>
              <div className="flex items-center gap-3 mb-6">
                 <History className="w-6 h-6 text-gray-400" />
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recent Activity</h2>
              </div>
           
           {recentActivity.length === 0 ? (
             <div className="bg-white dark:bg-slate-800 p-10 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                   <Clock className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No recent activity.</p>
                <p className="text-gray-400 text-sm mt-1">Take your first quiz to see it here!</p>
             </div>
           ) : (
             <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {recentActivity.map((activity, idx) => {
                   const isPerfect = activity.score === activity.total;
                   const passPercentage = activity.total > 0 ? (activity.score / activity.total) * 100 : 0;
                   const isGood = passPercentage >= 75;
                   
                   return (
                     <div key={activity.id || idx} className={`flex items-center p-6 sm:p-8 transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/50 ${idx !== recentActivity.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}>
                        <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-sm mr-5 ${isPerfect ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500' : isGood ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500' : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400'}`}>
                           {isPerfect ? <Trophy className="w-6 h-6" /> : isGood ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{activity.quiz_title || 'Mock Assessment'}</h3>
                           <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">{activity.category || 'General'}</span>
                              <span className="text-sm font-medium text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(activity.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={`text-2xl font-black tracking-tighter ${isPerfect ? 'text-yellow-600' : isGood ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                              {activity.score} <span className="text-sm text-gray-400">/ {activity.total}</span>
                           </p>
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Score</p>
                        </div>
                     </div>
                   );
                })}
             </div>
           )}
              </div>

              {/* Daily Streak & Goals */}
              <div>
                 <div className="flex items-center gap-3 mb-6">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Daily Streak</h2>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                       {/* Flame & Number */}
                       <div className="flex flex-col items-center text-center shrink-0">
                          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-3 relative">
                             <Flame className="w-10 h-10 text-orange-500" />
                             <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-white font-bold">!</div>
                          </div>
                          <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{streakData.current}</h3>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Day Streak</p>
                       </div>
                       
                       {/* Divider */}
                       <div className="hidden sm:block w-px h-24 bg-gray-100 dark:bg-slate-800"></div>
                       
                       {/* Week Calendar */}
                       <div className="flex-1 w-full">
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-sm font-bold text-gray-900 dark:text-white">This Week</p>
                             <p className="text-xs font-medium text-gray-400">Keep it going!</p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                             {streakData.weekActivity.map((day, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                      day.active ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 
                                      day.today ? 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white border-2 border-orange-500' :
                                      day.future ? 'bg-gray-50 dark:bg-slate-900 border border-dashed border-gray-200 dark:border-slate-700 text-gray-300' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                                   }`}>
                                      {day.active ? '✓' : day.day.charAt(0)}
                                   </div>
                                   <span className="text-[10px] font-bold text-gray-400 uppercase">{day.day}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Achievements & Badges */}
           <div>
              <div className="flex items-center gap-3 mb-6">
                 <Award className="w-6 h-6 text-gray-400" />
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Achievements</h2>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
                 <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Unlock badges by completing quizzes and scoring high.</p>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">{unlockedBadges.length} / {allBadges.length}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {allBadges.map(badge => {
                       const isUnlocked = unlockedBadges.includes(badge.id);
                       
                       return (
                         <div 
                           key={badge.id} 
                           title={badge.desc}
                           className={`flex flex-col items-center text-center p-5 rounded-2xl transition-all border ${isUnlocked ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1' : 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:border-gray-300'}`}
                         >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${isUnlocked ? `bg-gradient-to-br ${badge.color} text-white shadow-md` : 'bg-gray-200 text-gray-400'}`}>
                               {badge.icon}
                            </div>
                            <h3 className={`text-sm font-bold leading-tight ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                               {badge.id}
                            </h3>
                            <div className="mt-3">
                               {isUnlocked ? (
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${badge.bg} ${badge.textColor}`}>Unlocked</span>
                               ) : (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">Locked</span>
                               )}
                            </div>
                         </div>
                       );
                    })}
                 </div>
              </div>
           </div>

        </motion.div>

        {/* Categories Section */}
        <motion.div 
           id="categories" 
           className="space-y-20 pt-10"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.6 }}
        >
          
          <section id="competitive-exams">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
                   <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-8">Competitive Exams</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {examCategories.map((cat, i) => (
                   <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}>
                      <CategoryCard cat={cat} baseUrl="/dashboard/exam" customHref={cat.name === 'SSC' ? '/dashboard/ssc' : null} />
                   </motion.div>
                ))}
             </div>
          </section>

          <section id="college-placement">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:emerald-400 rounded-2xl flex items-center justify-center shadow-sm">
                   <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight underline decoration-emerald-200 dark:decoration-emerald-800 underline-offset-8">College Placement Prep</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {companyCategories.map((cat, i) => (
                   <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + (i * 0.1) }}>
                      <CategoryCard cat={cat} baseUrl="/dashboard/company" />
                   </motion.div>
                ))}
             </div>
          </section>

          <section id="aptitude-library">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:amber-400 rounded-2xl flex items-center justify-center shadow-sm">
                   <BrainCircuit className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight underline decoration-amber-200 dark:decoration-amber-800 underline-offset-8">Aptitude Library</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {aptitudeCategories.map((cat, i) => (
                   <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 + (i * 0.1) }}>
                      <CategoryCard cat={cat} baseUrl="/dashboard/aptitude-library" customHref={`/dashboard/aptitude-library?category=${encodeURIComponent(cat.name)}`} />
                   </motion.div>
                ))}
             </div>
          </section>

        </motion.div>

        {/* Global Stats/Footer Info */}
        <div className="mt-24 text-center p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] text-white">
           <BrainCircuit className="w-12 h-12 text-blue-400 mx-auto mb-6" />
           <h3 className="text-3xl font-black mb-4 tracking-tight">Personalized Learning Path</h3>
           <p className="max-w-2xl mx-auto text-gray-400 font-medium">Our AI-driven system curates quizzes specifically for your chosen field. Select a track above to see available quizzes sorted by difficulty.</p>
        </div>

      </div>
    </div>
  );
}
