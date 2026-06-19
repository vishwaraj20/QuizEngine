"use client";
import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileJson, AlertCircle, Play, Settings, Copy, Check, Sparkles, ChevronDown } from 'lucide-react';

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
[PASTE YOUR RAW DATA HERE]`;const CODING_AI_PROMPT = `You are an expert technical content parser. Your task is to convert raw, unstructured coding problem descriptions into a highly structured, valid JSON file.

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
  { value: 'easy', label: 'Easy', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' },
  { value: 'moderate', label: 'Moderate', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' }
];

export default function AdminUploadPage() {
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
          alert("Coding problems published!");
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
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Review & Publish {uploadMode === 'coding' ? 'Coding Problems' : 'Quiz'}</h1>
          <div className="flex space-x-4">
            <button onClick={() => setQuizData(null)} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-300 transition shadow">Cancel</button>
            <button onClick={publishQuiz} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold flex items-center hover:bg-blue-700 shadow-lg transition">
              {loading ? "Publishing..." : "Publish Quiz"} <Play className="ml-2 w-4 h-4"/>
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-8 flex flex-col space-y-4">
           <h2 className="text-xl font-bold flex items-center"><Settings className="w-5 h-5 mr-2 text-gray-400" /> Quiz Settings</h2>
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Quiz Title</label>
               <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
               <select value={mainCategory} onChange={e => {
                 setMainCategory(e.target.value);
                 if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                 else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
               }} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 mb-3">
                  {MAIN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
               </select>

               {mainCategory === "College Placement" ? (
                 <div className="flex gap-2">
                   <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800">
                      {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                   <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800">
                      {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
               ) : mainCategory === "Competitive Exams" ? (
                 <div className="space-y-3">
                   <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800">
                      {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                   </select>
                   <div className="flex gap-2">
                     <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm">
                        {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                     </select>
                     {subCategory === 'SSC' && (
                       <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm">
                          {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                       </select>
                     )}
                   </div>
                   <div className="flex gap-2">
                     <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm">
                        {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                     </select>
                   </div>
                   <div className="flex gap-2">
                     {quizMode !== 'PYQ Papers' && (
                       <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm">
                          {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                     )}
                     {quizMode === 'PYQ Papers' && (
                       <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm" />
                     )}
                     {quizMode === 'Topic-wise' && (
                       <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-sm" />
                     )}
                   </div>
                 </div>
               ) : (
                 <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800">
                    {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                 </select>
               )}
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Difficulty Level</label>
               <div className="flex space-x-3">
                 {DIFFICULTIES.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 transition ${difficulty === d.value ? d.color + ' border-current' : 'bg-gray-50 dark:bg-slate-900 text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:bg-slate-800'}`}
                    >{d.label}</button>
                 ))}
               </div>
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Time Limit (mins, 0 for infinite)</label>
               <input type="number" value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pass %</label>
               <input type="number" value={passPercent} onChange={e => setPassPercent(Number(e.target.value))} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
             </div>
           </div>
        </div>

        {uploadMode === 'coding' ? (
           <div className="space-y-6">
             <h2 className="text-xl font-bold flex items-center">
               {quizData.problems?.length} Problems imported
             </h2>
             {quizData.problems?.map((p, idx) => (
               <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                 <div className="font-bold text-xl text-gray-800 dark:text-gray-200 mb-2">{idx + 1}. {p.title}</div>
                 <div className="mb-4">
                   <span className="px-2 py-1 text-xs font-bold uppercase rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 mr-2">{p.difficulty}</span>
                 </div>
                 <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">{p.description}</div>
                 <div className="bg-gray-900 dark:bg-blue-600 text-gray-300 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap mb-4 overflow-auto">
                   {p.starter_code}
                 </div>
                 <h4 className="font-bold text-sm mb-2 text-gray-700 dark:text-gray-300">Test Cases ({p.test_cases?.length})</h4>
                 <div className="grid grid-cols-2 gap-4">
                   {p.test_cases?.slice(0, 2).map((tc, tcIdx) => (
                     <div key={tcIdx} className="bg-gray-50 dark:bg-slate-900 border p-3 rounded-lg text-xs font-mono whitespace-pre-wrap">
                       <div className="text-gray-400 mb-1">Input:</div>
                       <div className="mb-2">{tc.input}</div>
                       <div className="text-gray-400 mb-1">Expected Output:</div>
                       <div>{tc.expected_output}</div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="space-y-6">
             <h2 className="text-xl font-bold flex items-center">
               {quizData.questions?.length} Questions imported
             </h2>
          {quizData.questions.map((q, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4 flex items-start">
                <span className="bg-blue-100 text-blue-700 w-8 h-8 flex items-center justify-center rounded-lg mr-3 shrink-0">{idx + 1}</span>
                <div dangerouslySetInnerHTML={{ __html: q.question }} />
              </div>
              <div className="grid grid-cols-2 gap-3 pl-11 mb-4">
                {Object.keys(q.options).map(key => (
                   <div key={key} className={`p-3 border rounded-xl flex items-center ${key === q.correct ? 'bg-green-50 border-green-200 text-green-800 font-medium' : 'bg-gray-50 dark:bg-slate-900'}`}>
                     <span className={`w-6 h-6 flex justify-center items-center rounded-md mr-3 font-bold ${key === q.correct ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600 dark:text-gray-400'}`}>{key}</span>
                     <div dangerouslySetInnerHTML={{ __html: q.options[key] }} />
                   </div>
                ))}
              </div>
              <div className="pl-11 pr-4 py-3 bg-blue-50 rounded-lg text-sm text-blue-900 border border-blue-100 flex gap-2">
                <strong>Explanation: </strong> <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    );
  }

  // UPLOAD SCREEN
  return (
    <div className="max-w-5xl mx-auto p-6">
      
      {/* Upload Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-200 p-1 rounded-xl flex">
          <button 
            onClick={() => setUploadMode('quiz')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${uploadMode === 'quiz' ? 'bg-white dark:bg-slate-800 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
          >
            MCQ Quiz
          </button>
          <button 
            onClick={() => {
              setUploadMode('coding');
              if (mainCategory === 'Competitive Exams') {
                setMainCategory('College Placement');
                setCompany(PLACEMENT_COMPANIES[0]);
              }
            }}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors ${uploadMode === 'coding' ? 'bg-white dark:bg-slate-800 shadow text-purple-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
          >
            Coding Problems
          </button>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Create {uploadMode === 'coding' ? 'Coding Problems' : 'Quiz'} with AI</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">Copy the prompt below, paste it into ChatGPT / Gemini / Claude with your raw data, then upload the JSON output.</p>
      </div>

      {/* Step 1: AI Prompt */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-500"/>Step 1: Copy this Prompt for AI</h2>
          <button
            onClick={copyPrompt}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition shadow-sm ${copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            {copied ? <><Check className="w-4 h-4 mr-2"/>Copied!</> : <><Copy className="w-4 h-4 mr-2"/>Copy Prompt</>}
          </button>
        </div>
        <div className="bg-gray-900 dark:bg-blue-600 text-gray-200 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-gray-700 shadow-inner">
          {uploadMode === 'coding' ? CODING_AI_PROMPT : AI_PROMPT}
        </div>
      </div>

      {/* Step 2: Select Category & Difficulty */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-4"><Settings className="w-5 h-5 mr-2 text-blue-500"/>Step 2: Select Quiz Type & Difficulty</h2>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
           <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Category</label>
                <select value={mainCategory} onChange={e => {
                  setMainCategory(e.target.value);
                  if (e.target.value === "Competitive Exams") setSubCategory(COMPETITIVE_EXAMS[0]);
                  else if (e.target.value === "Other") setSubCategory(OTHER_CATEGORIES[0]);
                }} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium mb-3">
                   {MAIN_CATEGORIES.filter(cat => uploadMode === 'quiz' || cat !== 'Competitive Exams').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                {mainCategory === "College Placement" ? (
                  <div className="flex gap-3">
                    <select value={company} onChange={e => setCompany(e.target.value)} className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                       {PLACEMENT_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {uploadMode === 'quiz' && (
                      <select value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                         {PLACEMENT_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                  </div>
                ) : mainCategory === "Competitive Exams" ? (
                  <div className="space-y-3">
                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                       {COMPETITIVE_EXAMS.map(item => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <div className="flex gap-3">
                      <select value={phase} onChange={e => setPhase(e.target.value)} className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm">
                         {(subCategory === 'SSC' ? SSC_PHASES : EXAM_PHASES).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      {subCategory === 'SSC' && (
                        <select value={sscExam} onChange={e => setSscExam(e.target.value)} className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm">
                           {SSC_EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      )}
                    </div>
                      <div className="flex gap-3 mt-3 w-full">
                       <select value={quizMode} onChange={e => setQuizMode(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm">
                          {QUIZ_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                       </select>
                      </div>
                      <div className="flex gap-3 mt-3 w-full">
                        {quizMode !== 'PYQ Papers' && (
                          <select value={subject} onChange={e => setSubject(e.target.value)} className="flex-[1.5] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm">
                           {UPSC_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        )}
                        {quizMode === 'PYQ Papers' && (
                          <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" className="flex-1 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm" />
                        )}
                        {quizMode === 'Topic-wise' && (
                          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic Name" className="flex-[2] border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium text-sm" />
                        )}
                      </div>
                  </div>
                ) : (
                  <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium">
                     {OTHER_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Difficulty Level</label>
                <div className="flex space-x-3">
                  {DIFFICULTIES.map(d => (
                     <button
                       key={d.value}
                       type="button"
                       onClick={() => setDifficulty(d.value)}
                       className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition ${difficulty === d.value ? d.color + ' border-current shadow-sm' : 'bg-gray-50 dark:bg-slate-900 text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:bg-slate-800'}`}
                     >{d.label}</button>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Step 3: Input JSON */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><UploadCloud className="w-5 h-5 mr-2 text-purple-500"/>Step 3: Provide the AI-generated JSON</h2>
           <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-lg flex text-sm font-semibold">
              <button onClick={() => setInputType('file')} className={`px-4 py-1.5 rounded-md transition ${inputType === 'file' ? 'bg-white dark:bg-slate-800 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}>Upload File</button>
              <button onClick={() => setInputType('paste')} className={`px-4 py-1.5 rounded-md transition ${inputType === 'paste' ? 'bg-white dark:bg-slate-800 shadow text-blue-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}>Paste JSON</button>
           </div>
        </div>

        {inputType === 'file' ? (
          <div 
            className="w-full bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center transition hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud className="w-16 h-16 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Drag JSON file here</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">or click to browse from your computer</p>
            <div className="px-6 py-2 bg-gray-900 dark:bg-blue-600 text-white rounded-full font-medium">Browse Files</div>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
             <textarea 
               value={pastedJson}
               onChange={(e) => { setPastedJson(e.target.value); setErrors([]); setQuizData(null); }}
               placeholder="Paste your JSON here..."
               className="w-full h-64 p-6 font-mono text-sm resize-y outline-none"
             ></textarea>
          </div>
        )}
      </div>

      {((inputType === 'file' && file) || (inputType === 'paste' && pastedJson.trim())) && (
        <div className="mb-8 w-full bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-xl"><FileJson className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">{inputType === 'file' ? file.name : 'Pasted JSON Data'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{inputType === 'file' ? `${(file.size / 1024).toFixed(1)} KB` : `${pastedJson.length} chars`} &middot; {computedCategory} &middot; {difficulty}</p>
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
