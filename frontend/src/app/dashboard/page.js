"use client";
import { useEffect, useState } from 'react';
import { BrainCircuit, Trophy, ChevronRight, GraduationCap, Briefcase, TrendingUp, Target, Zap } from 'lucide-react';
import Link from 'next/link';

export default function StudentPortal() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) { setUserName(JSON.parse(stored).name || 'Student'); }
  }, []);

  const examCategories = [
    { name: 'UPSC', desc: 'Civil Services Examination', icon: '🏛️' },
    { name: 'MPSC', desc: 'State Service Commission', icon: '⚖️' },
    { name: 'GATE', desc: 'Engineering Aptitude Test', icon: '⚙️' },
    { name: 'SSC', desc: 'Staff Selection Commission', icon: '📋' },
    { name: 'Railways', desc: 'RRB NTPC, Group D', icon: '🚆' },
    { name: 'Banking', desc: 'IBPS, SBI PO/Clerk', icon: '💰' },
    { name: 'Defence', desc: 'NDA, CDS, AFCAT', icon: '🎖️' }
  ];

  const companyCategories = [
    { name: 'TCS', desc: 'Tata Consultancy Services', icon: '🏢' },
    { name: 'Infosys', desc: 'Infosys Placement Prep', icon: '💻' },
    { name: 'Wipro', desc: 'Wipro Elite & Turbo Prep', icon: '🌐' },
    { name: 'Accenture', desc: 'Accenture Cognitive & Technical', icon: '📈' },
    { name: 'Cognizant', desc: 'GenC & GenC Next Prep', icon: '🚀' },
    { name: 'Capgemini', desc: 'Capgemini Analyst Prep', icon: '⚡' },
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

  const CategoryCard = ({ cat, baseUrl = '/dashboard/category', customHref }) => (
    <Link 
      href={customHref || `${baseUrl}/${encodeURIComponent(cat.name)}`}
      className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col items-center text-center relative overflow-hidden"
    >
       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors"></div>
       <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
       <h3 className="text-2xl font-black text-gray-900 mb-2">{cat.name}</h3>
       <p className="text-gray-500 font-medium text-sm mb-6">{cat.desc}</p>
       <div className="mt-auto px-6 py-2 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition flex items-center">
         Select Track <ChevronRight className="w-4 h-4 ml-1" />
       </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
           <div>
              <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs mb-3">Student Dashboard</p>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">Welcome, {userName}! 👋</h1>
              <p className="text-gray-500 mt-2 text-lg font-medium">Which career path are you crushing today?</p>
           </div>
           <Link href="/dashboard/leaderboard" className="mt-8 md:mt-0 p-5 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Trophy className="w-6 h-6 transform group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-left pr-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Global Ranking</p>
                 <p className="font-bold text-lg">Hall of Fame</p>
              </div>
           </Link>
        </div>

        {/* NEW: Analytics Dashboard Widget */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total XP Earned</p>
                 <p className="text-4xl font-black text-gray-900 tracking-tighter">4,250</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                 <Zap className="w-8 h-8" />
              </div>
           </div>
           
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Assessments Target</p>
                 <p className="text-4xl font-black text-gray-900 tracking-tighter">12 <span className="text-lg text-gray-400">/20</span></p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                 <Target className="w-8 h-8" />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Mastery Rate</p>
                 <p className="text-4xl font-black text-green-500 tracking-tighter">84%</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-8 h-8" />
              </div>
           </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-20">
          
          <section>
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                   <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-indigo-200 underline-offset-8">Competitive Exams</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {examCategories.map(cat => <CategoryCard key={cat.name} cat={cat} baseUrl="/dashboard/exam" customHref={cat.name === 'SSC' ? '/dashboard/ssc' : null} />)}
             </div>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                   <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight underline decoration-emerald-200 underline-offset-8">College Placement Prep</h2>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {companyCategories.map(cat => <CategoryCard key={cat.name} cat={cat} baseUrl="/dashboard/company" />)}
             </div>
          </section>

        </div>

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
