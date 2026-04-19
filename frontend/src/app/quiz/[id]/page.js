"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertCircle, ShieldAlert, Maximize, AlertTriangle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function QuizTakingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
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

  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quizzes/${id}/take`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          alert('Quiz not found');
          router.push('/');
        } else {
          setQuizInfo(data.quiz);
          setQuestions(data.questions);
          // Initialize timer if time_limit > 0 (convert mins to secs)
          if (data.quiz.time_limit > 0) {
            setTimeLeft(data.quiz.time_limit * 60);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  // Anti-Cheat Listeners
  useEffect(() => {
    if (!hasStarted || result) return;

    let hiddenTriggered = false;

    const handleVisibilityChange = () => {
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
  }, [hasStarted, result]);

  const handleViolation = (reason) => {
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
        // Force them back to fullscreen if they left
        try {
           if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        } catch(e) {}
     }
  };

  // Countdown Logic
  useEffect(() => {
    if (timeLeft === null || result || !hasStarted) return;
    
    if (timeLeft <= 0) {
      alert("Time is up! Submitting your answers automatically.");
      submitQuiz();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, result, hasStarted]);

  const startQuiz = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
         await document.documentElement.requestFullscreen();
      }
    } catch(e) { console.error("Fullscreen blocked", e); }
    setHasStarted(true);
    setQuestionStartTime(Date.now());
  };

  const selectOption = (opt) => {
    // Fast Answer Check: Sub-1-second answer on a brand new question is suspicious
    const timeDiff = Date.now() - questionStartTime;
    if (timeDiff < 800 && !answers[questions[currentIndex].id]) {
       handleViolation("Suspiciously fast answer (Bot/Script behavior detected).");
    }

    setAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id]: opt
    }));
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;
    // Exit fullscreen elegantly if permitted
    try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(e){}
    
    setIsSubmitting(true);
    
    const totalTime = quizInfo.time_limit * 60;
    const timeTaken = timeLeft !== null ? totalTime - timeLeft : 0;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, answers, time_taken: timeTaken })
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
     try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(e){}
     const totalTime = quizInfo.time_limit * 60;
     const timeTaken = timeLeft !== null ? totalTime - timeLeft : 0;
     const res = await fetch(`http://localhost:5000/api/quizzes/${id}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, answers, time_taken: timeTaken })
     });
     if (res.ok) setResult(await res.json());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
       <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
       <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Initialising Secure Environment...</p>
    </div>
  );
  
  if (!quizInfo || questions.length === 0) return <div>No quiz found</div>;

  if (!hasStarted && !result) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 text-center">
         <div className="max-w-lg bg-white p-12 rounded-[3.5rem] shadow-2xl animate-in zoom-in duration-300">
             <div className="w-24 h-24 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <ShieldAlert className="w-12 h-12" />
             </div>
             <h1 className="text-4xl font-black mb-4 tracking-tighter text-gray-900">Competitive Mode</h1>
             <p className="text-gray-500 font-medium mb-8 leading-relaxed">This assessment is protected by an advanced Anti-Cheat engine. You are being monitored.</p>
             
             <ul className="text-sm font-bold text-gray-700 text-left space-y-4 mb-10 bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> No tab switching or exiting fullscreen</li>
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> Copy-pasting text is strictly disabled</li>
                <li className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-4 shrink-0"></span> Suspicious patterns (too fast) trigger alerts</li>
                <li className="flex items-center text-red-600 mt-4 pt-4 border-t border-gray-200"><span className="w-2 h-2 rounded-full bg-red-600 mr-4 shrink-0"></span> 3 Warnings = Automatic Termination</li>
             </ul>
             
             <button 
               onClick={startQuiz}
               className="w-full py-5 rounded-[2rem] bg-gray-900 text-white font-black hover:bg-black transition shadow-2xl shadow-gray-900/30 flex justify-center items-center hover:scale-105 active:scale-95"
             >
                <Maximize className="w-6 h-6 mr-3"/> Enter Fullscreen & Start
             </button>
         </div>
      </div>
    );
  }

  if (result) {
    const passed = (result.score / result.total) * 100 >= quizInfo.pass_percent;
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-blue-900/10 text-center mb-12 border border-gray-100">
          <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner ${passed ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
             {passed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tighter text-gray-900">{passed ? "Mission Accomplished!" : "Assessment Failed"}</h1>
          <p className="text-xl text-gray-400 font-medium mb-8">Role: Candidate 001 &middot; Score Achieved</p>
          <div className="inline-flex items-center gap-10 px-10 py-5 bg-gray-50 rounded-3xl border border-gray-100">
             <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Marks</p>
                <p className="text-3xl font-black text-gray-900">{result.score}/{result.total}</p>
             </div>
             <div className="w-px h-10 bg-gray-200"></div>
             <div className="text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastery Rate</p>
                <p className="text-3xl font-black text-blue-600">{Math.round((result.score/result.total)*100)}%</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center"><AlertCircle className="w-6 h-6 mr-3 text-blue-600"/> Post-Assessment Review</h2>
          {result.review.map((item, idx) => (
            <div key={idx} className={`p-8 rounded-[2.5rem] border-2 transition hover:shadow-lg ${item.is_correct ? 'border-green-100 bg-white' : 'border-red-100 bg-white'}`}>
              <div className="font-extrabold text-xl mb-6 text-gray-900 flex items-start">
                 <span className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl mr-5 text-sm font-black shadow-sm ${item.is_correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{idx + 1}</span>
                 {item.question_text}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 pl-14 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Your response</p>
                   <p className={`font-bold ${item.is_correct ? 'text-green-600' : 'text-red-600'}`}>{item.selected_option || 'No Response'}</p>
                </div>
                {!item.is_correct && (
                   <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                     <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Correct Key</p>
                     <p className="font-bold text-green-700">{item.correct_option}</p>
                   </div>
                )}
              </div>
              
              <div className="ml-14 p-6 bg-blue-50/50 rounded-2xl text-sm font-medium text-blue-800 border border-blue-100 italic">
                <span className="font-black uppercase text-[10px] tracking-widest block mb-2 opacity-50">Professional Rationale</span>
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <button onClick={() => router.push('/')} className="px-12 py-4 bg-gray-900 text-white rounded-[2rem] font-black shadow-2xl shadow-gray-900/20 hover:bg-black transition scale-up hover:scale-105">Return to Command Centre</button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* CUSTOM CHEAT WARNING MODAL */}
      {cheatAlert && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/90 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] p-10 max-w-md w-full text-center shadow-2xl border border-red-500 animate-in zoom-in duration-200">
               <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 mb-4">{cheatAlert.title}</h2>
               <p className="text-lg text-gray-600 mb-8 whitespace-pre-line font-medium leading-relaxed">
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

      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-300">
        
        {/* Header with Progress and Timer */}
        <div className="p-10 pb-0 shrink-0">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-600/20">
                    {currentIndex + 1}
                 </div>
                 <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">{quizInfo.title}</h1>
                    <div className="w-48 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((currentIndex+1)/questions.length)*100}%` }}></div>
                    </div>
                 </div>
              </div>

               {timeLeft !== null && (
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
              )}
           </div>
        </div>

        {/* Question Area */}
        <div className="px-10 py-12">
           <h2 className="text-4xl font-black text-gray-900 mb-12 leading-[1.1] tracking-tighter">
              {q.question_text}
           </h2>

           <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
             {['A', 'B', 'C', 'D'].map(opt => (
               <div 
                 key={opt}
                 onClick={() => selectOption(opt)}
                 className={`group p-6 rounded-[2rem] border-2 flex items-center cursor-pointer transition-all duration-300 
                  ${answers[q.id] === opt ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-600/5' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50/50'}
                 `}
               >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black mr-5 transition-all duration-300 transform group-hover:scale-110 ${answers[q.id] === opt ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                    {opt}
                 </div>
                 <span className={`text-lg transition-all ${answers[q.id] === opt ? 'text-blue-900 font-black' : 'text-gray-600 font-bold'}`}>
                    {q[`option_${opt.toLowerCase()}`]}
                 </span>
               </div>
             ))}
           </div>
        </div>

        {/* Navigation & Submission Footer */}
        <div className="p-10 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            disabled={currentIndex === 0} 
            onClick={() => {
                setCurrentIndex(prev => prev - 1);
                setQuestionStartTime(Date.now());
            }}
            className="px-8 py-4 flex items-center font-black text-gray-400 hover:text-blue-600 disabled:opacity-0 transition-all text-sm uppercase tracking-widest"
          >
             <ArrowLeft className="w-5 h-5 mr-3" /> Previous
          </button>
          
          <div className="flex gap-4">
             {/* Always show Submit Quiz button if user wants to finish early, or only at the end? 
                 The user said: "before user clicking last question option submit button still of"
                 I'll make it always visible but perhaps with a different style. */}
             
             {currentIndex === questions.length - 1 ? (
               <button 
                 onClick={submitQuiz} 
                 disabled={isSubmitting}
                 className="px-10 py-4 rounded-[1.5rem] bg-gray-900 text-white font-black shadow-2xl shadow-gray-900/20 hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center"
               >
                 {isSubmitting ? "Processing..." : "Finish Attempt"} <ArrowRight className="ml-3 w-5 h-5" />
               </button>
             ) : (
               <>
                 <button 
                    onClick={() => {
                        if(confirm("Submit quiz early?")) submitQuiz();
                    }}
                    className="px-6 py-4 rounded-[1.5rem] text-gray-400 font-black hover:text-blue-600 transition-all text-xs uppercase tracking-widest"
                 >
                    Submit Early
                 </button>
                 <button 
                   onClick={() => {
                      setCurrentIndex(prev => prev + 1);
                      setQuestionStartTime(Date.now());
                   }}
                   className="px-10 py-4 rounded-[1.5rem] bg-blue-600 text-white font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 flex items-center"
                 >
                    Next Question <ArrowRight className="ml-3 w-5 h-5" />
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
