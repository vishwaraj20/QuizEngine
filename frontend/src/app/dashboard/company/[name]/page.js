"use client";
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyTracksPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.name);

  const topicCategories = [
    { name: 'Quantitative Aptitude', desc: 'Mathematical Ability', icon: '🔢' },
    { name: 'Logical Reasoning', desc: 'Puzzles & Logic', icon: '🧩' },
    { name: 'Verbal Ability', desc: 'English & Grammar', icon: '📚' }
  ];

  const TopicCard = ({ topic }) => {
    // The final category string sent to the backend will be "Company - Topic"
    const fullCategoryName = `${companyName} - ${topic.name}`;
    return (
      <Link 
        href={`/dashboard/category/${encodeURIComponent(fullCategoryName)}`}
        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col items-center text-center relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors"></div>
         <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">{topic.icon}</div>
         <h3 className="text-2xl font-black text-gray-900 mb-2">{topic.name}</h3>
         <p className="text-gray-500 font-medium text-sm mb-6">{topic.desc}</p>
         <div className="mt-auto px-6 py-2 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition flex items-center">
           View Quizzes <ChevronRight className="w-4 h-4 ml-1" />
         </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100">
                 🏢
              </div>
              <div>
                 <Link href="/dashboard" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                    <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                 </Link>
                 <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{companyName} Prep</h1>
                 <p className="text-gray-500 font-medium mt-1">Select a track to start practicing</p>
              </div>
           </div>
        </div>

        <div className="bg-gray-200/50 h-px w-full mb-12"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
           {topicCategories.map(topic => <TopicCard key={topic.name} topic={topic} />)}
           
           <Link 
             href={`/dashboard/company/${encodeURIComponent(companyName)}/coding`}
             className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col items-center text-center relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-bl-[4rem] group-hover:bg-purple-600/10 transition-colors"></div>
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">💻</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Coding Problems</h3>
              <p className="text-gray-500 font-medium text-sm mb-6">Technical Interview Prep</p>
              <div className="mt-auto px-6 py-2 bg-gray-50 text-gray-400 group-hover:bg-purple-600 group-hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition flex items-center">
                Open Workspace <ChevronRight className="w-4 h-4 ml-1" />
              </div>
           </Link>
        </div>
      </div>
    </div>
  );
}
