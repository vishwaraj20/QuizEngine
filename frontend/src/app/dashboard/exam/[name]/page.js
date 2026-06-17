"use client";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Award, Filter, PlayCircle, BookOpen } from 'lucide-react';

export default function ExamPrepPage() {
  const params = useParams();
  const examName = decodeURIComponent(params.name);
  
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const phases = examName === 'SSC CGL' || examName === 'SSC CHSL' || examName.startsWith('SSC') ? ['Tier 1', 'Tier 2'] : ['Prelims', 'Mains', 'Interview'];
  const QUIZ_MODES = ['PYQ Papers', 'Subject-wise', 'Topic-wise'];
  
  const [activePhase, setActivePhase] = useState(phases[0]);
  const [activeMode, setActiveMode] = useState(QUIZ_MODES[0]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [step, setStep] = useState(1);

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
    return <div className="min-h-screen flex justify-center items-center text-xl font-bold text-gray-500">Loading PYQs...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-gray-100">
                 🏛️
              </div>
              <div>
                 {step === 1 ? (
                   <Link href="/dashboard" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline mb-2">
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
                 <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-2">
                    {examName}
                    {step >= 2 && <span className="text-gray-300 text-3xl">/</span>}
                    {step >= 2 && <span className="text-3xl text-gray-500">{activePhase}</span>}
                    {step >= 3 && <span className="text-gray-300 text-3xl">/</span>}
                    {step >= 3 && <span className="text-3xl text-gray-400">{activeMode}</span>}
                 </h1>
                 <p className="text-gray-500 font-medium mt-1">Previous Year Questions & Mock Tests</p>
              </div>
           </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {phases.map(phase => (
              <button
                key={phase}
                onClick={() => handlePhaseChange(phase)}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden h-48"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[4rem] group-hover:bg-blue-600/10 transition-colors"></div>
                <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{phase}</h3>
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
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden h-48"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50/50 rounded-bl-[4rem] group-hover:bg-gray-900/5 transition-colors"></div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {idx === 0 ? '📄' : idx === 1 ? '📚' : '🎯'}
                </div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-gray-700 transition-colors">{mode}</h3>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex items-center text-gray-400 font-bold px-2">
                 <Filter className="w-5 h-5 mr-2" /> Filters:
               </div>
           
           {activeMode !== 'PYQ Papers' && (
             <div className="flex-1 w-full sm:w-auto">
               <select 
                  value={selectedSubject} 
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
                  className="w-full sm:w-48 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
                  className="w-full sm:w-64 border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
               >
                  <option value="All">All Topics</option>
                  {filterOptions.topics.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
             </div>
           )}
        </div>

        {/* Quiz Grid */}
        <h2 className="text-2xl font-black mb-6 text-gray-900 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
          {activePhase} - {activeMode}
        </h2>

        {filteredQuizzes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
             <div className="text-6xl mb-4 opacity-50">📂</div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">No tests found</h3>
             <p className="text-gray-500">We couldn't find any {activePhase} tests for the selected filters.</p>
             <button onClick={() => {setSelectedSubject('All'); setSelectedYear('All');}} className="mt-6 px-6 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100">
               Clear Filters
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-4">
                  {quiz.subject && quiz.quiz_mode !== 'PYQ Papers' && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider rounded-lg">
                      {quiz.subject}
                    </div>
                  )}
                  {(quiz.year || quiz.topic) && (
                    <div className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border border-gray-200 max-w-[150px] truncate">
                      {quiz.quiz_mode === 'Topic-wise' ? quiz.topic : quiz.year}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{quiz.title}</h3>
                
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6 mt-auto pt-4 border-t border-gray-50">
                   <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400" /> {quiz.time_limit ? `${quiz.time_limit}m` : 'No limit'}</div>
                   <div className="flex items-center"><Award className="w-4 h-4 mr-1 text-orange-400" /> {quiz.pass_percent}% pass</div>
                </div>
                
                <Link 
                   href={`/quiz/${quiz.id}`}
                   className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex justify-center items-center"
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
