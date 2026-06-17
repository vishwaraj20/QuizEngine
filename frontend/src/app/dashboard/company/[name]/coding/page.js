"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Code2, PlayCircle } from 'lucide-react';

export default function CodingProblemListPage() {
  const params = useParams();
  const companyName = decodeURIComponent(params.name);
  
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map(prob => (
              <div key={prob.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-pink-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-4">
                   <div className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg ${
                     prob.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 
                     prob.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                   }`}>
                     {prob.difficulty || 'medium'}
                   </div>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-6 leading-tight">{prob.title}</h3>
                
                <Link 
                   href={`/coding/${prob.id}`}
                   target="_blank"
                   className="w-full mt-auto py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors flex justify-center items-center"
                >
                   Solve Problem <PlayCircle className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
