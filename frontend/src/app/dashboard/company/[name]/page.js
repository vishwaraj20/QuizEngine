"use client";
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyTracksPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.name);

  let topicCategories = [
    { name: 'Quantitative Aptitude', desc: 'Mathematical Ability', icon: '🔢' },
    { name: 'Logical Reasoning', desc: 'Puzzles & Logic', icon: '🧩' },
    { name: 'Verbal Ability', desc: 'English & Grammar', icon: '📚' }
  ];

  if (companyName.toUpperCase() === 'TCS') {
    topicCategories = [
      ...topicCategories,
      { name: 'TCS Ninja', desc: 'Previous Year Ninja Papers', icon: '🥷' },
      { name: 'TCS Question Bank', desc: 'Aptitude Question Bank (44 pgs)', icon: '📖' }
    ];
  } else if (companyName.toUpperCase() === 'ACCENTURE') {
    topicCategories = [
      ...topicCategories,
      { name: 'Accenture Papers', desc: 'Previous Year Placement Papers (42 Sets)', icon: '📄' },
      { name: 'Accenture Question Bank', desc: 'Aptitude & Reasoning Question Bank', icon: '📖' }
    ];
  } else {
    topicCategories = [
      ...topicCategories,
      { name: `${companyName} Papers`, desc: 'Previous Year Placement Papers', icon: '📄' },
      { name: `${companyName} Question Bank`, desc: 'Aptitude & Reasoning Question Bank', icon: '📖' }
    ];
  }

  const getBadgeForTopic = (name) => {
    if (name.includes('Papers') || name.includes('Ninja') || name.includes('Elite')) {
      return <span className="absolute top-5 right-5 px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Test Series</span>;
    }
    if (name.includes('Question Bank') || name.includes('Bank') || name.includes('Guide')) {
      return <span className="absolute top-5 right-5 px-3 py-1 bg-blue-500/10 text-blue-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-blue-500/30 shadow-sm">Study Material</span>;
    }
    if (name.includes('Coding')) {
      return <span className="absolute top-5 right-5 px-3 py-1 bg-purple-500/10 text-purple-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-purple-500/30 shadow-sm">Technical</span>;
    }
    return <span className="absolute top-5 right-5 px-3 py-1 bg-amber-500/10 text-amber-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-amber-500/30 shadow-sm">Core Aptitude</span>;
  };

  const TopicCard = ({ topic }) => {
    // The final category string sent to the backend will be "Company - Topic"
    const fullCategoryName = `${companyName} - ${topic.name}`;
    return (
      <Link 
        href={`/dashboard/category/${encodeURIComponent(fullCategoryName)}`}
        className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1.5"
      >
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500 pointer-events-none"></div>
         {getBadgeForTopic(topic.name)}
         <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10">{topic.icon}</div>
         <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-indigo-400 transition-colors relative z-10">{topic.name}</h3>
         <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mb-8 line-clamp-2 relative z-10">{topic.desc}</p>
         <div className="mt-auto px-5 py-3 bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 w-full border border-gray-200/50 dark:border-slate-700/50 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-indigo-500/25 relative z-10">
           View Quizzes <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
         </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100 dark:border-slate-700">
                 🏢
              </div>
              <div>
                 <Link href="/dashboard#college-placement" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                    <ArrowLeft className="w-3 h-3" /> Back to Categories
                 </Link>
                 <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{companyName} Prep</h1>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Select a track to start practicing</p>
              </div>
           </div>
        </div>

        <div className="bg-gray-200/50 h-px w-full mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {topicCategories.map(topic => <TopicCard key={topic.name} topic={topic} />)}
           
           <Link 
             href={`/dashboard/company/${encodeURIComponent(companyName)}/coding`}
             className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1.5"
           >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500 pointer-events-none"></div>
              <span className="absolute top-5 right-5 px-3 py-1 bg-purple-500/10 text-purple-400 font-bold text-[9px] uppercase tracking-widest rounded-full border border-purple-500/30 shadow-sm">Technical</span>
              <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10">💻</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-400 transition-colors relative z-10">Coding Problems</h3>
              <p className="text-gray-500 dark:text-slate-400 font-medium text-sm mb-8 relative z-10">Technical Interview Prep</p>
              <div className="mt-auto px-5 py-3 bg-gray-100 dark:bg-slate-800/60 text-gray-700 dark:text-slate-300 group-hover:bg-purple-600 group-hover:text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 w-full border border-gray-200/50 dark:border-slate-700/50 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-purple-500/25 relative z-10">
                Open Workspace <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
