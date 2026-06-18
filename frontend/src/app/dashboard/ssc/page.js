"use client";
import Link from 'next/link';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';

const SSC_EXAMS = [
  { name: 'SSC CGL', desc: 'Combined Graduate Level', icon: '🎓' },
  { name: 'SSC CHSL', desc: 'Combined Higher Secondary Level', icon: '🏫' },
  { name: 'SSC MTS', desc: 'Multitasking Staff', icon: '👷' },
  { name: 'SSC GD', desc: 'Constable, General Duty', icon: '👮' },
  { name: 'SSC Stenographer', desc: 'Grade C and D', icon: '⌨️' },
  { name: 'SSC CPO', desc: 'SI in Delhi Police & CAPFs', icon: '🚓' },
  { name: 'SSC JE', desc: 'Junior Engineer', icon: '🏗️' },
  { name: 'SSC Junior Hindi Translator', desc: 'JHT', icon: '🗣️' }
];

export default function SSCExamsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
           <Link href="/dashboard#competitive-exams" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </Link>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center">
             <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
             SSC Exams
           </h1>
           <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-lg">Select a specific Staff Selection Commission exam to view its Previous Year Questions and Mock Tests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SSC_EXAMS.map(exam => (
            <Link 
              key={exam.name}
              href={`/dashboard/exam/${encodeURIComponent(exam.name)}`}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col items-center text-center relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors"></div>
               <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{exam.icon}</div>
               <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{exam.name}</h3>
               <p className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-6">{exam.desc}</p>
               <div className="mt-auto px-5 py-2 bg-gray-50 dark:bg-slate-900 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-full text-xs font-bold uppercase tracking-widest transition flex items-center">
                 Select <ChevronRight className="w-4 h-4 ml-1" />
               </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
