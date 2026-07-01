"use client";
import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Award, Filter, PlayCircle, BookOpen } from 'lucide-react';

export default function ExamPrepPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const examName = decodeURIComponent(params.name);
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const phases = examName === 'SSC CGL' || examName === 'SSC CHSL' || examName.startsWith('SSC') ? ['Tier 1', 'Tier 2'] : ['Prelims', 'Mains', 'Interview'];
  const QUIZ_MODES = ['PYQ Papers', 'Subject-wise', 'Topic-wise'];
  
  const [activePhase, setActivePhase] = useState(searchParams.get('phase') || phases[0]);
  const [activeMode, setActiveMode] = useState(searchParams.get('mode') || QUIZ_MODES[0]);
  const [selectedSubject, setSelectedSubject] = useState(searchParams.get('subject') || 'All');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'All');
  const [selectedTopic, setSelectedTopic] = useState(searchParams.get('topic') || 'All');
  const [step, setStep] = useState(parseInt(searchParams.get('step')) || 1);

  // Sync state to URL parameters
  useEffect(() => {
    const p = new URLSearchParams();
    if (activePhase) p.set('phase', activePhase);
    if (activeMode) p.set('mode', activeMode);
    if (selectedSubject !== 'All') p.set('subject', selectedSubject);
    if (selectedYear !== 'All') p.set('year', selectedYear);
    if (selectedTopic !== 'All') p.set('topic', selectedTopic);
    p.set('step', step.toString());
    
    router.replace(`/dashboard/exam/${examName}?${p.toString()}`, { scroll: false });
  }, [activePhase, activeMode, selectedSubject, selectedYear, selectedTopic, step, examName, router]);

  useEffect(() => {
    fetchQuizzes();
  }, [examName]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/quizzes`);
      if (!res.ok) throw new Error('Failed to fetch quizzes');
      const data = await res.json();
      
      // Filter quizzes specifically for this exam category
      const examQuizzes = data.filter(q => q.category === examName);
      setQuizzes(examQuizzes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique subjects, years, and topics for the active phase & mode
  const filterOptions = useMemo(() => {
    const phaseModeQuizzes = quizzes.filter(q => (q.phase || phases[0]) === activePhase && (q.quiz_mode || 'PYQ Papers') === activeMode);
    
    // Default subjects based on exam
    const defaultSubjects = [];
    if (examName === 'UPSC' || examName === 'MPSC') {
      defaultSubjects.push('History', 'Geography', 'Polity', 'Economy', 'Science & Tech', 'Environment', 'Current Affairs', 'CSAT', 'General Studies', 'Optional');
    } else if (examName === 'GATE') {
      defaultSubjects.push('General Aptitude', 'Technical', 'Engineering Mathematics');
    } else if (examName === 'Banking') {
      defaultSubjects.push('Quantitative Aptitude', 'Reasoning', 'English Language', 'General Awareness');
    } else {
      defaultSubjects.push('General Awareness', 'Quantitative Aptitude', 'Logical Reasoning', 'English');
    }

    const defaultYears = Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString());

    const subjects = new Set(defaultSubjects);
    const years = new Set(defaultYears);
    const topics = new Set();
    
    phaseModeQuizzes.forEach(q => {
      if (q.subject) subjects.add(q.subject);
      if (q.year) years.add(q.year);
      if (q.topic) topics.add(q.topic);
    });
    
    return {
      subjects: Array.from(subjects).sort(),
      years: Array.from(years).sort((a,b) => b.localeCompare(a)), // Sort years descending
      topics: Array.from(topics).sort()
    };
  }, [quizzes, activePhase, activeMode, examName]);

  // Handle phase change to reset filters
  const handlePhaseChange = (phase) => {
    setActivePhase(phase);
    setSelectedSubject('All');
    setSelectedYear('All');
    setSelectedTopic('All');
    setStep(2);
  };
  
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setSelectedSubject('All');
    setSelectedYear('All');
    setSelectedTopic('All');
    setStep(3);
  };

  // Final filtered list
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const matchPhase = (q.phase || phases[0]) === activePhase;
      const matchMode = (q.quiz_mode || 'PYQ Papers') === activeMode;
      const matchSubject = selectedSubject === 'All' || q.subject === selectedSubject;
      const matchYear = selectedYear === 'All' || String(q.year) === String(selectedYear);
      const matchTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      return matchPhase && matchMode && matchSubject && matchYear && matchTopic;
    });
  }, [quizzes, activePhase, activeMode, selectedSubject, selectedYear, selectedTopic, examName]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-xl font-bold text-gray-500 dark:text-gray-400">Loading PYQs...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100 dark:border-slate-700">
                 🏛️
              </div>
              <div>
                 {step === 1 ? (
                   <Link href="/dashboard#competitive-exams" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                      <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                   </Link>
                 ) : step === 2 ? (
                   <button onClick={() => setStep(1)} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                      <ArrowLeft className="w-3 h-3" /> Back to Phases
                   </button>
                 ) : (
                   <button onClick={() => setStep(2)} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
                      <ArrowLeft className="w-3 h-3" /> Back to Modes
                   </button>
                 )}
                 <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase flex items-center gap-2">
                    {examName}
                    {step >= 2 && <span className="text-gray-300 text-3xl">/</span>}
                    {step >= 2 && <span className="text-3xl text-gray-500 dark:text-gray-400">{activePhase}</span>}
                    {step >= 3 && <span className="text-gray-300 text-3xl">/</span>}
                    {step >= 3 && <span className="text-3xl text-gray-400">{activeMode}</span>}
                 </h1>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Previous Year Questions & Mock Tests</p>
              </div>
           </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map(phase => (
              <button
                key={phase}
                onClick={() => handlePhaseChange(phase)}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden h-48"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors"></div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{phase}</h3>
                <p className="text-gray-400 text-sm font-medium mt-2">Select phase to view tests</p>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUIZ_MODES.map((mode, idx) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden h-48"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 dark:bg-slate-900/50 rounded-bl-[4rem] group-hover:bg-gray-900/5 transition-colors"></div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {idx === 0 ? '📄' : idx === 1 ? '📚' : '🎯'}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-gray-700 dark:text-gray-300 transition-colors">{mode}</h3>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
               <div className="flex items-center text-gray-400 font-bold px-2">
                 <Filter className="w-5 h-5 mr-2" /> Filters:
               </div>
           
           {activeMode !== 'PYQ Papers' && (
             <div className="flex-1 w-full sm:w-auto">
               <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full sm:w-64 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-900"
               >
                  <option value="All">All Subjects</option>
                  {filterOptions.subjects.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
           )}
           
           {activeMode === 'PYQ Papers' && (
             <div className="flex-1 w-full sm:w-auto">
               <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full sm:w-48 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-900"
               >
                  <option value="All">All Years</option>
                  {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
             </div>
           )}

           {activeMode === 'Topic-wise' && (
             <div className="flex-1 w-full sm:w-auto">
               <select 
                  value={selectedTopic} 
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full sm:w-64 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-900"
               >
                  <option value="All">All Topics</option>
                  {filterOptions.topics.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>
           )}
        </div>

        {/* Quiz Grid */}
        <h2 className="text-2xl font-black mb-6 text-gray-900 dark:text-white flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
          {activePhase} - {activeMode}
        </h2>

        {filteredQuizzes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-3xl p-16 text-center">
             <div className="text-6xl mb-4 opacity-50">📂</div>
             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">No tests found</h3>
             <p className="text-gray-500 dark:text-gray-400">We couldn&apos;t find any {activePhase} tests for the selected filters.</p>
              <button onClick={() => {setSelectedSubject('All'); setSelectedYear('All');}} className="mt-6 px-6 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50">
               Clear Filters
             </button>
          </div>
        ) : activeMode === 'PYQ Papers' && (examName === 'UPSC' || examName === 'MPSC') ? (
          /* ── PYQ Papers: split into GS Paper + CSAT Paper sections for UPSC/MPSC ── */
          <div className="space-y-10">
            {/* 1. GS Paper I */}
            {(() => {
              const gsQuizzes = filteredQuizzes
                .filter(q => q.subject === 'General Studies' || (q.title && q.title.toLowerCase().includes('prelims') && q.title.toLowerCase().includes('gs paper')) || (q.subject !== 'CSAT' && !q.subject?.includes('Mains') && !(q.title || '').toLowerCase().includes('csat') && !(q.title || '').toLowerCase().includes('mains')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (gsQuizzes.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">I</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">📝 Prelims GS Paper I — General Studies</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">100 Questions · 200 Marks · Decides the cutoff · {gsQuizzes.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {gsQuizzes.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 rounded-2xl border border-indigo-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider">GS</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-indigo-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 2. CSAT Paper II */}
            {(() => {
              const csatQuizzes = filteredQuizzes
                .filter(q => q.subject === 'CSAT' || (q.title && q.title.toLowerCase().includes('csat')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (csatQuizzes.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:teal-400 flex items-center justify-center font-black text-lg">II</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">🧠 Prelims CSAT Paper II — Aptitude &amp; Reasoning</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">80 Questions · 200 Marks · Qualifying (33% min) · {csatQuizzes.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {csatQuizzes.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-4 rounded-2xl border border-teal-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-teal-400 font-black uppercase tracking-wider">CSAT</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-teal-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 3. Mains GS Paper I */}
            {(() => {
              const mains1 = filteredQuizzes
                .filter(q => q.subject === 'Mains GS Paper I' || (q.title && q.title.toLowerCase().includes('mains') && q.title.toLowerCase().includes('paper 1')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (mains1.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black text-lg">M1</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">🏛️ Mains GS Paper I — History, Geography &amp; Agriculture</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">150 Questions · 150 Marks · Rajyaseva Mains · {mains1.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {mains1.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4 rounded-2xl border border-purple-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-purple-400 font-black uppercase tracking-wider">GS 1</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-purple-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 4. Mains GS Paper II */}
            {(() => {
              const mains2 = filteredQuizzes
                .filter(q => q.subject === 'Mains GS Paper II' || (q.title && q.title.toLowerCase().includes('mains') && q.title.toLowerCase().includes('paper 2')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (mains2.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg">M2</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">⚖️ Mains GS Paper II — Indian Constitution, Polity &amp; Law</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">150 Questions · 150 Marks · Rajyaseva Mains · {mains2.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {mains2.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 rounded-2xl border border-blue-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-wider">GS 2</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-blue-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 5. Mains GS Paper III */}
            {(() => {
              const mains3 = filteredQuizzes
                .filter(q => q.subject === 'Mains GS Paper III' || (q.title && q.title.toLowerCase().includes('mains') && q.title.toLowerCase().includes('paper 3')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (mains3.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg">M3</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">👥 Mains GS Paper III — Human Resource Development &amp; Human Rights</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">150 Questions · 150 Marks · Rajyaseva Mains · {mains3.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {mains3.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 p-4 rounded-2xl border border-amber-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-amber-400 font-black uppercase tracking-wider">GS 3</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-amber-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* 6. Mains GS Paper IV */}
            {(() => {
              const mains4 = filteredQuizzes
                .filter(q => q.subject === 'Mains GS Paper IV' || (q.title && q.title.toLowerCase().includes('mains') && q.title.toLowerCase().includes('paper 4')))
                .sort((a, b) => (b.year || '').localeCompare(a.year || ''));
              if (mains4.length === 0) return null;
              return (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-lg">M4</div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">📈 Mains GS Paper IV — Economy &amp; Science Tech</h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">150 Questions · 150 Marks · Rajyaseva Mains · {mains4.length} years available</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                    {mains4.map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 p-4 rounded-2xl border border-rose-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-1">
                        <span className="text-[9px] text-rose-400 font-black uppercase tracking-wider">GS 4</span>
                        <span className="text-2xl font-black tracking-tight group-hover:text-rose-300 transition-colors">{quiz.year}</span>
                        <div className="flex items-center justify-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeMode === 'PYQ Papers' ? (
          /* ── PYQ Papers: generic layout grouped by year ── */
          <div className="space-y-10">
            {(() => {
              const groupedByYear = filteredQuizzes.reduce((acc, q) => {
                const y = q.year || 'All Years';
                if (!acc[y]) acc[y] = [];
                acc[y].push(q);
                return acc;
              }, {});
              
              const sortedYears = Object.keys(groupedByYear).sort((a, b) => {
                if (a === 'All Years') return 1;
                if (b === 'All Years') return -1;
                return b.localeCompare(a); // Descending year
              });
              
              return sortedYears.map(year => (
                <div key={year} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-lg">
                      {year === 'All Years' ? '📄' : '📅'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {year === 'All Years' ? 'Miscellaneous Papers' : `${year} Papers`}
                      </h3>
                      <p className="text-gray-400 text-xs font-medium mt-0.5">{groupedByYear[year].length} papers available for this year</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {groupedByYear[year].sort((a,b) => (a.title||'').localeCompare(b.title||'', undefined, { numeric: true, sensitivity: 'base' })).map(quiz => (
                      <Link key={quiz.id} href={`/quiz/${quiz.id}`}
                        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl border border-indigo-500/20 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center justify-center text-white text-center gap-2">
                        <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider">Official PYQ</span>
                        <span className="text-sm md:text-base font-black tracking-tight group-hover:text-indigo-300 transition-colors line-clamp-3 leading-tight">{quiz.title || `${examName} Paper`}</span>
                        <div className="flex items-center justify-center gap-3 w-full mt-auto pt-3 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3"/> {quiz.questions_count || 0} Qs</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : (
          /* ── Subject-wise / Topic-wise: original card grid ── */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-slate-600 transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700/30 dark:to-slate-800/20 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-4">
                  {quiz.subject && quiz.quiz_mode !== 'PYQ Papers' && (
                    <div className="px-3 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider rounded-lg">
                      {quiz.subject}
                    </div>
                  )}
                  {(quiz.year || quiz.topic) && (
                    <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-lg border border-gray-200 dark:border-slate-700 max-w-[150px] truncate">
                      {quiz.quiz_mode === 'Topic-wise' ? quiz.topic : quiz.year}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{quiz.title}</h3>
                
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 mt-auto pt-4 border-t border-gray-50 dark:border-slate-700">
                   <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" /> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</div>
                   <div className="flex items-center"><Award className="w-4 h-4 mr-1 text-orange-400" /> {quiz.pass_percent}% pass</div>
                </div>
                
                <Link 
                   href={`/quiz/${quiz.id}`}
                   className="w-full py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex justify-center items-center"
                >
                   Start Test <PlayCircle className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
