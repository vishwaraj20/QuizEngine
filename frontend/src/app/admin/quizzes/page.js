"use client";
import { useEffect, useState } from 'react';
import { 
  Trash2, Edit, FilePlus, Users, BarChart3, Target, X, Check, Save, 
  ChevronDown, ChevronUp, AlertTriangle, ArrowLeft, LayoutDashboard, 
  Sparkles, Code2, BookOpen, Database, Layers, Clock 
} from 'lucide-react';
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
    'UPSC', 'MPSC', 'GATE', 'SSC',
    'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC Stenographer', 'SSC CPO', 'SSC JE', 'SSC Junior Hindi Translator',
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'IBM', 'Tech Mahindra', 'HCLTech', 'Deloitte', 'KPMG', 'EY', 'PwC', 'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'JP Morgan', 'Oracle', 'Cisco', 'LTIMindtree', 'Hexaware',
    'Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'General'
  ];

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#080c14]">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-gray-500 dark:text-slate-400 font-medium tracking-widest text-[10px] uppercase font-black">Syncing Quiz Repository...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-gray-100">
      {/* Studio Lighting Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Executive Header & CMS Navigation Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
          <div>
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 hover:underline mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Student Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <Database className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Quiz Bank Repository</h1>
            </div>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
              View, edit, delete, or re-publish existing assessments across all recruitment and competitive tracks.
            </p>
          </div>

          {/* CMS Top Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700/80">
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Quiz Importer
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <Code2 className="w-4 h-4 text-purple-400" /> Coding Studio
            </Link>
            <button
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-300" /> Quiz Bank
            </button>
            <Link
              href="/dashboard/aptitude-library"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-400" /> PDF Library
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex items-center">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex justify-center items-center mr-5 shadow-inner"><Database className="w-6 h-6"/></div>
            <div>
               <p className="text-gray-400 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Active Inventory</p>
               <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.total_quizzes} <span className="text-xs font-bold text-indigo-500">Quizzes</span></p>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex items-center">
            <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex justify-center items-center mr-5 shadow-inner"><Users className="w-6 h-6"/></div>
            <div>
               <p className="text-gray-400 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Student Attempts</p>
               <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.total_attempts} <span className="text-xs font-bold text-purple-500">Tests</span></p>
            </div>
          </div>
          <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex items-center">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex justify-center items-center mr-5 shadow-inner"><Target className="w-6 h-6"/></div>
            <div>
               <p className="text-gray-400 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Mastery</p>
               <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stats.avg_score}% <span className="text-xs font-bold text-emerald-500">Score</span></p>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 dark:bg-slate-900/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-gray-100 dark:border-slate-800">
                <tr>
                  <th className="px-8 py-6">Assessment Title &amp; Category</th>
                  <th className="px-8 py-6 text-center">Volume</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-center">Tier</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/80">
                {quizzes.map(quiz => (
                  <tr key={quiz.id} className="hover:bg-indigo-500/5 transition group">
                    <td className="px-8 py-6">
                      <p className="font-black text-gray-900 dark:text-white text-lg group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition tracking-tight">{quiz.title}</p>
                      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase flex items-center mt-1 tracking-widest">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span> {quiz.category || 'NA'}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 font-bold text-xs rounded-xl tracking-wider">{quiz.questions_count} Qs</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        quiz.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xs font-bold uppercase text-gray-400 dark:text-slate-400 tracking-wider">{quiz.difficulty}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(quiz)} className="p-3 bg-gray-100 dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition shadow-sm border border-gray-200/50 dark:border-slate-700/50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeletePendingId(quiz.id)} className="p-3 bg-gray-100 dark:bg-slate-800 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition shadow-sm border border-gray-200/50 dark:border-slate-700/50">
                          <Trash2 className="w-4 h-4" />
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
             <div className="bg-white dark:bg-[#0f1623] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-500/20">
                   <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Quiz?</h3>
                <p className="text-gray-500 dark:text-slate-400 font-medium text-xs mb-8 leading-relaxed">This action is irreversible. All student progress and questions for this quiz will be permanently deleted.</p>
                <div className="flex gap-3">
                   <button onClick={() => setDeletePendingId(null)} className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition text-xs uppercase tracking-wider">Keep it</button>
                   <button onClick={() => deleteQuiz(deletePendingId)} className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition text-xs uppercase tracking-wider">Delete Live</button>
                </div>
             </div>
          </div>
        )}

        {/* FULL FEATURED EDIT MODAL */}
        {isEditModalOpen && editingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white dark:bg-[#0f1623] rounded-3xl shadow-2xl w-full max-w-4xl my-auto overflow-hidden border border-gray-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="p-8 pb-0 flex justify-between items-start shrink-0">
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-black uppercase tracking-widest rounded-full">Config ID: {editingQuiz.id}</span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Edit Quiz Module</h3>
                   </div>
                   <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-2xl transition text-gray-400"><X className="w-6 h-6"/></button>
                </div>

                {/* Tab Navigation */}
                <div className="px-8 mt-6 border-b border-gray-100 dark:border-slate-800 flex gap-8 shrink-0">
                   <button 
                    onClick={() => setEditTab('settings')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${editTab === 'settings' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400'}`}
                   >
                     Core Settings
                     {editTab === 'settings' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
                   </button>
                   <button 
                    onClick={() => setEditTab('questions')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${editTab === 'questions' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400'}`}
                   >
                     Questions ({editingQuiz.questions?.length || 0})
                     {editTab === 'questions' && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>}
                   </button>
                </div>

                {/* Modal Body - Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8">
                   {editTab === 'settings' ? (
                      <div className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Display Title</label>
                               <input required value={editingQuiz.title} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Exam Category</label>
                               <select value={editingQuiz.category || ''} onChange={e => setEditingQuiz({...editingQuiz, category: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm cursor-pointer">
                                  {editingQuiz.category && !CATEGORIES.includes(editingQuiz.category) && (
                                     <option value={editingQuiz.category}>{editingQuiz.category}</option>
                                  )}
                                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                         </div>

                         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Live Status</label>
                               <select value={editingQuiz.status} onChange={e => setEditingQuiz({...editingQuiz, status: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm cursor-pointer">
                                  <option value="Live">🟢 Active - Live</option>
                                  <option value="Draft">🟡 Pending - Draft</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Difficulty Tier</label>
                               <select value={editingQuiz.difficulty} onChange={e => setEditingQuiz({...editingQuiz, difficulty: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm cursor-pointer capitalize">
                                  <option value="easy">Easy</option>
                                  <option value="moderate">Moderate</option>
                                  <option value="hard">Hard</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Pass Threshold (%)</label>
                               <input type="number" value={editingQuiz.pass_percent} onChange={e => setEditingQuiz({...editingQuiz, pass_percent: e.target.value})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm" />
                            </div>
                            <div>
                               <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Time (Mins, 0=None)</label>
                               <input type="number" value={editingQuiz.time_limit} onChange={e => setEditingQuiz({...editingQuiz, time_limit: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 rounded-2xl p-3.5 outline-none transition font-bold text-gray-800 dark:text-gray-200 text-sm" />
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="space-y-8">
                         {editingQuiz.questions?.map((q, qIdx) => (
                            <div key={qIdx} className="p-6 bg-gray-50/50 dark:bg-slate-900/50 rounded-3xl border border-gray-200/80 dark:border-slate-800 relative group">
                               <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-xs z-10 shadow">{qIdx + 1}</div>
                               
                               <div className="mb-4">
                                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Question Text</label>
                                  <textarea 
                                    value={q.question_text} 
                                    onChange={e => {
                                        const newQs = [...editingQuiz.questions];
                                        newQs[qIdx].question_text = e.target.value;
                                        setEditingQuiz({...editingQuiz, questions: newQs});
                                    }}
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium text-gray-800 dark:text-gray-200 text-sm min-h-[80px]"
                                  />
                               </div>

                               <div className="grid md:grid-cols-2 gap-4">
                                  {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, optIdx) => (
                                     <div key={opt}>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Option {String.fromCharCode(65 + optIdx)}</label>
                                        <input 
                                          value={q[opt]} 
                                          onChange={e => {
                                            const newQs = [...editingQuiz.questions];
                                            newQs[qIdx][opt] = e.target.value;
                                            setEditingQuiz({...editingQuiz, questions: newQs});
                                          }}
                                          className={`w-full bg-white dark:bg-slate-800 border rounded-xl p-3 outline-none text-xs font-medium transition ${q.correct_option === String.fromCharCode(65 + optIdx) ? 'border-emerald-500/50 focus:ring-emerald-500 bg-emerald-500/5' : 'border-gray-200 dark:border-slate-700 focus:ring-indigo-500'}`}
                                        />
                                     </div>
                                  ))}
                               </div>

                               <div className="mt-4 flex flex-col md:flex-row gap-4">
                                  <div className="flex-1">
                                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Explanation / Rationale</label>
                                     <textarea 
                                        value={q.explanation} 
                                        onChange={e => {
                                          const newQs = [...editingQuiz.questions];
                                          newQs[qIdx].explanation = e.target.value;
                                          setEditingQuiz({...editingQuiz, questions: newQs});
                                        }}
                                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium min-h-[50px] outline-none focus:ring-2 focus:ring-indigo-500"
                                     />
                                  </div>
                                  <div className="w-32">
                                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Correct Option</label>
                                     <select 
                                        value={q.correct_option}
                                        onChange={e => {
                                          const newQs = [...editingQuiz.questions];
                                          newQs[qIdx].correct_option = e.target.value;
                                          setEditingQuiz({...editingQuiz, questions: newQs});
                                        }}
                                        className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs font-black text-emerald-400 outline-none cursor-pointer"
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
                <div className="p-6 bg-gray-50 dark:bg-slate-900/60 flex justify-end gap-3 shrink-0 border-t border-gray-100 dark:border-slate-800">
                   <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition text-xs uppercase tracking-wider">Discard</button>
                   <button 
                    onClick={handleUpdate} 
                    disabled={saveLoading}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition flex items-center text-xs uppercase tracking-wider"
                   >
                      {saveLoading ? 'Applying Changes...' : <><Save className="w-4 h-4 mr-2" /> Commit Updates</>}
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
