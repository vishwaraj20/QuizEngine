"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Play, CheckCircle2, XCircle, Code2, RefreshCw, Send, Terminal, FileCode2, Beaker, ArrowLeft } from 'lucide-react';

export default function CodingWorkspacePage() {
  const params = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');
  
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResults, setSubmitResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'output', 'results'
  const [useCustomInput, setUseCustomInput] = useState(false);

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
    setActiveTab('output');
    setOutput('Compiling and running...');
    
    const executionInput = useCustomInput ? input : (problem?.test_cases?.[0]?.input || '');

    try {
      const res = await fetch('http://localhost:5000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input: executionInput })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute code');
      }
      
      setOutput(data.output);
    } catch (err) {
      setOutput('Failed to connect to execution server: ' + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    setSubmitting(true);
    setActiveTab('results');
    setSubmitResults(null);
    try {
      const res = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problem_id: params.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitResults(data);
      
      if (data.allPassed) {
        const solved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
        if (!solved.includes(Number(params.id))) {
          solved.push(Number(params.id));
          localStorage.setItem('solved_problems', JSON.stringify(solved));
        }
      }
    } catch (err) {
      setSubmitResults({ error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 dark:text-gray-400" style={{ backgroundColor: '#0f172a' }}>Loading Workspace...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500" style={{ backgroundColor: '#0f172a' }}>{error}</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] text-gray-300 font-sans p-4 gap-4 overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
      
      {/* LEFT PANEL: Problem Description */}
      <div className="w-[35%] flex flex-col bg-white dark:bg-slate-800/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
         <div className="p-4 border-b border-white/5 bg-white dark:bg-slate-800/[0.01] flex flex-col gap-3">
            <Link href={`/dashboard/company/${problem?.company || 'TCS'}/coding`} className="text-gray-500 dark:text-gray-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" /> Back to {problem?.company || 'TCS'} Problems
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-white text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" /> {problem.title}
              </h1>
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${
                problem.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              }`}>
                {problem.difficulty || 'Medium'}
              </span>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div>
               <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400/80 mb-4 flex items-center gap-2">
                 <FileCode2 className="w-4 h-4" /> Problem Statement
               </h2>
               <div className="text-[14px] leading-relaxed whitespace-pre-wrap text-gray-300/90 font-light">
                 {problem.description}
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT PANEL: Editor & Output */}
      <div className="w-[65%] flex flex-col gap-4 h-full">
         
         {/* Top section: Editor */}
         <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
           <div className="h-16 border-b border-white/5 bg-white dark:bg-slate-800/[0.01] flex items-center justify-between px-5">
              <div className="flex items-center gap-4">
                 <select 
                   value={language} 
                   onChange={e => setLanguage(e.target.value)}
                   className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                 >
                   <option value="java" className="bg-slate-800 text-white">Java 15</option>
                   <option value="python" className="bg-slate-800 text-white">Python 3</option>
                   <option value="cpp" className="bg-slate-800 text-white">C++</option>
                 </select>
                 <button onClick={() => setCode(problem.starter_code || '')} className="text-gray-500 dark:text-gray-400 hover:text-gray-200 text-sm flex items-center gap-1.5 transition-colors">
                   <RefreshCw className="w-3.5 h-3.5" /> Reset
                 </button>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRunCode}
                  disabled={running || submitting}
                  className="bg-white dark:bg-slate-800/5 hover:bg-white dark:bg-slate-800/10 border border-white/10 text-gray-200 font-medium py-2 px-5 rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                >
                   {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-emerald-400" />} 
                   {running ? 'Running...' : 'Run Code'}
                </button>
                <button 
                  onClick={handleSubmitCode}
                  disabled={running || submitting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-medium py-2 px-6 rounded-lg text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50"
                >
                   {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
                   {submitting ? 'Submitting...' : 'Submit Code'}
                </button>
              </div>
           </div>
           
           <div className="flex-1 relative bg-black/20">
              <textarea
                spellCheck="false"
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full h-full bg-transparent text-gray-300 p-5 font-mono text-[14px] leading-relaxed outline-none resize-none custom-scrollbar"
                placeholder="Write your solution here..."
              />
           </div>
         </div>

         {/* Bottom section: Tabs for Input / Output / Results */}
         <div className="h-[35%] flex flex-col bg-white dark:bg-slate-800/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="flex items-center border-b border-white/5 bg-white dark:bg-slate-800/[0.01] px-2 pt-2">
               <button 
                 onClick={() => setActiveTab('input')}
                 className={`px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'input' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
               >
                 <Terminal className="w-4 h-4" /> Custom Input
               </button>
               <button 
                 onClick={() => setActiveTab('output')}
                 className={`px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'output' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
               >
                 <Code2 className="w-4 h-4" /> Console
               </button>
               <button 
                 onClick={() => setActiveTab('results')}
                 className={`px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'results' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-300'}`}
               >
                 <Beaker className="w-4 h-4" /> Test Results
               </button>
            </div>

            <div className="flex-1 relative bg-black/20 overflow-hidden">
               {/* Custom Input Tab */}
               {activeTab === 'input' && (
                 <div className="flex flex-col w-full h-full p-5">
                   <div className="flex items-center gap-3 mb-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={useCustomInput}
                         onChange={(e) => setUseCustomInput(e.target.checked)}
                         className="w-4 h-4 rounded border-white/20 bg-black/40 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
                       />
                       <span className="text-sm text-gray-300 font-medium">Test against custom input</span>
                     </label>
                   </div>
                   
                   <textarea
                     spellCheck="false"
                     value={useCustomInput ? input : (problem?.test_cases?.[0]?.input || '')}
                     onChange={e => useCustomInput && setInput(e.target.value)}
                     disabled={!useCustomInput}
                     className={`flex-1 w-full bg-black/40 text-gray-300 p-4 font-mono text-[13px] whitespace-pre-wrap outline-none resize-none rounded-xl border ${useCustomInput ? 'border-indigo-500/50 focus:border-indigo-500' : 'border-white/5 opacity-70 cursor-not-allowed'} custom-scrollbar`}
                     placeholder={useCustomInput ? "Enter custom input here..." : "Default test case input"}
                   />
                 </div>
               )}

               {/* Console Output Tab */}
               {activeTab === 'output' && (
                 <div className="w-full h-full p-5 overflow-y-auto font-mono text-[13px] whitespace-pre-wrap text-gray-300 custom-scrollbar">
                    {output || <span className="text-gray-600 dark:text-gray-400">Run your code to see the output here.</span>}
                 </div>
               )}

               {/* Test Results Tab */}
               {activeTab === 'results' && (
                 <div className="w-full h-full p-5 overflow-y-auto custom-scrollbar">
                    {!submitResults ? (
                      <span className="text-gray-600 dark:text-gray-400 font-mono text-[13px]">Submit your code to see test case results.</span>
                    ) : submitResults.error ? (
                      <div className="text-red-400 font-mono text-[13px] bg-red-500/10 p-4 rounded-lg border border-red-500/20 whitespace-pre-wrap">
                        {submitResults.error}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                           {submitResults.allPassed ? (
                             <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-2">
                               <CheckCircle2 className="w-5 h-5" /> All Test Cases Passed!
                             </div>
                           ) : (
                             <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 font-bold flex items-center gap-2">
                               <XCircle className="w-5 h-5" /> Some Test Cases Failed
                             </div>
                           )}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {submitResults.results?.map((tc, idx) => (
                            <div key={idx} className={`rounded-xl border p-4 ${tc.passed ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
                               <div className="flex items-center justify-between mb-3">
                                  <span className={`font-bold text-sm ${tc.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                    Test Case {tc.testCase}
                                  </span>
                                  {tc.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                               </div>
                               
                               {!tc.passed && (
                                 <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-xs">
                                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                                      <div className="text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[10px] font-bold">Input</div>
                                      <div className="text-gray-300 whitespace-pre-wrap">{tc.input || 'None'}</div>
                                    </div>
                                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                                      <div className="text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider text-[10px] font-bold">Expected Output</div>
                                      <div className="text-gray-300 whitespace-pre-wrap">{tc.expectedOutput || 'None'}</div>
                                    </div>
                                    <div className="col-span-2 bg-black/40 rounded-lg p-3 border border-red-500/20">
                                      <div className="text-red-400/70 mb-1 uppercase tracking-wider text-[10px] font-bold">Your Output</div>
                                      <div className="text-red-300 whitespace-pre-wrap">{tc.actualOutput || 'None'}</div>
                                    </div>
                                 </div>
                               )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
