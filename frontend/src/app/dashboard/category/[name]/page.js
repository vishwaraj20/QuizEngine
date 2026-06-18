"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle, BrainCircuit, ArrowLeft, Filter, Zap, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function CategoryQuizzesPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.name);
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  const pyqQuizzes = quizzes.filter(q => q.title.includes('UPSC Prelims 2')).sort((a, b) => b.title.localeCompare(a.title));
  const practiceQuizzes = quizzes.filter(q => !q.title.includes('UPSC Prelims 2'));

  const stage2Quizzes = practiceQuizzes.filter(q => 
    q.title.includes('Ethics') || 
    q.title.includes('Relations') || 
    q.title.includes('Art & Culture')
  );

  const stage3Quizzes = practiceQuizzes.filter(q => 
    q.title.includes('Stage 3') || 
    q.title.includes('Interview') || 
    q.title.includes('Personality')
  );

  const stage1Quizzes = practiceQuizzes.filter(q => 
    !stage2Quizzes.includes(q) && !stage3Quizzes.includes(q)
  );

  const paper2CSAT = stage1Quizzes.filter(q => 
    q.title.toLowerCase().includes('csat') || 
    q.title.toLowerCase().includes('reasoning') || 
    q.title.toLowerCase().includes('aptitude') || 
    q.title.toLowerCase().includes('comprehension')
  );

  const paper1GS = stage1Quizzes.filter(q => 
    !paper2CSAT.includes(q)
  );

  const categoryIcons = {
    'UPSC': '🏛️', 'MPSC': '⚖️', 'GATE': '⚙️',
    'Quantitative Aptitude': '🔢', 'Logical Reasoning': '🧩', 'Verbal Ability': '📚',
    'General': '✨'
  };

  const isCompanyCategory = categoryName.includes(' - ');
  const companyName = isCompanyCategory ? categoryName.split(' - ')[0] : null;
  const backUrl = isCompanyCategory ? `/dashboard/company/${companyName}` : '/dashboard#categories';
  const backLabel = isCompanyCategory ? `Back to ${companyName} Prep` : 'Back to Categories';

  useEffect(() => {
    fetchQuizzes();
    fetchLeaderboard();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/quizzes");
      const data = await res.json();
      if (Array.isArray(data)) {
         setQuizzes(data.filter(q => q.category === categoryName));
      } else {
         console.error("Fetch quizzes failed:", data);
         setQuizzes([]);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
     try {
       const res = await fetch("http://localhost:5000/api/leaderboard");
       const data = await res.json();
       if (Array.isArray(data)) {
          setLeaderboard(data.filter(entry => entry.category === categoryName).slice(0, 5));
       } else {
          console.error("Fetch leaderboard failed:", data);
          setLeaderboard([]);
       }
     } catch(err) { console.error(err); }
  };

  const DifficultySection = ({ difficultyLabel }) => {
    const filtered = (categoryName === 'UPSC' ? practiceQuizzes : quizzes)
      .filter(q => q.difficulty === difficultyLabel.toLowerCase());
    if (filtered.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <div className={`w-3 h-3 rounded-full animate-pulse ${
             difficultyLabel === 'Easy' ? 'bg-green-500' : 
             difficultyLabel === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'
           }`}></div>
           <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-tight uppercase text-sm tracking-[0.2em]">{difficultyLabel} Track</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(quiz => (
            <div key={quiz.id} className="bg-white dark:bg-slate-800 p-7 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-50 dark:bg-slate-900 rounded-xl group-hover:bg-blue-50 transition-colors">
                     <Zap className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    quiz.difficulty === 'hard' ? 'bg-red-50 text-red-600 border-red-100' :
                    quiz.difficulty === 'moderate' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {quiz.difficulty}
                  </span>
               </div>
               <h4 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
               
               <div className="flex items-center gap-6 mt-auto text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-400"/> {quiz.time_limit || '0'}m</div>
                  <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400"/> {quiz.pass_percent}%</div>
               </div>

               <Link href={`/quiz/${quiz.id}`} className="mt-8 w-full py-4 bg-gray-50 dark:bg-slate-900 group-hover:bg-blue-600 text-gray-700 dark:text-gray-350 group-hover:text-white rounded-2xl font-black text-sm text-center transition-all shadow-sm group-hover:shadow-blue-600/20">
                 Start Assessment
               </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const QuizCard = ({ quiz }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900/50 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full">
       <div>
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-gray-50 dark:bg-slate-950 rounded-xl shadow-inner group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
                <Zap className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
             </div>
             <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-400 capitalize">
               {quiz.difficulty}
             </span>
          </div>
          <h4 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">{quiz.title}</h4>
       </div>
       
       <div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
             <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-blue-400"/> {quiz.time_limit || '0'}m</div>
             <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-400"/> {quiz.pass_percent}%</div>
          </div>

          <Link href={`/quiz/${quiz.id}?practice=true`} className="mt-6 block w-full py-3.5 bg-gray-50 dark:bg-slate-900 group-hover:bg-blue-600 text-gray-700 dark:text-gray-350 group-hover:text-white rounded-xl font-black text-xs text-center border border-gray-100 dark:border-slate-700 group-hover:border-transparent transition-all shadow-sm">
            Start Practice
          </Link>
       </div>
    </div>
  );

  const StageSection = ({ stageLabel, sectionQuizzes }) => {
    const isStage1 = stageLabel.includes('Stage 1');
    const isStage2 = stageLabel.includes('Stage 2');
    const isStage3 = stageLabel.includes('Stage 3');

    if (isStage1) {
      if (paper1GS.length === 0 && paper2CSAT.length === 0) return null;
    } else if (sectionQuizzes.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-16 bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
        {/* Stage Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-slate-700">
           <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center text-xl font-black shadow-md ${
             isStage1 ? 'bg-blue-600 shadow-blue-500/20' : 
             isStage2 ? 'bg-purple-600 shadow-purple-500/20' : 'bg-pink-500 shadow-pink-500/20'
           }`}>
             {isStage1 ? 'Ⅰ' : isStage2 ? 'Ⅱ' : 'Ⅲ'}
           </div>
           <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{stageLabel}</h3>
              {isStage1 && <p className="text-gray-400 font-medium text-[10px] uppercase mt-0.5 tracking-wider">Objective &amp; Qualifying Papers (Held on the same day)</p>}
              {isStage2 && <p className="text-gray-400 font-medium text-[10px] uppercase mt-0.5 tracking-wider">Subjective Written Examination (Counted for Merit)</p>}
              {isStage3 && <p className="text-gray-400 font-medium text-[10px] uppercase mt-0.5 tracking-wider">Personality Assessment Board (Interview)</p>}
           </div>
        </div>

        {isStage1 ? (
          <div className="space-y-12">
             {/* Paper I: GS Section */}
             <div>
                <div className="mb-6">
                   <h4 className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">📝 Paper I: General Studies (GS)</h4>
                   <p className="text-gray-400 font-medium text-xs mt-1">100 Questions &middot; 200 Marks &middot; Decides the Cutoff. Covers History, Polity, Geography, Economy, Environment, Science, and Current Affairs.</p>
                </div>
                {paper1GS.length === 0 ? (
                   <p className="text-gray-400 text-sm font-medium italic">No GS practice tests currently active.</p>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paper1GS.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
                   </div>
                )}
             </div>

             {/* Paper II: CSAT Section */}
             <div>
                <div className="mb-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                   <h4 className="text-lg font-black text-gray-800 dark:text-gray-200 flex items-center gap-2">🧠 Paper II: Civil Services Aptitude Test (CSAT)</h4>
                   <p className="text-gray-400 font-medium text-xs mt-1">80 Questions &middot; 200 Marks &middot; Qualifying only (Requires minimum 33%). Covers Logical Reasoning, Math, and Comprehension.</p>
                </div>
                {paper2CSAT.length === 0 ? (
                   <p className="text-gray-400 text-sm font-medium italic">No CSAT mock tests currently active.</p>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {paper2CSAT.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
                   </div>
                )}
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionQuizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">Loading {categoryName} quizzes...</div>;

  const isPSC = categoryName === 'UPSC' || categoryName === 'MPSC';

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100 dark:border-slate-700">
                 {categoryIcons[categoryName] || '✨'}
              </div>
              <div>
                 <Link href={backUrl} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                    <ArrowLeft className="w-3 h-3" /> {backLabel}
                 </Link>
                 <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{categoryName}</h1>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Available modules for your preparation</p>
              </div>
           </div>

           {leaderboard.length > 0 && (
             <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-inner">
                   <Trophy className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Rank</p>
                   <p className="font-bold text-gray-900 dark:text-white">User {leaderboard[0].user_id}</p>
                </div>
             </div>
           )}
        </div>

        <div className="bg-gray-200/50 dark:bg-slate-800 h-px w-full mb-12"></div>

        {isPSC && (
          <div className="mb-16 bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 dark:bg-blue-950/10 rounded-bl-[10rem] -z-10"></div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Official Exam Scheme &amp; Pattern</h2>
                <p className="text-gray-400 font-medium text-xs">Overview of the three selection stages and marking systems</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Prelims Stage */}
              <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-blue-100 dark:hover:border-blue-900/50 transition-all flex flex-col">
                <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest mb-1">Stage 1</span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">🎯 Prelims Stage <span className="text-xs font-bold text-gray-400 normal-case">(Objective MCQs)</span></h3>
                <ul className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300 flex-grow">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">GS Paper 1</p>
                      <p className="text-gray-400 mt-0.5">100 MCQs | 200 Marks | Decides the cutoff.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">CSAT Paper 2</p>
                      <p className="text-gray-400 mt-0.5">80 MCQs | 200 Marks | Qualifying (need 33%).</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Mains Stage */}
              <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-purple-100 dark:hover:border-purple-900/50 transition-all flex flex-col">
                <span className="text-xs font-black uppercase text-purple-600 dark:text-purple-400 tracking-widest mb-1">Stage 2</span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">📝 Mains Stage <span className="text-xs font-bold text-gray-400 normal-case">(Written Descriptive)</span></h3>
                <ul className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300 flex-grow">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">Language Papers (2)</p>
                      <p className="text-gray-400 mt-0.5">English + 1 Indian Language | 300 Marks each | Qualifying (need 25%).</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">Essay Paper (1)</p>
                      <p className="text-gray-400 mt-0.5">2 Essays | 250 Marks | Counts for rank.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">General Studies (4)</p>
                      <p className="text-gray-400 mt-0.5">GS 1, GS 2, GS 3, GS 4 | 250 Marks each | Counts for rank.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">Optional Subject (2)</p>
                      <p className="text-gray-400 mt-0.5">Paper 1 + Paper 2 | 250 Marks each | Counts for rank.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Interview Stage */}
              <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-pink-100 dark:hover:border-pink-900/50 transition-all flex flex-col">
                <span className="text-xs font-black uppercase text-pink-600 dark:text-pink-400 tracking-widest mb-1">Stage 3</span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">🗣️ Interview Stage <span className="text-xs font-bold text-gray-400 normal-case">(Oral)</span></h3>
                <ul className="space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300 flex-grow">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="font-extrabold text-gray-900 dark:text-white">Personality Test</p>
                      <p className="text-gray-400 mt-0.5">No written paper | 275 Marks | Counts for rank.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {categoryName === 'UPSC' && pyqQuizzes.length > 0 && (
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Main Section Header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shadow-sm">🏛️</div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Official Exam Papers (PYQs)</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium mt-0.5 text-sm">Real previous year papers structured by stage and paper type.</p>
              </div>
            </div>

            <div className="space-y-12">
              {/* 1. PRELIMS STAGE SECTION */}
              <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">1. Prelims Stage (Official PYQs)</h3>
                    <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mt-0.5">Objective Type Multiple Choice Questions</p>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* A. GS Paper 1 */}
                  <div>
                    <h4 className="text-lg font-black text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> A. GS Paper 1
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pyqQuizzes.map(quiz => (
                        <div key={quiz.id} className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-7 rounded-[2rem] border border-indigo-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-bl-[3.5rem] pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
                          
                          <div className="relative z-10">
                            <span className="px-3 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[9px] font-black uppercase tracking-widest">Official PYQ</span>
                            <h5 className="text-xl font-black mt-4 mb-6 leading-tight tracking-tight group-hover:text-indigo-300 transition-colors">{quiz.title}</h5>
                            
                            <div className="flex items-center gap-5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                              <div className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-indigo-400"/> {quiz.time_limit || '120'}m</div>
                              <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5 text-emerald-400"/> {quiz.pass_percent}%</div>
                            </div>
                          </div>
                          
                          <Link href={`/quiz/${quiz.id}`} className="mt-4 block w-full py-3.5 bg-white/10 hover:bg-indigo-600 text-white rounded-xl font-black text-xs text-center transition-all shadow-sm group-hover:bg-indigo-600 shadow-indigo-600/10">
                            Start Official Exam
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* B. CSAT Paper 2 */}
                  <div className="pt-6 border-t border-gray-100 dark:border-slate-700">
                    <h4 className="text-lg font-black text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> B. CSAT Paper 2
                    </h4>
                    <div className="bg-gray-50/50 dark:bg-slate-900/50 p-8 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700 text-center">
                      <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">Official CSAT past papers are currently being uploaded.</p>
                      <p className="text-gray-400 text-xs mt-1">Please check back later or practice via the Stage 1 Mock section below.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MAINS STAGE SECTION */}
              <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">2. Mains Stage (Official PYQs)</h3>
                    <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mt-0.5">Written Subjective &amp; Descriptive Papers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* A. Language Paper */}
                  <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-750">
                    <h4 className="text-md font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span> A. Language Paper
                    </h4>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">Official descriptive language papers (English and Indian Languages) are under review and will be available as PDF/reference formats soon.</p>
                  </div>

                  {/* B. Essay */}
                  <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-750">
                    <h4 className="text-md font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span> B. Essay
                    </h4>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">Official essay topics and model answer worksheets will be active shortly.</p>
                  </div>

                  {/* C. General Studies */}
                  <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-750">
                    <h4 className="text-md font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span> C. General Studies
                    </h4>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">Mains General Studies 1, 2, 3, and 4 previous year papers are currently in review.</p>
                  </div>

                  {/* D. Optional */}
                  <div className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-750">
                    <h4 className="text-md font-black text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span> D. Optional
                    </h4>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">Optional subjects previous year question banks will be uploaded as modules based on request.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700 text-center">
             <BrainCircuit className="w-16 h-16 text-gray-200 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-gray-400">No quizzes available for {categoryName}</h2>
             <p className="text-gray-400 mt-2">Check back later or try another category.</p>
             <Link href={backUrl} className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20">{isCompanyCategory ? `Browse ${companyName} Modules` : 'Browse All Categories'}</Link>
          </div>
        ) : categoryName === 'UPSC' ? (
          <div className="space-y-12">
             <StageSection stageLabel="Stage 1: Preliminary Exam" sectionQuizzes={stage1Quizzes} />
             <StageSection stageLabel="Stage 2: Mains Exam" sectionQuizzes={stage2Quizzes} />
             <StageSection stageLabel="Stage 3: Personality Test (Interview)" sectionQuizzes={stage3Quizzes} />
          </div>
        ) : (
          <div className="space-y-4">
             <DifficultySection difficultyLabel="Easy" />
             <DifficultySection difficultyLabel="Moderate" />
             <DifficultySection difficultyLabel="Hard" />
          </div>
        )}

      </div>
    </div>
  );
}
