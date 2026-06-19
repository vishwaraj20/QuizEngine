"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertCircle, ShieldAlert, Maximize, AlertTriangle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

export default function QuizTakingPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPractice = searchParams.get('practice') === 'true';

  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anti-Cheat State
  const [hasStarted, setHasStarted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [cheatAlert, setCheatAlert] = useState(null); // Custom alert state
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const timerRef = useRef(null);
  const lastViolationTimeRef = useRef(0); // Rate-limiting cooldown for violations
  const isSubmittingRef = useRef(false);
  const startCooldownRef = useRef(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quizzes/${id}/take`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
           alert('Quiz not found');
           router.push('/dashboard');
        } else {
           setQuizInfo(data.quiz);
           setQuestions(data.questions);
           // Initialize timer if time_limit > 0 (convert mins to secs)
           if (data.quiz.time_limit > 0) {
             setTimeLeft(data.quiz.time_limit * 60);
           }
           if (isPractice) {
             setHasStarted(true);
           }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router, isPractice]);

  // Anti-Cheat Listeners
  useEffect(() => {
    if (!hasStarted || result || isPractice) return;

    let hiddenTriggered = false;

    const handleVisibilityChange = () => {
      if (startCooldownRef.current) {
        hiddenTriggered = false;
        return;
      }
      if (document.hidden) {
        hiddenTriggered = true;
      } else if (hiddenTriggered) {
        hiddenTriggered = false;
        handleViolation("Tab switching / Window minimizing detected!");
      }
    };
    
    const handleCopyPaste = (e) => {
      e.preventDefault();
      handleViolation("Copy/Paste is disabled during competitive mode.");
    };
    
    const handleContext = (e) => {
      e.preventDefault();
    };

    const handleFullscreenChange = () => {
      if (startCooldownRef.current) return;
      if (!document.fullscreenElement) {
         handleViolation("Exited fullscreen mode.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("contextmenu", handleContext);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("copy", handleCopyPaste);
        document.removeEventListener("paste", handleCopyPaste);
        document.removeEventListener("contextmenu", handleContext);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }
  }, [hasStarted, result, isPractice]);

  const handleViolation = (reason) => {
    if (isSubmittingRef.current || result || startCooldownRef.current) {
      return;
    }
    const now = Date.now();
    if (now - lastViolationTimeRef.current < 2000) {
      return; // 2 second cooldown to prevent a flurry of events from causing instant auto-submission
    }
    lastViolationTimeRef.current = now;

    setWarnings(prev => {
       const newCount = prev + 1;
       if (newCount >= 3) {
          setCheatAlert({
             title: "FATAL VIOLATION",
             message: `${reason}\n\nMaximum warnings (3/3) reached. Your quiz is terminated.`,
             fatal: true
          });
          forceSubmit();
       } else {
          setCheatAlert({
             title: `ANTI-CHEAT WARNING (${newCount}/3)`,
             message: `${reason}\n\nDo not repeat this action.`,
             fatal: false
          });
       }
       return newCount;
    });
  };

  const dismissCheatAlert = () => {
     if (!cheatAlert?.fatal) {
        setCheatAlert(null);
        
        // Cooldown during fullscreen re-entry transition
        startCooldownRef.current = true;
        setTimeout(() => {
           startCooldownRef.current = false;
        }, 3000);

        // Force them back to fullscreen if they left
        try {
           if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        } catch(e) {}
     }
  };

  // Countdown Logic
  useEffect(() => {
    if (timeLeft === null || result || !hasStarted || isPractice) return;
    
    if (timeLeft <= 0) {
      alert("Time is up! Submitting your answers automatically.");
      submitQuiz();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, result, hasStarted, isPractice]);

  const startQuiz = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
         await document.documentElement.requestFullscreen();
      }
    } catch(e) { console.error("Fullscreen blocked", e); }
    
    // Cooldown during initial fullscreen entry transition
    startCooldownRef.current = true;
    setTimeout(() => {
       startCooldownRef.current = false;
     }, 3000);

    setHasStarted(true);
    setQuestionStartTime(Date.now());
  };

  const selectOption = (opt) => {
    // Fast Answer Check: Sub-1-second answer on a brand new question is suspicious
    if (!isPractice) {
      const timeDiff = Date.now() - questionStartTime;
      if (timeDiff < 250 && !answers[questions[currentIndex].id]) {
         handleViolation("Suspiciously fast answer (Bot/Script behavior detected).");
      }
    }

    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: opt
    }));
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Exit fullscreen elegantly if permitted
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(e){}
    
    const totalTime = quizInfo.time_limit * 60;
    const timeTaken = (timeLeft !== null && !isPractice) ? totalTime - timeLeft : 0;

    try {
      let currentUserId = 1;
      let currentUserName = 'Unknown';
      const storedUser = localStorage.getItem('quiz_user');
      if (storedUser) {
         const parsed = JSON.parse(storedUser);
         currentUserId = parsed.id || 1;
         currentUserName = parsed.name || 'Unknown';
      }

      const res = await fetch(`http://localhost:5000/api/quizzes/${id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, userName: currentUserName, answers, time_taken: timeTaken })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        alert("Submit failed");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dedicated force submit for cheaters to bypass the React state lock
  const forceSubmit = async () => {
     isSubmittingRef.current = true;
     try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(e){}
     const totalTime = quizInfo.time_limit * 60;
     const timeTaken = (timeLeft !== null && !isPractice) ? totalTime - timeLeft : 0;
     let currentUserId = 1;
     let currentUserName = 'Unknown';
     const storedUser = localStorage.getItem('quiz_user');
     if (storedUser) {
        const parsed = JSON.parse(storedUser);
        currentUserId = parsed.id || 1;
        currentUserName = parsed.name || 'Unknown';
     }

     const res = await fetch(`http://localhost:5000/api/quizzes/${id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, userName: currentUserName, answers, time_taken: timeTaken })
     });
     if (res.ok) setResult(await res.json());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900">
       <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase">Initialising Secure Environment...</p>
    </div>
  );
  
  if (!quizInfo || questions.length === 0) return <div>No quiz found</div>;

  if (!hasStarted && !result) {
    return (
      <div className="min-h-screen bg-gray-900 dark:bg-blue-600 flex items-center justify-center p-6 text-center">
         <div className="max-w-lg bg-white dark:bg-slate-800 p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in duration-300">
             <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShieldAlert className="w-12 h-12" />
             </div>
             <h1 className="text-4xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white">Competitive Mode</h1>
             <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">This assessment is protected by an advanced Anti-Cheat engine. You are being monitored.</p>
             
             <ul className="text-sm font-bold text-gray-700 dark:text-gray-300 text-left space-y-4 mb-10 bg-gray-50 dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-700">
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> No tab switching or exiting fullscreen</li>
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> Copy-pasting text is strictly disabled</li>
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> Suspicious patterns (too fast) trigger alerts</li>
                <li className="flex items-center text-red-600 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700"><span className="w-2 h-2 rounded-full bg-red-600 mr-4 shrink-0"></span> 3 Warnings = Automatic Termination</li>
             </ul>
             
             <div className="flex flex-col gap-3">
                 <button 
                   onClick={startQuiz}
                   className="w-full py-5 rounded-[2rem] bg-gray-900 dark:bg-blue-600 text-white font-black hover:bg-black transition shadow-2xl shadow-gray-900/30 flex justify-center items-center hover:scale-105 active:scale-95"
                 >
                    <Maximize className="w-6 h-6 mr-3"/> Enter Fullscreen & Start
                 </button>
                 <button 
                   onClick={() => router.back()}
                   className="w-full py-4 rounded-[2rem] bg-transparent text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 transition flex justify-center items-center"
                 >
                    <ArrowLeft className="w-5 h-5 mr-2"/> Go Back
                 </button>
             </div>
         </div>
      </div>
    );
  }

  if (result) {
    const passed = (result.score / result.total) * 100 >= quizInfo.pass_percent;
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-12 shadow-2xl shadow-blue-900/10 text-center mb-12 border border-gray-100 dark:border-slate-700">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${passed ? 'bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'}`}>
             {passed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white">{passed ? "Mission Accomplished!" : "Assessment Failed"}</h1>
          <p className="text-xl text-gray-400 font-medium mb-8">Role: Candidate 001 &middot; Score Achieved</p>
          <div className="inline-flex items-center gap-10 px-10 py-5 bg-gray-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-700">
             <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Marks</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{result.score}/{result.total}</p>
             </div>
             <div className="w-px h-10 bg-gray-200 dark:bg-slate-700"></div>
             <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastery Rate</p>
                <p className="text-3xl font-black text-blue-600">{Math.round((result.score/result.total)*100)}%</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center"><AlertCircle className="w-6 h-6 mr-3 text-blue-600"/> Post-Assessment Review</h2>
          {result.review.map((item, idx) => (
            <div key={idx} className={`p-8 rounded-[2.5rem] border-2 transition hover:shadow-lg ${item.is_correct ? 'border-green-100 dark:border-green-900/50 bg-white dark:bg-slate-800' : 'border-red-100 dark:border-red-900/50 bg-white dark:bg-slate-800'}`}>
              <div className="font-extrabold text-xl mb-6 text-gray-900 dark:text-white flex items-start">
                 <span className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl mr-5 text-sm font-black shadow-sm ${item.is_correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{idx + 1}</span>
                 {item.question_text}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 pl-14 mb-8">
                <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your response</p>
                   <p className={`font-bold ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>{item.selected_option || 'No Response'}</p>
                </div>
                {!item.is_correct && (
                   <div className="p-4 bg-green-550 dark:bg-green-950/20 text-green-700 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-900/50">
                     <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Correct Key</p>
                     <p className="font-bold">{item.correct_option}</p>
                   </div>
                )}
              </div>
              
              <div className="ml-14 p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl text-sm font-medium text-blue-800 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50 italic">
                <span className="font-black uppercase text-[10px] tracking-widest block mb-2 opacity-50">Professional Rationale</span>
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => {
                 router.back();
              }} 
              className="px-12 py-4 bg-gray-100 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-[2rem] font-black hover:bg-gray-200 dark:hover:bg-slate-700 transition hover:scale-105"
            >
              Go Back
            </button>
            <button 
              onClick={() => {
                 router.push('/dashboard');
              }} 
              className="px-12 py-4 bg-gray-900 dark:bg-blue-600 text-white rounded-[2rem] font-black shadow-2xl shadow-gray-900/20 dark:shadow-blue-900/20 hover:bg-black dark:hover:bg-blue-700 transition scale-up hover:scale-105"
            >
              Explore More Quizzes
            </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* CUSTOM CHEAT WARNING MODAL */}
      {cheatAlert && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 dark:bg-blue-600/90 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border border-red-500 animate-in zoom-in duration-200">
               <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">{cheatAlert.title}</h2>
               <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 whitespace-pre-line font-medium leading-relaxed">
                 {cheatAlert.message}
               </p>
               {!cheatAlert.fatal && (
                  <button 
                     onClick={dismissCheatAlert}
                     className="w-full py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/30"
                  >
                     I Understand. Return to Quiz.
                  </button>
               )}
            </div>
         </div>
      )}

      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 items-start justify-center animate-in zoom-in-95 duration-300">
        
        {/* Main Quiz Card */}
        <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700">
          
          {/* Header with Progress and Timer */}
          <div className="p-10 pb-0 shrink-0">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-600/20">
                      {currentIndex + 1}
                   </div>
                   <div>
                      <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{quizInfo.title}</h1>
                      <div className="w-48 h-2 bg-gray-100 dark:bg-slate-900 rounded-full mt-2 overflow-hidden">
                         <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentIndex+1)/questions.length)*100}%` }}></div>
                      </div>
                   </div>
                </div>

                 {isPractice ? (
                   <div className="px-6 py-3 rounded-2xl bg-green-50 dark:bg-green-950/30 border-2 border-green-100 dark:border-green-900/50 text-green-700 dark:text-green-400 font-black flex items-center gap-2 text-xs uppercase tracking-widest shadow-sm">
                     <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                     Practice Mode
                   </div>
                 ) : (
                   timeLeft !== null && (
                     <div className="flex items-center gap-4">
                       {warnings > 0 && (
                         <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl flex items-center font-black text-xs uppercase tracking-widest animate-pulse border border-red-200 shadow-sm">
                           <AlertTriangle className="w-4 h-4 mr-2" /> {warnings}/3 Strikes
                         </div>
                       )}
                       <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border-2 transition-colors duration-500 ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
                          <Clock className="w-6 h-6" />
                          <span className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
                       </div>
                     </div>
                   )
                 )}
             </div>
          </div>

          {/* Question Area */}
          <div className="px-10 py-12">
             <h2 
                className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: q.question_text }}
             />

             <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
               {['A', 'B', 'C', 'D'].map(opt => (
                 <div 
                   key={opt}
                   onClick={() => selectOption(opt)}
                   className={`group p-6 rounded-[2rem] border-2 flex items-center cursor-pointer transition-all duration-300 
                    ${answers[q.id] === opt ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/20 shadow-lg shadow-blue-600/5 border-transparent' : 'border-gray-100 dark:border-slate-700 hover:border-blue-200 hover:bg-gray-50/50 dark:bg-slate-900/50'}
                   `}
                 >
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black mr-5 transition-all duration-300 transform group-hover:scale-110 ${answers[q.id] === opt ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                      {opt}
                   </div>
                   <span 
                     className={`text-lg transition-all ${answers[q.id] === opt ? 'text-blue-900 dark:text-blue-200 font-black' : 'text-gray-600 dark:text-gray-400 font-bold'}`}
                     dangerouslySetInnerHTML={{ __html: q[`option_${opt.toLowerCase()}`] }}
                   />
                 </div>
               ))}
             </div>
          </div>

          {/* Navigation & Submission Footer */}
          <div className="p-10 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6">
            <button 
              disabled={currentIndex === 0} 
              onClick={() => {
                  setCurrentIndex(prev => prev - 1);
                  setQuestionStartTime(Date.now());
              }}
              className="px-8 py-4 flex items-center font-black text-gray-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-widest w-full sm:w-auto justify-center"
            >
               <ArrowLeft className="w-5 h-5 mr-3" /> Previous
            </button>
            
            <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
               <button
                  onClick={() => setMarkedForReview(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className={`px-6 py-4 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest transition-all border-2 ${
                    markedForReview[q.id] 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                      : 'bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
               >
                  {markedForReview[q.id] ? '★ Marked' : '☆ Mark for Review'}
               </button>

               {currentIndex === questions.length - 1 ? (
                 <button 
                   onClick={submitQuiz} 
                   disabled={isSubmitting}
                   className={`px-10 py-4 rounded-[1.5rem] font-black shadow-2xl flex items-center transition-all ${
                     isSubmitting
                       ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                       : 'bg-gray-900 dark:bg-blue-600 text-white shadow-gray-900/20 hover:bg-black dark:hover:bg-blue-700 hover:scale-105 active:scale-95'
                   }`}
                 >
                   {isSubmitting ? "Processing..." : "Finish Attempt"} <ArrowRight className="ml-3 w-5 h-5" />
                 </button>
               ) : (
                 <>
                   <button 
                      onClick={() => setShowSubmitConfirm(true)}
                      className="px-6 py-4 rounded-[1.5rem] text-gray-400 font-black hover:text-red-500 transition-all text-xs uppercase tracking-widest hidden lg:block"
                   >
                      Submit Early
                   </button>
                   <button 
                     onClick={() => {
                        setCurrentIndex(prev => prev + 1);
                        setQuestionStartTime(Date.now());
                     }}
                     className="px-10 py-4 rounded-[1.5rem] font-black shadow-xl flex items-center transition-all bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700 hover:scale-105 active:scale-95"
                   >
                      Next <ArrowRight className="ml-3 w-5 h-5" />
                   </button>
                 </>
               )}
            </div>
          </div>

        </div>

        {/* Question Palette Sidebar */}
        <div className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 p-8 flex flex-col">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 tracking-tight flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2.5 animate-pulse"></span>
            Question Palette
          </h3>
          
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((question, idx) => {
              const isAnswered = !!answers[question.id];
              const isCurrent = currentIndex === idx;
              const isMarked = !!markedForReview[question.id];
              
              // Determine difficulty
              const diff = question.difficulty || (
                idx < questions.length * 0.4 ? 'easy' :
                idx < questions.length * 0.8 ? 'moderate' : 'hard'
              );
              
              let btnClass = "";
              if (isCurrent) {
                btnClass = "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900";
              } else if (isAnswered) {
                btnClass = "bg-green-500 text-white shadow-md shadow-green-500/20";
              } else if (diff === 'easy') {
                btnClass = "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50";
              } else if (diff === 'moderate') {
                btnClass = "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/50";
              } else {
                btnClass = "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/50";
              }

              return (
                <button
                  key={question.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setQuestionStartTime(Date.now());
                  }}
                  className={`w-9 h-9 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 relative ${btnClass}`}
                >
                  {idx + 1}
                  {isMarked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 space-y-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-lg bg-blue-600 ring-2 ring-blue-100 dark:ring-blue-900 shrink-0"></span>
              <span>Current</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-lg bg-green-500 shrink-0"></span>
                <span>Answered</span>
              </div>
              <span className="text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">{Object.keys(answers).filter(k => answers[k]).length}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-purple-500 shrink-0 border-2 border-white dark:border-slate-800"></span>
                <span className="text-purple-600 dark:text-purple-400">Marked for Review</span>
              </div>
              <span className="text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">{Object.keys(markedForReview).filter(k => markedForReview[k]).length}</span>
            </div>
            
            {(() => {
              let easy = 0, mod = 0, hard = 0;
              questions.forEach((q, idx) => {
                if (!answers[q.id]) {
                  const diff = q.difficulty || (idx < questions.length * 0.4 ? 'easy' : idx < questions.length * 0.8 ? 'moderate' : 'hard');
                  if (diff === 'easy') easy++;
                  else if (diff === 'moderate') mod++;
                  else hard++;
                }
              });
              return (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 shrink-0"></span>
                      <span className="text-emerald-700 dark:text-emerald-450">Easy (Unvisited)</span>
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">{easy}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 shrink-0"></span>
                      <span className="text-amber-700 dark:text-amber-450">Moderate (Unvisited)</span>
                    </div>
                    <span className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">{mod}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 shrink-0"></span>
                      <span className="text-rose-700 dark:text-rose-450">Hard (Unvisited)</span>
                    </div>
                    <span className="text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md">{hard}</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

      </div>
      {/* Submit Early Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 dark:bg-blue-600/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center border-4 border-white dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">Submit Early?</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">Are you sure you want to finish your attempt early? You cannot return to the quiz once submitted.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-4 rounded-xl font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                   setShowSubmitConfirm(false);
                   submitQuiz();
                }}
                className="flex-1 py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
