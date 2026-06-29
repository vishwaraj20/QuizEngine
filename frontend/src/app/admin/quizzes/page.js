"use client";
import { useEffect, useState } from 'react';
import { Trash2, Edit, FilePlus, Users, BarChart3, Target, X, Check, Save, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [stats, setStats] = useState({ total_quizzes: 0, total_attempts: 0, avg_score: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [deletePendingId, setDeletePendingId] = useState(null);
  const [editTab, setEditTab] = useState('settings'); // 'settings' or 'questions'

  useEffect(() => {
    fetchQuizzes();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats");
      setStats(await res.json());
    } catch(err) { console.error(err); }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/quizzes");
      const data = await res.json();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error(err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = async (quiz) => {
    try {
        const res = await fetch(`http://localhost:5000/api/admin/quizzes/${quiz.id}`);
        const fullQuiz = await res.json();
        setEditingQuiz(fullQuiz);
        setEditTab('settings');
        setIsEditModalOpen(true);
    } catch (err) { alert("Failed to fetch details"); }
  };

  const deleteQuiz = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/quizzes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQuizzes(quizzes.filter(q => q.id !== id));
        fetchStats();
        setDeletePendingId(null);
      } else {
        alert("Delete failed");
      }
    } catch(err) { console.error(err); }
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/quizzes/${editingQuiz.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuiz)
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchQuizzes();
      } else { alert("Update failed"); }
    } catch (err) { console.error(err); } finally { setSaveLoading(false); }
  };

  const CATEGORIES = [
    'UPSC', 'MPSC', 'GATE', 'SSC', 'Railways', 'Banking', 'Defence',
    'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC Stenographer', 'SSC CPO', 'SSC JE', 'SSC Junior Hindi Translator',
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'IBM', 'Tech Mahindra', 'HCLTech', 'Deloitte', 'KPMG', 'EY', 'PwC', 'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'JP Morgan', 'Oracle', 'Cisco', 'LTIMindtree', 'Hexaware',
    'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'General'
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-gray-500 dark:text-gray-400 font-medium tracking-widest text-[10px] uppercase font-black">Syncing Dashboard...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Quiz Management</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Administrative Control Panel</p>
        </div>
        <Link href="/admin" className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center hover:bg-blue-700 transition">
          <FilePlus className="w-5 h-5 mr-2" /> Upload JSON
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[
            { label: 'Inventory', value: stats.total_quizzes, icon: <FilePlus/>, color: 'text-blue-600 bg-blue-50' },
            { label: 'Usage', value: stats.total_attempts, icon: <Users/>, color: 'text-purple-600 bg-purple-50' },
            { label: 'Mastery', value: stats.avg_score + '%', icon: <Target/>, color: 'text-emerald-600 bg-emerald-50' }
        ].map((s, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-7 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center">
                <div className={`w-14 h-14 ${s.color} rounded-2xl flex justify-center items-center mr-5 shadow-inner`}>{s.icon}</div>
                <div>
                   <p className="text-gray-400 text-xs font-black uppercase tracking-widest">{s.label}</p>
                   <p className="text-3xl font-black text-gray-900 dark:text-white">{s.value}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-gray-100 dark:border-slate-700">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6 text-center">Volume</th>
                <th className="px-8 py-6 text-center">Condition</th>
                <th className="px-8 py-6 text-center">Tier</th>
                <th className="px-8 py-6 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quizzes.map(quiz => (
                <tr key={quiz.id} className="hover:bg-blue-50/20 transition group">
                  <td className="px-8 py-6">
                    <p className="font-black text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition tracking-tight">{quiz.title}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase flex items-center mt-1 tracking-widest">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span> {quiz.category || 'NA'}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-black text-[10px] rounded-lg tracking-widest">{quiz.questions_count} Q</span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${
                      quiz.status === 'Live' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{quiz.difficulty}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(quiz)} className="p-3 bg-gray-50 dark:bg-slate-900 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm border border-gray-100 dark:border-slate-700">
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button onClick={() => setDeletePendingId(quiz.id)} className="p-3 bg-gray-50 dark:bg-slate-900 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm border border-gray-100 dark:border-slate-700">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deletePendingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/80 dark:bg-slate-950/80 backdrop-blur-md">
           <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-10 max-w-sm w-full text-center shadow-2xl border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                 <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Quiz?</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-10 leading-relaxed">This action is irreversible. All student progress and questions for this quiz will be deleted.</p>
              <div className="flex gap-4">
                 <button onClick={() => setDeletePendingId(null)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-200 transition">Keep it</button>
                 <button onClick={() => deleteQuiz(deletePendingId)} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition">Delete</button>
              </div>
           </div>
        </div>
      )}

      {/* FULL FEATURED EDIT MODAL */}
      {isEditModalOpen && editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl w-full max-w-4xl my-auto overflow-hidden border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="p-8 pb-0 flex justify-between items-start shrink-0">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg">Config ID: {editingQuiz.id}</span>
                       <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 capitalize bg-gray-50 dark:bg-slate-900 px-2 py-0.5 rounded-md">Last Edited: Just now</span>
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Edit Quiz Module</h3>
                 </div>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-gray-100 dark:bg-slate-800 rounded-2xl transition text-gray-400"><X className="w-8 h-8"/></button>
              </div>

              {/* Tab Navigation */}
              <div className="px-8 mt-8 border-b border-gray-100 dark:border-slate-700 flex gap-10 shrink-0">
                 <button 
                  onClick={() => setEditTab('settings')}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${editTab === 'settings' ? 'text-blue-600' : 'text-gray-400'}`}
                 >
                   Core Settings
                   {editTab === 'settings' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></span>}
                 </button>
                 <button 
                  onClick={() => setEditTab('questions')}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${editTab === 'questions' ? 'text-blue-600' : 'text-gray-400'}`}
                 >
                   Questions ({editingQuiz.questions?.length || 0})
                   {editTab === 'questions' && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></span>}
                 </button>
              </div>

              {/* Modal Body - Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-10">
                 {editTab === 'settings' ? (
                    <div className="space-y-8">
                       <div className="grid md:grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Display Title</label>
                             <input required value={editingQuiz.title} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-lg" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Exam Category</label>
                             <select value={editingQuiz.category || ''} onChange={e => setEditingQuiz({...editingQuiz, category: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200 appearance-none cursor-pointer">
                                {editingQuiz.category && !CATEGORIES.includes(editingQuiz.category) && (
                                   <option value={editingQuiz.category}>{editingQuiz.category}</option>
                                )}
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                          </div>
                       </div>

                       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Live Status</label>
                             <select value={editingQuiz.status} onChange={e => setEditingQuiz({...editingQuiz, status: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200 appearance-none cursor-pointer">
                                <option value="Live">🟢 Active - Live</option>
                                <option value="Draft">🟡 Pending - Draft</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Difficulty Tier</label>
                             <select value={editingQuiz.difficulty} onChange={e => setEditingQuiz({...editingQuiz, difficulty: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200 appearance-none cursor-pointer capitalize">
                                <option value="easy">Easy</option>
                                <option value="moderate">Moderate</option>
                                <option value="hard">Hard</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Pass Threshold (%)</label>
                             <input type="number" value={editingQuiz.pass_percent} onChange={e => setEditingQuiz({...editingQuiz, pass_percent: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Time (Mins, 0=None)</label>
                             <input type="number" value={editingQuiz.time_limit} onChange={e => setEditingQuiz({...editingQuiz, time_limit: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] px-6 py-4 outline-none transition font-bold text-gray-800 dark:text-gray-200" />
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-12">
                       {editingQuiz.questions?.map((q, qIdx) => (
                          <div key={qIdx} className="p-8 bg-gray-50/50 dark:bg-slate-900/50 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 relative group">
                             <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-sm z-10">{qIdx + 1}</div>
                             
                             <div className="mb-6">
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Question Text</label>
                                <textarea 
                                  value={q.question_text} 
                                  onChange={e => {
                                      const newQs = [...editingQuiz.questions];
                                      newQs[qIdx].question_text = e.target.value;
                                      setEditingQuiz({...editingQuiz, questions: newQs});
                                  }}
                                  className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition font-medium text-gray-700 dark:text-gray-300 min-h-[100px]"
                                />
                             </div>

                             <div className="grid md:grid-cols-2 gap-4">
                                {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, optIdx) => (
                                   <div key={opt}>
                                      <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Option {String.fromCharCode(65 + optIdx)}</label>
                                      <input 
                                        value={q[opt]} 
                                        onChange={e => {
                                          const newQs = [...editingQuiz.questions];
                                          newQs[qIdx][opt] = e.target.value;
                                          setEditingQuiz({...editingQuiz, questions: newQs});
                                        }}
                                        className={`w-full bg-white dark:bg-slate-800 border rounded-xl p-3 outline-none text-sm font-medium transition ${q.correct_option === String.fromCharCode(65 + optIdx) ? 'border-green-400 focus:ring-green-400' : 'border-gray-100 dark:border-slate-700 focus:ring-blue-400'}`}
                                      />
                                   </div>
                                ))}
                             </div>

                             <div className="mt-6 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                   <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Explanation / Rationale</label>
                                   <textarea 
                                      value={q.explanation} 
                                      onChange={e => {
                                        const newQs = [...editingQuiz.questions];
                                        newQs[qIdx].explanation = e.target.value;
                                        setEditingQuiz({...editingQuiz, questions: newQs});
                                      }}
                                      className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-4 text-xs font-medium min-h-[60px]"
                                   />
                                </div>
                                <div className="w-32">
                                   <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Correct</label>
                                   <select 
                                      value={q.correct_option}
                                      onChange={e => {
                                        const newQs = [...editingQuiz.questions];
                                        newQs[qIdx].correct_option = e.target.value;
                                        setEditingQuiz({...editingQuiz, questions: newQs});
                                      }}
                                      className="w-full bg-green-50 border border-green-200 rounded-xl p-3 text-sm font-black text-green-700 outline-none"
                                   >
                                      {['A', 'B', 'C', 'D'].map(val => <option key={val} value={val}>{val}</option>)}
                                   </select>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50 dark:bg-slate-900 flex justify-end gap-4 shrink-0">
                 <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 font-bold rounded-2xl hover:bg-gray-100 dark:bg-slate-800 transition">Discard</button>
                 <button 
                  onClick={handleUpdate} 
                  disabled={saveLoading}
                  className="px-10 py-4 bg-gray-900 dark:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-gray-900/20 hover:bg-black transition flex items-center"
                 >
                    {saveLoading ? 'Applying Changes...' : <><Save className="w-5 h-5 mr-3" /> Commit All Updates</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
