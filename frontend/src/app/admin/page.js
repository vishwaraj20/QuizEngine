"use client";
import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileJson, AlertCircle, Play, Settings, Copy, Check, Sparkles, ChevronDown } from 'lucide-react';

const AI_PROMPT = `Convert my raw quiz data into a valid JSON file.

My data is below — questions, options and correct answers are in a mixed/comma format. Some may be messy or inconsistently formatted.

Your job:
1. Parse every question from my raw data
2. Identify the 4 options (label them A, B, C, D)
3. Identify the correct answer
4. Write a short explanation for why the answer is correct
5. Output ONLY the JSON — no extra text, no markdown code blocks, no explanation

Use exactly this JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": {
        "A": "option text",
        "B": "option text",
        "C": "option text",
        "D": "option text"
      },
      "correct": "B",
      "explanation": "Short explanation of why this is correct."
    }
  ]
}

Here is my raw data:
[PASTE YOUR RAW DATA HERE]`;

const MAIN_CATEGORIES = ['Competitive Exams', 'College Placement', 'Other'];
const COMPETITIVE_EXAMS = ['UPSC', 'MPSC', 'GATE', 'SSC', 'Railways', 'Banking', 'Defence'];
const PLACEMENT_COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'IBM', 'Tech Mahindra', 'HCLTech', 'Deloitte', 'KPMG', 'EY', 'PwC', 'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'JP Morgan', 'Oracle', 'Cisco', 'LTIMindtree', 'Hexaware'];
const PLACEMENT_TOPICS = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'];
const OTHER_CATEGORIES = ['General', 'Custom'];
const UPSC_SUBJECTS = ['History', 'Geography', 'Polity', 'Economy', 'Science & Tech', 'Environment', 'Current Affairs', 'CSAT', 'General Studies', 'Optional', 'General Aptitude', 'Technical'];
const EXAM_PHASES = ['Prelims', 'Mains', 'Interview'];
const SSC_PHASES = ['Tier 1', 'Tier 2'];
const SSC_EXAMS = ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC Stenographer', 'SSC CPO', 'SSC JE', 'SSC Junior Hindi Translator'];
const QUIZ_MODES = ['PYQ Papers', 'Subject-wise', 'Topic-wise'];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'moderate', label: 'Moderate', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700 border-red-200' }
];

export default function AdminUploadPage() {
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [title, setTitle] = useState("New Quiz");
  const [timeLimit, setTimeLimit] = useState(0);
  const [mainCategory, setMainCategory] = useState("Competitive Exams");
  const [subCategory, setSubCategory] = useState("UPSC");
  const [company, setCompany] = useState("TCS");
  const [topic, setTopic] = useState("Quantitative Aptitude");
  
  const [phase, setPhase] = useState("Prelims");
  const [subject, setSubject] = useState("History");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [sscExam, setSscExam] = useState("SSC CGL");
  const [quizMode, setQuizMode] = useState("PYQ Papers");
  
  useEffect(() => {
    if (subCategory === 'SSC') {
      if (!SSC_PHASES.includes(phase)) setPhase(SSC_PHASES[0]);
    } else {
      if (!EXAM_PHASES.includes(phase)) setPhase(EXAM_PHASES[0]);
    }
  }, [subCategory, phase]);
  
  const computedCategory = mainCategory === "College Placement" ? `${company} - ${topic}` : (subCategory === 'SSC' ? sscExam : subCategory);
  const [difficulty, setDifficulty] = useState("easy");
  const [passPercent, setPassPercent] = useState(50);
  const [showExplanation, setShowExplanation] = useState('after_quiz');
  
  const fileInputRef = useRef(null);

  const copyPrompt = () => {
    navigator.clipboard.writeText(AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrors([]);
      setQuizData(null);
    }
  };

  const validateFile = async () => {
    if (!file) return;
    setLoading(true);
    setErrors([]);
    setQuizData(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch("http://localhost:5000/api/admin/quiz/validate", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setErrors(data.errors || ['Validation failed']);
      } else {
        setQuizData(data.data);
      }
    } catch (err) {
      setErrors(['An error occurred while communicating with the server.']);
    } finally {
      setLoading(false);
    }
  };

  const publishQuiz = async () => {
    if (!quizData) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, time_limit: timeLimit, category: computedCategory, difficulty, pass_percent: passPercent, show_explanation: showExplanation,
          phase: mainCategory === "Competitive Exams" ? phase : null,
          subject: mainCategory === "Competitive Exams" && quizMode !== "PYQ Papers" ? subject : null,
          year: mainCategory === "Competitive Exams" && quizMode === "PYQ Papers" ? year : null,
          quiz_mode: mainCategory === "Competitive Exams" ? quizMode : null,
          topic: mainCategory === "Competitive Exams" && quizMode === "Topic-wise" ? topic : (mainCategory === "College Placement" ? topic : null),
          questions: quizData.questions
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Quiz published! ID: " + data.quizId);
        window.location.href = "/admin/quizzes";
      } else {
        alert("Publish failed: " + data.error);
      }
    } catch(err) {
      alert("Error publishing");
    } finally {
      setLoading(false);
    }
  };

  // RENDER PREVIEW IF DATA EXISTS
  if (quizData) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Review & Publish Quiz</h1>
          <div className="flex space-x-4">
            <button onClick={() => setQuizData(null)} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition shadow">Cancel</button>
            <button onClick={publishQuiz} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center hover:bg-blue-700 shadow-lg transition">
              {loading ? "Publishing..." : "Publish Quiz"} <Play className="ml-2 w-4 h-4"/>
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col space-y-4">
           <h2 className="text-xl font-bold flex items-center"><Settings className="w-5 h-5 mr-2 text-gray-400" /> Quiz Settings</h2>
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-600 mb-1">Quiz Title</label>
               <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
               <select value={mainCategory} onChange={e => {
                 setMainCategory(e.target.value);
                 if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                 else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
               }} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white mb-3">
                  {MAIN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>

               {mainCategory === "College Placement" ? (
                 <div className="flex gap-2">
                   <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
               ) : mainCategory === "Competitive Exams" ? (
                 <div className="space-y-3">
                   <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                   </select>
                   <div className="flex gap-2">
                     <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                        {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                     {subCategory === 'SSC' && (
                       <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                          {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                       </select>
                     )}
                   </div>
                   <div className="flex gap-2">
                     <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                        {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                   </div>
                   <div className="flex gap-2">
                     {quizMode !== 'PYQ Papers' && (
                       <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                          {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                     )}
                     {quizMode === 'PYQ Papers' && (
                       <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm" />
                     )}
                     {quizMode === 'Topic-wise' && (
                       <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm" />
                     )}
                   </div>
                 </div>
               ) : (
                 <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                 </select>
               )}
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 mb-1">Difficulty Level</label>
               <div className="flex space-x-3">
                 {DIFFICULTIES.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition ${difficulty === d.value ? d.color + ' border-current' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                    >{d.label}</button>
                 ))}
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 mb-1">Time Limit (mins, 0 for infinite)</label>
               <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 mb-1">Pass %</label>
               <input type="number" value={passPercent} onChange={e => setPassPercent(Number(e.target.value))} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
           </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center">
            {quizData.questions.length} Questions imported
          </h2>
          {quizData.questions.map((q, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="font-semibold text-lg text-gray-800 mb-4 flex items-start">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-lg mr-3 shrink-0">{idx + 1}</span>
                {q.question}
              </div>
              <div className="grid grid-cols-2 gap-3 pl-11 mb-4">
                {Object.keys(q.options).map(key => (
                   <div key={key} className={`p-3 border rounded-xl flex items-center ${key === q.correct ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50'}`}>
                     <span className={`w-6 h-6 flex justify-center items-center rounded-md mr-3 font-bold ${key === q.correct ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>{key}</span>
                     {q.options[key]}
                   </div>
                ))}
              </div>
              <div className="pl-11 pr-4 py-3 bg-blue-50 rounded-lg text-sm text-blue-900 border border-blue-100">
                <strong>Explanation: </strong> {q.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // UPLOAD SCREEN
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create Quiz with AI</h1>
        <p className="text-lg text-gray-500">Copy the prompt below, paste it into ChatGPT / Gemini / Claude with your raw data, then upload the JSON output.</p>
      </div>

      {/* Step 1: AI Prompt */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-500"/>Step 1: Copy this Prompt for AI</h2>
          <button
            onClick={copyPrompt}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm ${copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {copied ? <><Check className="w-4 h-4 mr-2"/>Copied!</> : <><Copy className="w-4 h-4 mr-2"/>Copy Prompt</>}
          </button>
        </div>
        <div className="bg-gray-900 text-gray-200 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-gray-700 shadow-inner">
          {AI_PROMPT}
        </div>
      </div>

      {/* Step 2: Select Category & Difficulty */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4"><Settings className="w-5 h-5 mr-2 text-blue-500"/>Step 2: Select Quiz Type & Difficulty</h2>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
           <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                <select value={mainCategory} onChange={e => {
                  setMainCategory(e.target.value);
                  if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                  else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
                }} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium mb-3">
                   {MAIN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                {mainCategory === "College Placement" ? (
                  <div className="flex gap-3">
                    <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium">
                       {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium">
                       {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ) : mainCategory === "Competitive Exams" ? (
                  <div className="space-y-3">
                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium">
                       {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <div className="flex gap-3">
                      <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm">
                         {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {subCategory === 'SSC' && (
                        <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm">
                           {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      )}
                    </div>
                      <div className="flex gap-3 mt-3 w-full">
                       <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm">
                          {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                      </div>
                      <div className="flex gap-3 mt-3 w-full">
                        {quizMode !== 'PYQ Papers' && (
                          <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm">
                           {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                        {quizMode === 'PYQ Papers' && (
                          <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm" />
                        )}
                        {quizMode === 'Topic-wise' && (
                          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium text-sm" />
                        )}
                      </div>
                  </div>
                ) : (
                  <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800 font-medium">
                     {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Difficulty Level</label>
                <div className="flex space-x-3">
                  {DIFFICULTIES.map(d => (
                     <button
                       key={d.value}
                       type="button"
                       onClick={() => setDifficulty(d.value)}
                       className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${difficulty === d.value ? d.color + ' border-current shadow-sm' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                     >{d.label}</button>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Step 3: Upload JSON */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4"><UploadCloud className="w-5 h-5 mr-2 text-purple-500"/>Step 3: Upload the AI-generated JSON</h2>
        <div 
          className="w-full bg-white border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center transition hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <UploadCloud className="w-16 h-16 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Drag JSON file here</h3>
          <p className="text-gray-500 mb-6">or click to browse from your computer</p>
          <div className="px-6 py-2 bg-gray-900 text-white rounded-full font-medium">Browse Files</div>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange} 
          />
        </div>
      </div>

      {file && (
        <div className="mb-8 w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl"><FileJson className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB &middot; {computedCategory} &middot; {difficulty}</p>
            </div>
          </div>
          <button 
             onClick={validateFile} 
             disabled={loading}
             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition"
          >
            {loading ? 'Validating...' : 'Validate & Preview'}
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mb-8 w-full bg-red-50 p-6 rounded-2xl border border-red-200">
           <h3 className="text-red-800 font-bold mb-4 flex items-center"><AlertCircle className="w-5 h-5 mr-2"/> Validation Errors</h3>
           <ul className="space-y-2">
             {errors.map((err, i) => (
                <li key={i} className="text-red-700 bg-red-100/50 px-4 py-2 rounded-lg text-sm">{err}</li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
}
