'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, Zap, Brain, 
  Target, ShieldCheck, Award, BarChart3, ChevronRight, Clock, Sparkles 
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('All Time');

  const trackMastery = [
    { name: 'Quantitative Aptitude', accuracy: 84, solved: 240, total: 285, status: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', border: 'border-emerald-500/30' },
    { name: 'Logical Reasoning', accuracy: 88, solved: 195, total: 220, status: 'Mastered', color: 'bg-emerald-500', textColor: 'text-emerald-400', border: 'border-emerald-500/30' },
    { name: 'Technical & Coding', accuracy: 72, solved: 140, total: 195, status: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-400', border: 'border-amber-500/30' },
    { name: 'Verbal Ability', accuracy: 58, solved: 110, total: 190, status: 'Needs Attention', color: 'bg-rose-500', textColor: 'text-rose-400', border: 'border-rose-500/30' },
    { name: 'Placement PYQs', accuracy: 76, solved: 180, total: 235, status: 'Good', color: 'bg-indigo-500', textColor: 'text-indigo-400', border: 'border-indigo-500/30' }
  ];

  const weakAreas = [
    {
      title: 'Sentence Correction & Grammar',
      track: 'Verbal Ability',
      accuracy: 48,
      attempts: 4,
      severity: 'Critical Weak Area',
      severityColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      insight: 'You frequently miss modifier placement and subject-verb agreement rules in TCS & Accenture verbal rounds.',
      actionText: '⚡ Launch Targeted Practice',
      link: '/dashboard/category/TCS%20-%20TCS%20Ninja%20-%20Verbal'
    },
    {
      title: 'Time & Work / Pipes & Cisterns',
      track: 'Quantitative Aptitude',
      accuracy: 62,
      attempts: 5,
      severity: 'Moderate Weak Area',
      severityColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      insight: 'You take an average of 85 seconds per question here, exceeding the 60-second placement cutoff.',
      actionText: '⚡ Practice Quantitative Track',
      link: '/dashboard/category/TCS%20-%20TCS%20Ninja%20-%20Quantitative'
    },
    {
      title: 'Blood Relations & Syllogism',
      track: 'Logical Reasoning',
      accuracy: 94,
      attempts: 6,
      severity: 'Mastered Area',
      severityColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      insight: 'Outstanding speed and accuracy! You are ready for any IT company reasoning section.',
      actionText: '🏆 Take Advanced Challenge',
      link: '/dashboard/company/Accenture'
    }
  ];

  const companyProbabilities = [
    { company: 'TCS Ninja / Digital', prob: 88, status: 'Very High Chance', badge: '🟢 Ready', desc: 'Aptitude & Reasoning accuracy exceeds cutoff.' },
    { company: 'Accenture Assessment', prob: 85, status: 'High Chance', badge: '🟢 Ready', desc: 'Strong performance in cognitive & technical.' },
    { company: 'Cognizant GenC', prob: 90, status: 'Very High Chance', badge: '🟢 Ready', desc: 'Consistent scores across all mock tests.' },
    { company: 'Wipro Elite', prob: 82, status: 'High Chance', badge: '🟢 Ready', desc: 'Good speed in numerical & verbal sections.' },
    { company: 'Infosys Specialist', prob: 72, status: 'Moderate Chance', badge: '🟡 Focus Needed', desc: 'Improve Verbal Ability to secure top bracket.' },
    { company: 'Deloitte Analytics', prob: 65, status: 'Needs Improvement', badge: '🟠 Needs Practice', desc: 'Focus on Data Interpretation and Coding.' }
  ];

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-gray-100">
      {/* Studio Lighting Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Executive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
          <div>
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 hover:underline mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <Brain className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">AI Performance Intelligence</h1>
            </div>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
              Real-time placement readiness score, subject accuracy breakdown, and personalized AI practice recommendations.
            </p>
          </div>

          {/* Time Period Selector */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700/80">
            {['All Time', 'Last 30 Days', 'This Week'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timePeriod === period 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Top Overview Row: AI Readiness Score & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main AI Readiness Score */}
          <div className="lg:col-span-1 bg-gradient-to-br from-indigo-900/90 via-[#0f1623] to-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-indigo-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Placement Ready
                </span>
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">AI Readiness Score</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-6xl font-black text-white tracking-tighter">78%</span>
                <span className="text-emerald-400 text-sm font-bold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +12% this month
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-3 leading-relaxed">
                Based on your performance across 14 mock tests, you are in the <strong>Top 15% of candidates</strong> preparing for Tier-1 IT companies.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Goal: 85% Mastery</span>
              <span className="text-indigo-400">7% to Elite Bracket</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Total XP Earned</p>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-black tracking-tight">1,450 <span className="text-xs font-bold text-amber-500">XP</span></p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Level 4 Scholar · Next reward at 2,000 XP</p>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Assessments Taken</p>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-black tracking-tight">14 <span className="text-sm font-bold text-gray-400">/ 20</span></p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">6 more tests to unlock consistency badge</p>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Average Speed</p>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-black tracking-tight">42s <span className="text-xs font-bold text-emerald-500">per question</span></p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Well within the 60s IT placement cutoff</p>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Overall Accuracy</p>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-4xl font-black tracking-tight">79.5%</p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Highest accuracy in Logical Reasoning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Track Mastery Breakdown (Visual Bars) */}
        <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-500" /> Subject Mastery Breakdown
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">Detailed accuracy and completion rates across all 5 primary recruitment tracks.</p>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target: 75%+</span>
          </div>

          <div className="space-y-6">
            {trackMastery.map((track) => (
              <div key={track.name} className="p-5 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 transition-all hover:border-indigo-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-gray-900 dark:text-white">{track.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${track.border} ${track.textColor} bg-gray-900/40`}>
                      {track.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-slate-400">
                    <span className="text-gray-900 dark:text-white font-black">{track.solved}</span> / {track.total} Qs Solved ({track.accuracy}% Accuracy)
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${track.color}`} 
                    style={{ width: `${track.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: AI Weak Area Detection & Targeted Action */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" /> AI Weak Area Diagnosis &amp; Action Plan
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">AI-detected bottlenecks affecting your overall selection probability.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {weakAreas.map((area, idx) => (
              <div key={idx} className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group hover:border-indigo-500/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${area.severityColor}`}>
                      {area.severity}
                    </span>
                    <span className="text-xs font-bold text-gray-400">{area.accuracy}% Acc</span>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-1">{area.track}</p>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3 leading-snug">{area.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed bg-gray-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 mb-6">
                    💡 {area.insight}
                  </p>
                </div>

                <Link 
                  href={area.link}
                  className="w-full py-3 bg-gray-100 dark:bg-slate-800/80 group-hover:bg-indigo-600 text-gray-700 dark:text-slate-300 group-hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25 border border-gray-200/50 dark:border-slate-700/50 group-hover:border-transparent flex items-center justify-center gap-2"
                >
                  {area.actionText} <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Placement Probability Predictor by Company */}
        <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-500" /> Placement Probability Predictor
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">AI-predicted chance of clearing round 1 written/online aptitude assessments.</p>
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">6 Major IT Giants</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyProbabilities.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800/80 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-base text-gray-900 dark:text-white">{item.company}</span>
                    <span className="text-xs font-bold">{item.badge}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">{item.desc}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-gray-400">Clearing Chance</span>
                    <span className={`text-base font-black ${item.prob >= 80 ? 'text-emerald-500' : item.prob >= 70 ? 'text-amber-500' : 'text-rose-500'}`}>{item.prob}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.prob >= 80 ? 'bg-emerald-500' : item.prob >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${item.prob}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
