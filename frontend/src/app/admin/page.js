"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, FileJson, AlertCircle, Play, Settings, Copy, Check, Sparkles, 
  ChevronDown, LayoutDashboard, BrainCircuit, Code2, BookOpen, Database, 
  TrendingUp, Users, ShieldCheck, ArrowRight, PlusCircle, Layers, FileText, 
  CheckCircle2, Zap, ArrowLeft, Trophy, Clock
} from 'lucide-react';
import Link from 'next/link';

const AI_PROMPT = `Convert my raw quiz data into valid JSON format directly in your response text (do not create or attach a file).
My data below may be messy, inconsistently formatted, or contain mixed separators (commas, dashes, newlines, numbering etc.). Some questions may also have images/figures/diagrams that are not visible in this text.
Your job:

Parse every question from my raw data
Identify the 4 options and label them A, B, C, D
Identify the correct answer
Write a short explanation for why the answer is correct
If a question is based on a reading comprehension passage or a common paragraph, YOU MUST include the FULL text of that passage inside the 'question' field BEFORE the actual question text for EVERY question that relies on it. Separate the passage and the question with '<br><br>'. Keep the entire string on one line by using '\\n' for newlines and escaping quotes if necessary.
If a question has an image, add this placeholder inside the question field: <br><br><img src='IMAGE_PENDING' width='100%' style='border-radius:8px;' data-desc='DESCRIBE_WHAT_IMAGE_SHOWS_HERE' />
If a question has no image, do NOT add any image tag
After the JSON, add a plain text section titled "IMAGE_REQUIRED_LIST:" that lists every question ID that needs an image, with a one-line description of what the image shows. Example:

IMAGE_REQUIRED_LIST:
Q2 - Figure series showing shapes (triangles, circles) changing across 5 boxes
Q3 - Two dice positions showing faces with numbers 3,7,8,2,9,4
Q4 - A geometric figure made of overlapping squares

Output the JSON first, then the IMAGE_REQUIRED_LIST — nothing else

Use exactly this format:
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
    },
    {
      "id": 2,
      "question": "[FULL PASSAGE TEXT GOES HERE IF APPLICABLE]<br><br>Actual question text here?",
      "options": {
        "A": "option text",
        "B": "option text",
        "C": "option text",
        "D": "option text"
      },
      "correct": "A",
      "explanation": "Short explanation."
    }
  ]
}

IMAGE_REQUIRED_LIST:
Q2 - description here
Q4 - description here
Rules:

Fix any spelling/formatting issues in questions and options
If correct answer is given as a number (1,2,3,4), map it to (A,B,C,D)
Never skip a question even if formatting is unclear — make your best guess
For image questions, always write the full question text that exists, just add the IMAGE_PENDING placeholder
Do not add any text before the JSON or between the JSON and IMAGE_REQUIRED_LIST

Here is my raw data:
[PASTE YOUR RAW DATA HERE]`;

const CODING_AI_PROMPT = `You are an expert technical content parser. Your task is to convert raw, unstructured coding problem descriptions into a highly structured, valid JSON file.

Follow these strict parsing instructions:
1. **Title**: Extract a clear, concise title for the problem.
2. **Difficulty**: Infer the difficulty level ('easy', 'medium', or 'hard') based on the problem complexity if not explicitly stated.
3. **Description**: 
   - Format the entire problem statement into a clean, readable description.
   - Include the background story, task, input format, output format, and constraints clearly.
   - Use plain text with clear line breaks (use \\n for line breaks).
4. **Starter Code**: 
   - Generate a functional Java boilerplate (public class Main { public static void main(String[] args) { ... } }).
   - Include necessary imports (e.g., java.util.Scanner).
   - Provide a basic structure that reads the exact input format specified in the problem statement.
5. **Test Cases**:
   - Extract all examples provided in the raw text into a "test_cases" array.
   - For each test case, strictly extract the raw "input" and "expected_output" strings.
   - Ensure the input string perfectly matches the expected input format (e.g., handling newlines exactly as the problem specifies).
6. **Output Requirements**:
   - Output ONLY the raw JSON object.
   - Do NOT wrap the JSON in markdown code blocks (\`\`\`json).
   - Do NOT include any conversational text or explanations.

Use exactly this JSON schema:
{
  "problems": [
    {
      "title": "Cruise Party Maximum Guests",
      "difficulty": "medium",
      "description": "Full formatted problem description including constraints...",
      "starter_code": "import java.util.Scanner;\\n\\npublic class Main {\\n    public static void main(String[] args) {\\n        Scanner sc = new Scanner(System.in);\\n        // Write your code here\\n    }\\n}",
      "test_cases": [
        {
          "input": "5\\n7\\n0\\n5\\n1\\n3\\n1\\n2\\n1\\n3\\n4",
          "expected_output": "8"
        }
      ]
    }
  ]
}

Here is my raw data to parse:
[PASTE YOUR RAW DATA HERE]`;

const MAIN_CATEGORIES = ['Competitive Exams', 'College Placement', 'Other'];
const COMPETITIVE_EXAMS = ['UPSC', 'MPSC', 'GATE', 'SSC'];
const PLACEMENT_COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'IBM', 'Tech Mahindra', 'HCLTech', 'Deloitte', 'KPMG', 'EY', 'PwC', 'Amazon', 'Microsoft', 'Google', 'Goldman Sachs', 'JP Morgan', 'Oracle', 'Cisco', 'LTIMindtree', 'Hexaware'];
const PLACEMENT_TOPICS = ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'];
const OTHER_CATEGORIES = ['General', 'Custom'];
const UPSC_SUBJECTS = ['History', 'Geography', 'Polity', 'Economy', 'Science & Tech', 'Environment', 'Current Affairs', 'CSAT', 'General Studies', 'Optional', 'General Aptitude', 'Technical'];
const EXAM_PHASES = ['Prelims', 'Mains', 'Interview'];
const SSC_PHASES = ['Tier 1', 'Tier 2'];
const SSC_EXAMS = ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC Stenographer', 'SSC CPO', 'SSC JE', 'SSC Junior Hindi Translator'];
const QUIZ_MODES = ['PYQ Papers', 'Subject-wise', 'Topic-wise'];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { value: 'moderate', label: 'Moderate', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { value: 'hard', label: 'Hard', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
];

export default function AdminUploadPage() {
  const [cmsTab, setCmsTab] = useState('overview'); // 'overview', 'import', 'coding'
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadMode, setUploadMode] = useState('quiz'); // 'quiz' or 'coding'
  
  const [pastedJson, setPastedJson] = useState("");
  const [inputType, setInputType] = useState('file'); // 'file' or 'paste'
  
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
    navigator.clipboard.writeText(uploadMode === 'coding' ? CODING_AI_PROMPT : AI_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setInputType('file');
      setErrors([]);
      setQuizData(null);
    }
  };

  const validateFile = async () => {
    if (inputType === 'file' && !file) return;
    if (inputType === 'paste' && !pastedJson.trim()) return;
    
    setLoading(true);
    setErrors([]);
    setQuizData(null);
    
    const formData = new FormData();
    if (inputType === 'file') {
       formData.append('file', file);
    } else {
       const blob = new Blob([pastedJson], { type: 'application/json' });
       formData.append('file', blob, 'pasted.json');
    }
    
    const endpoint = uploadMode === 'coding' ? "http://localhost:5000/api/admin/coding-problems/validate" : "http://localhost:5000/api/admin/quiz/validate";
    try {
      const res = await fetch(endpoint, {
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
    
    if (uploadMode === 'coding') {
      try {
        const res = await fetch("http://localhost:5000/api/admin/coding-problems", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problems: quizData.problems,
            company: company
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Coding problems published successfully!");
          window.location.href = `/dashboard/company/${company}/coding`;
        } else {
          alert("Publish failed: " + data.error);
        }
      } catch(err) {
        alert("Error publishing");
      } finally {
        setLoading(false);
      }
      return;
    }

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
        alert("Quiz published successfully! ID: " + data.quizId);
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
      <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-gray-100">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Review &amp; Publish {uploadMode === 'coding' ? 'Coding Problems' : 'Quiz'}</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Verify all parsed options, explanations, and test cases before pushing live.</p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setQuizData(null)} className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-gray-300 dark:hover:bg-slate-700 transition">Cancel</button>
              <button onClick={publishQuiz} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition">
                {loading ? "Publishing..." : "Publish Live"} <Play className="ml-2 w-4 h-4"/>
              </button>
            </div>
          </div>
          
          {/* Settings Panel */}
          <div className="p-8 bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/80 dark:border-slate-800/80 space-y-6">
             <h2 className="text-xl font-black flex items-center"><Settings className="w-5 h-5 mr-2 text-indigo-500" /> Assessment Configuration</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Assessment Title</label>
                 <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Category Pillar</label>
                 <select value={mainCategory} onChange={e => {
                   setMainCategory(e.target.value);
                   if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                   else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
                 }} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none mb-3">
                    {MAIN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                 </select>

                 {mainCategory === "College Placement" ? (
                   <div className="flex gap-3">
                     <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                        {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                        {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                     </select>
                   </div>
                 ) : mainCategory === "Competitive Exams" ? (
                   <div className="space-y-3">
                     <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                        {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                     </select>
                     <div className="flex gap-3">
                       <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                          {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                       </select>
                       {subCategory === 'SSC' && (
                         <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                            {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                         </select>
                       )}
                     </div>
                     <div className="flex gap-3">
                       <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                          {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                     </div>
                     <div className="flex gap-3">
                       {quizMode !== 'PYQ Papers' && (
                         <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                            {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       )}
                       {quizMode === 'PYQ Papers' && (
                         <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                       )}
                       {quizMode === 'Topic-wise' && (
                         <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
                       )}
                     </div>
                   </div>
                 ) : (
                   <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none">
                      {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                   </select>
                 )}
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Difficulty Tier</label>
                 <div className="flex space-x-3">
                   {DIFFICULTIES.map(d => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setDifficulty(d.value)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition ${difficulty === d.value ? d.color + ' border-current shadow-md' : 'bg-gray-50 dark:bg-slate-900/60 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800'}`}
                      >{d.label}</button>
                   ))}
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Time Limit (mins, 0 for infinite)</label>
                 <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Passing Threshold %</label>
                 <input type="number" value={passPercent} onChange={e => setPassPercent(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" />
               </div>
             </div>
          </div>

          {uploadMode === 'coding' ? (
             <div className="space-y-6">
               <h2 className="text-2xl font-black tracking-tight flex items-center">
                 <Code2 className="w-6 h-6 mr-2 text-indigo-500" /> {quizData.problems?.length} Coding Problems Imported
               </h2>
               {quizData.problems?.map((p, idx) => (
                 <div key={idx} className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
                   <div className="font-black text-xl text-gray-900 dark:text-white mb-2">{idx + 1}. {p.title}</div>
                   <div className="mb-4">
                     <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 mr-2">{p.difficulty}</span>
                   </div>
                   <div className="text-sm text-gray-600 dark:text-slate-300 mb-6 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-gray-100 dark:border-slate-800">{p.description}</div>
                   <div className="bg-gray-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs whitespace-pre-wrap mb-6 border border-slate-800 overflow-auto">
                     {p.starter_code}
                   </div>
                   <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-gray-400">Verified Test Cases ({p.test_cases?.length})</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {p.test_cases?.slice(0, 2).map((tc, tcIdx) => (
                       <div key={tcIdx} className="bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl text-xs font-mono whitespace-pre-wrap">
                         <div className="text-gray-400 text-[10px] uppercase font-bold mb-1">Input:</div>
                         <div className="mb-3 text-white font-bold">{tc.input}</div>
                         <div className="text-gray-400 text-[10px] uppercase font-bold mb-1">Expected Output:</div>
                         <div className="text-emerald-400 font-bold">{tc.expected_output}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="space-y-6">
               <h2 className="text-2xl font-black tracking-tight flex items-center">
                 <CheckCircle2 className="w-6 h-6 mr-2 text-emerald-500" /> {quizData.questions?.length} Questions Verified
               </h2>
            {quizData.questions.map((q, idx) => (
              <div key={idx} className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
                <div className="font-bold text-base text-gray-900 dark:text-white mb-6 flex items-start">
                  <span className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 w-8 h-8 flex items-center justify-center rounded-xl mr-3 shrink-0 font-black text-sm">{idx + 1}</span>
                  <div dangerouslySetInnerHTML={{ __html: q.question }} className="leading-relaxed mt-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11 mb-6">
                  {Object.keys(q.options).map(key => (
                     <div key={key} className={`p-4 border rounded-2xl flex items-center transition ${key === q.correct ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold' : 'bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800/80'}`}>
                       <span className={`w-7 h-7 flex justify-center items-center rounded-xl mr-3 font-black text-xs ${key === q.correct ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>{key}</span>
                       <div dangerouslySetInnerHTML={{ __html: q.options[key] }} />
                     </div>
                  ))}
                </div>
                <div className="pl-11 pr-5 py-4 bg-indigo-500/10 rounded-2xl text-xs text-indigo-300 border border-indigo-500/20 flex gap-2 leading-relaxed">
                  <strong className="text-indigo-400 uppercase tracking-widest shrink-0">Explanation: </strong> <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-gray-100">
      {/* Studio Lighting Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Executive Header & CMS Navigation Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
          <div>
            <Link href="/dashboard" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 hover:underline mb-3 uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" /> Back to Student Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Enterprise CMS Suite</h1>
            </div>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm font-medium">
              Control center for question banks, IT placement tracks, AI question generation, and study material libraries.
            </p>
          </div>

          {/* CMS Top Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-gray-200 dark:border-slate-700/80">
            <button
              onClick={() => setCmsTab('overview')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsTab === 'overview' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => { setCmsTab('import'); setUploadMode('quiz'); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsTab === 'import' && uploadMode === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Quiz Importer
            </button>
            <button
              onClick={() => { setCmsTab('coding'); setUploadMode('coding'); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                cmsTab === 'coding' || (cmsTab === 'import' && uploadMode === 'coding')
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4 text-purple-400" /> Coding Studio
            </button>
            <Link
              href="/admin/quizzes"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <Database className="w-4 h-4 text-emerald-400" /> Quiz Bank
            </Link>
            <Link
              href="/dashboard/aptitude-library"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4 text-blue-400" /> PDF Library
            </Link>
          </div>
        </div>

        {/* TAB 1: CMS DASHBOARD OVERVIEW */}
        {cmsTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Total Question Bank</p>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-black tracking-tight">3,450+ <span className="text-xs font-bold text-indigo-500">Qs</span></p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Verified across 15 IT placement companies</p>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Active Tracks</p>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-black tracking-tight">13 <span className="text-xs font-bold text-emerald-500">Tracks</span></p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">TCS, Accenture, Wipro, Infosys &amp; more</p>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">Study Library PDFs</p>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-black tracking-tight">98 <span className="text-xs font-bold text-blue-500">Docs</span></p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">RS Aggarwal, Verbal Reasoning &amp; PYQs</p>
                </div>
              </div>

              <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-7 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400">AI Engine Status</p>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black tracking-tight text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span> Online &amp; Ready
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">GPT-4 / Claude JSON Parser Active</p>
                </div>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight mb-6">CMS Quick Control Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div 
                  onClick={() => { setCmsTab('import'); setUploadMode('quiz'); }}
                  className="p-7 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-[#0f1623] to-slate-900/40 border border-indigo-500/30 hover:border-indigo-500/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">AI Quiz Importer</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      Paste messy raw text, exam papers, or PDFs. Our AI engine automatically converts them into structured JSON quizzes with explanations and image tagging.
                    </p>
                  </div>
                  <div className="text-indigo-400 font-bold text-xs flex items-center gap-2 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                    Launch AI Importer <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div 
                  onClick={() => { setCmsTab('coding'); setUploadMode('coding'); }}
                  className="p-7 rounded-3xl bg-gradient-to-br from-purple-900/40 via-[#0f1623] to-slate-900/40 border border-purple-500/30 hover:border-purple-500/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Coding Problem Studio</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      Upload and manage technical coding interview problems, Java/Python boilerplate code, and verification test cases for company rounds.
                    </p>
                  </div>
                  <div className="text-purple-400 font-bold text-xs flex items-center gap-2 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                    Open Coding Studio <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <Link 
                  href="/admin/quizzes"
                  className="p-7 rounded-3xl bg-gradient-to-br from-emerald-900/40 via-[#0f1623] to-slate-900/40 border border-emerald-500/30 hover:border-emerald-500/80 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">Quiz Bank Manager</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      View, edit, delete, or re-publish existing assessments across UPSC, GATE, SSC, and College Placement categories.
                    </p>
                  </div>
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-2 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                    Manage Question Bank <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

              </div>
            </div>

            {/* Recent CMS Activity Feed */}
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
              <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Recent Content Management Activity
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">✓</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">TCS Part 1-6 Verified Answer Banks Updated</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Added 6 backend verification scripts with step-by-step mathematical solutions.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Just now</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">📚</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">RS Aggarwal &amp; Verbal Reasoning PDF Books Synced</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Integrated full placement textbooks into the Aptitude Library.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Today</span>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">🏢</div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Accenture Placement Papers &amp; Study Materials Added</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">96 reference files and previous year question papers uploaded.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400">Yesterday</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2 & 3: AI QUIZ IMPORTER & CODING STUDIO */}
        {(cmsTab === 'import' || cmsTab === 'coding') && (
          <div className="space-y-10">
            
            {/* Upload Mode Toggle */}
            <div className="flex justify-center">
              <div className="bg-gray-200 dark:bg-slate-800/80 p-1.5 rounded-2xl flex border border-gray-300/50 dark:border-slate-700">
                <button 
                  onClick={() => { setUploadMode('quiz'); setCmsTab('import'); }}
                  className={`px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${uploadMode === 'quiz' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> MCQ Quiz Importer
                </button>
                <button 
                  onClick={() => {
                    setUploadMode('coding');
                    setCmsTab('coding');
                    if (mainCategory === 'Competitive Exams') {
                      setMainCategory('College Placement');
                      setCompany(PLACEMENT_COMPANIES[0]);
                    }
                  }}
                  className={`px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${uploadMode === 'coding' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Code2 className="w-4 h-4 text-purple-300" /> Coding Problem Studio
                </button>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Create {uploadMode === 'coding' ? 'Coding Problems' : 'MCQ Quizzes'} with AI</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">Copy the prompt below, paste it into ChatGPT, Gemini, or Claude along with your messy raw question text, then upload or paste the clean JSON output.</p>
            </div>

            {/* Step 1: AI Prompt */}
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-amber-400"/>Step 1: Copy this AI Parsing Prompt</h3>
                <button
                  onClick={copyPrompt}
                  className={`flex items-center px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm ${copied ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-gray-900 dark:bg-indigo-600 text-white hover:bg-gray-800 dark:hover:bg-indigo-500 shadow-indigo-600/20'}`}
                >
                  {copied ? <><Check className="w-4 h-4 mr-2"/>Copied to Clipboard!</> : <><Copy className="w-4 h-4 mr-2"/>Copy AI Prompt</>}
                </button>
              </div>
              <div className="bg-gray-950 text-emerald-400 rounded-2xl p-6 font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-slate-800 shadow-inner">
                {uploadMode === 'coding' ? CODING_AI_PROMPT : AI_PROMPT}
              </div>
            </div>

            {/* Step 2: Select Category & Difficulty */}
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center mb-6"><Settings className="w-5 h-5 mr-2 text-indigo-500"/>Step 2: Assessment Category &amp; Tier</h3>
               <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Category Pillar</label>
                    <select value={mainCategory} onChange={e => {
                      setMainCategory(e.target.value);
                      if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                      else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
                    }} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm mb-3">
                       {MAIN_CATEGORIES.filter(cat => uploadMode === 'quiz' || cat !== 'Competitive Exams').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    {mainCategory === "College Placement" ? (
                      <div className="flex gap-3">
                        <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                           {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {uploadMode === 'quiz' && (
                          <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                             {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        )}
                      </div>
                    ) : mainCategory === "Competitive Exams" ? (
                      <div className="space-y-3">
                        <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                           {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                        </select>
                        <div className="flex gap-3">
                          <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                             {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          {subCategory === 'SSC' && (
                            <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                               {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                          )}
                        </div>
                          <div className="flex gap-3 mt-3 w-full">
                           <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                              {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                           </select>
                          </div>
                          <div className="flex gap-3 mt-3 w-full">
                            {quizMode !== 'PYQ Papers' && (
                              <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                               {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            )}
                            {quizMode === 'PYQ Papers' && (
                              <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm" />
                            )}
                            {quizMode === 'Topic-wise' && (
                              <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm" />
                            )}
                          </div>
                      </div>
                    ) : (
                      <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-bold text-sm">
                         {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mb-2">Difficulty Tier</label>
                    <div className="flex space-x-3">
                      {DIFFICULTIES.map(d => (
                         <button
                           key={d.value}
                           type="button"
                           onClick={() => setDifficulty(d.value)}
                           className={`flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider border transition ${difficulty === d.value ? d.color + ' border-current shadow-md' : 'bg-gray-50 dark:bg-slate-900/60 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                         >{d.label}</button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* Step 3: Input JSON */}
            <div className="bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-8 rounded-3xl border border-gray-200/80 dark:border-slate-800/80 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center"><UploadCloud className="w-5 h-5 mr-2 text-indigo-500"/>Step 3: Provide the AI-Generated JSON</h3>
                 <div className="bg-gray-100 dark:bg-slate-800/80 p-1 rounded-xl flex text-xs font-bold">
                    <button onClick={() => setInputType('file')} className={`px-4 py-2 rounded-lg transition ${inputType === 'file' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}>Upload JSON File</button>
                    <button onClick={() => setInputType('paste')} className={`px-4 py-2 rounded-lg transition ${inputType === 'paste' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}>Paste JSON String</button>
                 </div>
              </div>

              {inputType === 'file' ? (
                <div 
                  className="w-full bg-gray-50/50 dark:bg-slate-900/50 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center transition hover:border-indigo-500 hover:bg-indigo-500/5 cursor-pointer group"
                  onClick={() => fileInputRef.current.click()}
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black mb-2">Drag &amp; Drop JSON File Here</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">or click to browse from your computer</p>
                  <div className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition">Browse Files</div>
                  <input 
                    type="file" 
                    accept=".json" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />
                </div>
              ) : (
                <div className="bg-gray-950 rounded-3xl border border-slate-800 overflow-hidden shadow-inner">
                   <textarea 
                     value={pastedJson}
                     onChange={(e) => { setPastedJson(e.target.value); setErrors([]); setQuizData(null); }}
                     placeholder="Paste your ChatGPT / Gemini JSON output here..."
                     className="w-full h-72 p-6 font-mono text-xs text-emerald-400 bg-transparent resize-y outline-none"
                   ></textarea>
                </div>
              )}
            </div>

            {((inputType === 'file' && file) || (inputType === 'paste' && pastedJson.trim())) && (
              <div className="w-full bg-white/90 dark:bg-[#0f1623]/90 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-indigo-500/10 p-4 rounded-2xl text-indigo-500"><FileJson className="w-8 h-8" /></div>
                  <div>
                    <p className="font-black text-base text-gray-900 dark:text-white">{inputType === 'file' ? file.name : 'Pasted JSON Payload Ready'}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{inputType === 'file' ? `${(file.size / 1024).toFixed(1)} KB` : `${pastedJson.length} characters`} &middot; {computedCategory} &middot; <span className="uppercase font-bold text-indigo-400">{difficulty}</span></p>
                  </div>
                </div>
                <button 
                   onClick={validateFile} 
                   disabled={loading}
                   className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Validating Schema...' : 'Validate & Preview'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.length > 0 && (
              <div className="w-full bg-rose-500/10 p-8 rounded-3xl border border-rose-500/30">
                 <h4 className="text-rose-400 font-black mb-4 flex items-center text-base"><AlertCircle className="w-5 h-5 mr-2"/> Validation Schema Errors</h4>
                 <ul className="space-y-2">
                   {errors.map((err, i) => (
                      <li key={i} className="text-rose-300 bg-rose-500/10 px-4 py-2.5 rounded-xl text-xs font-mono border border-rose-500/20">{err}</li>
                   ))}
                 </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
