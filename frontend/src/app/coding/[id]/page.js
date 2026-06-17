"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Play, CheckCircle2, XCircle, Code2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CodingWorkspacePage() {
  const params = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const fetchProblem = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/coding-problems/${params.id}`);
      if (!res.ok) throw new Error('Problem not found');
      const data = await res.json();
      setProblem(data);
      setCode(data.starter_code || 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n        System.out.println("Hello World!");\n    }\n}');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = async () => {
    setRunning(true);
    setOutput('Compiling and running...');
    
    // Using Piston API for free code execution
    // Language versions: java: 15.0.2, python: 3.10.0, c++: 10.2.0
    const versionMap = {
      java: '15.0.2',
      python: '3.10.0',
      cpp: '10.2.0'
    };
    
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language === 'cpp' ? 'c++' : language,
          version: versionMap[language],
          files: [{ name: language === 'java' ? 'Main.java' : `main.${language}`, content: code }]
        })
      });
      
      const data = await res.json();
      if (data.run) {
        setOutput(data.run.output || 'Code executed successfully with no output.');
      } else {
        setOutput(data.message || 'Error executing code.');
      }
    } catch (err) {
      setOutput('Failed to connect to execution server: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Workspace...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-[#0d1117] text-gray-300 font-sans overflow-hidden">
      
      {/* LEFT PANEL: Problem Description */}
      <div className="w-1/3 bg-[#161b22] border-r border-gray-800 flex flex-col">
         <div className="p-4 border-b border-gray-800 bg-[#0d1117] flex items-center justify-between">
            <h1 className="font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-400" /> {problem.title}
            </h1>
            <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
              problem.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' : 'bg-orange-900/50 text-orange-400'
            }`}>
              {problem.difficulty || 'Medium'}
            </span>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
               <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Problem Statement</h2>
               <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                 {problem.description}
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT PANEL: Editor & Output */}
      <div className="w-2/3 flex flex-col">
         {/* Editor Header */}
         <div className="h-14 border-b border-gray-800 bg-[#161b22] flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
               <select 
                 value={language} 
                 onChange={e => setLanguage(e.target.value)}
                 className="bg-[#0d1117] border border-gray-700 rounded px-3 py-1 text-sm text-gray-300 outline-none focus:border-blue-500"
               >
                 <option value="java">Java</option>
                 <option value="python">Python</option>
                 <option value="cpp">C++</option>
               </select>
               <button onClick={() => setCode(problem.starter_code || '')} className="text-gray-500 hover:text-gray-300 text-sm flex items-center gap-1 transition">
                 <RefreshCw className="w-3 h-3" /> Reset
               </button>
            </div>
            <button 
              onClick={handleRunCode}
              disabled={running}
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-6 rounded text-sm flex items-center gap-2 transition disabled:opacity-50"
            >
               {running ? 'Running...' : <><Play className="w-4 h-4" /> Run Code</>}
            </button>
         </div>
         
         {/* Editor */}
         <div className="flex-1 bg-[#0d1117] relative">
            <textarea
              spellCheck="false"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-gray-300 p-4 font-mono text-[13px] leading-relaxed outline-none resize-none"
              placeholder="Write your solution here..."
            />
         </div>

         {/* Output Panel */}
         <div className="h-1/3 border-t border-gray-800 bg-[#161b22] flex flex-col">
            <div className="px-4 py-2 bg-[#0d1117] border-b border-gray-800 text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center justify-between">
               Console Output
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] whitespace-pre-wrap">
               {output || <span className="text-gray-600">Run your code to see the output here.</span>}
            </div>
         </div>
      </div>
    </div>
  );
}
