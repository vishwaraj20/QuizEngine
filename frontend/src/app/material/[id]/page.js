'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function MaterialPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/api/quizzes/${id}/take`);
        const data = await res.json();
        
        if (data.error) {
            setError(data.error);
            setLoading(false);
            return;
        }
        
        setQuiz(data.quiz);
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch material:", err);
        setError("Failed to load material.");
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <BookOpen className="w-12 h-12 text-blue-300 mb-4 animate-bounce" />
          <p className="text-gray-500 font-bold">Loading Material...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
        <h1 className="text-3xl font-black text-gray-900 mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-500 mb-8 max-w-md">{error || 'Could not find this material.'}</p>
        <Link href="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/20">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <Link href={`/dashboard/category/${encodeURIComponent(quiz.category)}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Back to {quiz.category}
             </Link>
             <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{quiz.title}</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-bold">
             <BookOpen className="w-4 h-4" /> Question Bank
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mt-8">
        <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/80 dark:border-slate-800/80 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 pb-6 border-b border-gray-100 dark:border-slate-700/80 relative z-10 flex items-center justify-between">
             <span>This material contains <strong>{questions.length}</strong> practice questions and solutions.</span>
             <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">Solutions Included</span>
          </p>

          <div className="space-y-12 relative z-10">
             {questions.map((q, index) => {
                const ans = (q.correct_option || '').trim().toUpperCase();
                return (
                 <div key={q.id} className="group">
                    <div className="flex gap-5">
                       <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-black rounded-2xl flex items-center justify-center text-base shadow-sm group-hover:scale-110 transition-transform">
                          {index + 1}
                       </div>
                       <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed whitespace-pre-wrap">
                             {q.question_text}
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                             <div className={`p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 transition-all ${
                               ans === 'A' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm ring-1 ring-emerald-500/30' : 'border-gray-200 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 font-medium'
                             }`}>
                                <div><span className={`font-black mr-2 ${ans === 'A' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>A</span> {q.option_a}</div>
                                {ans === 'A' && <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">✓ Correct</span>}
                             </div>

                             <div className={`p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 transition-all ${
                               ans === 'B' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm ring-1 ring-emerald-500/30' : 'border-gray-200 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 font-medium'
                             }`}>
                                <div><span className={`font-black mr-2 ${ans === 'B' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>B</span> {q.option_b}</div>
                                {ans === 'B' && <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">✓ Correct</span>}
                             </div>

                             {q.option_c && (
                               <div className={`p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 transition-all ${
                                 ans === 'C' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm ring-1 ring-emerald-500/30' : 'border-gray-200 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 font-medium'
                               }`}>
                                  <div><span className={`font-black mr-2 ${ans === 'C' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>C</span> {q.option_c}</div>
                                  {ans === 'C' && <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">✓ Correct</span>}
                               </div>
                             )}

                             {q.option_d && (
                               <div className={`p-4 rounded-2xl border text-sm flex items-start justify-between gap-3 transition-all ${
                                 ans === 'D' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-950 dark:text-emerald-100 font-bold shadow-sm ring-1 ring-emerald-500/30' : 'border-gray-200 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 font-medium'
                               }`}>
                                  <div><span className={`font-black mr-2 ${ans === 'D' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>D</span> {q.option_d}</div>
                                  {ans === 'D' && <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">✓ Correct</span>}
                               </div>
                             )}
                          </div>

                          {q.explanation && (
                            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border border-blue-500/20 dark:border-blue-400/20 text-gray-700 dark:text-gray-300 text-sm leading-relaxed shadow-sm">
                              <div className="flex items-center gap-2 font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider text-xs mb-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Step-by-Step Explanation
                              </div>
                              {q.explanation}
                            </div>
                          )}
                       </div>
                    </div>
                    
                    {index !== questions.length - 1 && (
                      <div className="h-px w-full bg-gray-100 dark:bg-slate-700/50 mt-12"></div>
                    )}
                 </div>
                );
             })}
          </div>
          
          <div className="mt-16 text-center">
            <div className="w-16 h-1 bg-gray-200 dark:bg-slate-700 mx-auto rounded-full mb-8"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">End of Study Material</p>
          </div>
        </div>
      </div>
    </div>
  );
}
