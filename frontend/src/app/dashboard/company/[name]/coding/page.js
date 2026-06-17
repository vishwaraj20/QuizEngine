"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code2, PlayCircle, CheckCircle2, Circle } from 'lucide-react';

export default function CodingProblemListPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.name);
  
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
    const solvedData = JSON.parse(localStorage.getItem('solved_problems') || '[]');
    setSolved(solvedData);
  }, [companyName]);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/coding-problems/company/${companyName}`);
      if (!res.ok) throw new Error('Failed to fetch coding problems');
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-xl font-bold text-gray-500">Loading Coding Challenges...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100">
                 💻
              </div>
              <div>
                 <Link href={`/dashboard/company/${encodeURIComponent(companyName)}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                    <ArrowLeft className="w-3 h-3" /> Back to {companyName} Tracks
                 </Link>
                 <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase">{companyName}</h1>
                 <p className="text-gray-500 font-medium mt-1">Technical Interview Coding Problems</p>
              </div>
           </div>
        </div>

        {problems.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
             <div className="text-6xl mb-4 opacity-50">📂</div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No problems found</h3>
             <p className="text-gray-500">We couldn't find any coding problems for {companyName} yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                  <th className="py-4 px-6 font-bold w-16 text-center">Status</th>
                  <th className="py-4 px-6 font-bold">Title</th>
                  <th className="py-4 px-6 font-bold w-32">Difficulty</th>
                  <th className="py-4 px-6 font-bold w-40 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {problems.map(prob => {
                  const isSolved = solved.includes(Number(prob.id));
                  return (
                    <tr key={prob.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-5 px-6 text-center">
                        {isSolved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <Link href={`/coding/${prob.id}`} target="_blank" className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {prob.title}
                        </Link>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                           prob.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                           prob.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {prob.difficulty || 'medium'}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <Link 
                           href={`/coding/${prob.id}`}
                           target="_blank"
                           className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                             isSolved 
                               ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                               : 'bg-gray-900 text-white hover:bg-purple-600'
                           }`}
                        >
                           {isSolved ? 'Solve Again' : 'Solve'} <PlayCircle className="w-4 h-4 ml-2" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
