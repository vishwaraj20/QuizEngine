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

  const categoryIcons = {
    'UPSC': '🏛️', 'MPSC': '⚖️', 'GATE': '⚙️', 'SSC': '📋',
    'Railways': '🚆', 'Banking': '💰', 'Defence': '🎖️',
    'Quantitative Aptitude': '🔢', 'Logical Reasoning': '🧩', 'Verbal Ability': '📚',
    'General': '✨'
  };

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
    const filtered = quizzes.filter(q => q.difficulty === difficultyLabel.toLowerCase());
    if (filtered.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <div className={`w-3 h-3 rounded-full animate-pulse ${
             difficultyLabel === 'Easy' ? 'bg-green-500' : 
             difficultyLabel === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'
           }`}></div>
           <h3 className="text-xl font-bold text-gray-800 tracking-tight uppercase text-sm tracking-[0.2em]">{difficultyLabel} Track</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(quiz => (
            <div key={quiz.id} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                     <Zap className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    quiz.difficulty === 'hard' ? 'bg-red-50 text-red-600' :
                    quiz.difficulty === 'moderate' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {quiz.difficulty}
                  </span>
               </div>
               <h4 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{quiz.title}</h4>
               
               <div className="flex items-center gap-6 mt-auto text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-400"/> {quiz.time_limit || '0'}m</div>
                  <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400"/> {quiz.pass_percent}%</div>
               </div>

               <Link href={`/quiz/${quiz.id}`} className="mt-8 w-full py-4 bg-gray-50 group-hover:bg-blue-600 text-gray-700 group-hover:text-white rounded-2xl font-black text-sm text-center transition-all shadow-sm group-hover:shadow-blue-600/20">
                 Start Assessment
               </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading {categoryName} quizzes...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100">
                 {categoryIcons[categoryName] || '✨'}
              </div>
              <div>
                 <Link href="/dashboard" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                    <ArrowLeft className="w-3 h-3" /> Back to Categories
                 </Link>
                 <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{categoryName}</h1>
                 <p className="text-gray-500 font-medium mt-1">Available modules for your preparation</p>
              </div>
           </div>

           {leaderboard.length > 0 && (
             <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-inner">
                   <Trophy className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Top Rank</p>
                   <p className="font-bold text-gray-900">User {leaderboard[0].user_id}</p>
                </div>
             </div>
           )}
        </div>

        <div className="bg-gray-200/50 h-px w-full mb-12"></div>

        {quizzes.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-dashed border-gray-200 text-center">
             <BrainCircuit className="w-16 h-16 text-gray-200 mx-auto mb-6" />
             <h2 className="text-2xl font-black text-gray-400">No quizzes available for {categoryName}</h2>
             <p className="text-gray-400 mt-2">Check back later or try another category.</p>
             <Link href="/dashboard" className="mt-8 inline-block px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20">Browse All Categories</Link>
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
