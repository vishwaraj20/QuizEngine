"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Zap, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) {
      setUserRole(JSON.parse(stored).role);
    }
  }, []);

  const getStartedHref = userRole === 'admin' ? '/admin' : userRole === 'student' ? '/dashboard' : '/auth';

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Navigation Gradient Background */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center">

          <h1 className="text-6xl font-black tracking-tight text-gray-900 sm:text-8xl mb-8 leading-[1.1]">
            Unleash Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Perfect Score.</span>
          </h1>
          
          <p className="mt-8 text-xl leading-relaxed text-gray-600 font-medium max-w-2xl mx-auto">
            The world's most advanced AI-powered testing platform. From UPSC Prelims to College General Aptitude, master any subject with personalized, difficulty-tuned tracks.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href={getStartedHref} 
              className="w-full sm:w-auto rounded-[2rem] bg-gray-900 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-gray-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3 group"
            >
              Start Learning Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={getStartedHref} className="text-lg font-black text-gray-700 flex items-center hover:text-blue-600 transition group">
              Browse Categories <ArrowRight className="ml-2 w-5 h-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Professional Stat Bar */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/80 backdrop-blur-sm rounded-[3rem] border border-gray-100">
             <div className="p-6 bg-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">1.2M+</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Questions Served</span>
             </div>
             <div className="p-6 bg-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-blue-600 tracking-tighter">94%</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Average Pass Rate</span>
             </div>
             <div className="p-6 bg-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900 tracking-tighter">45+</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Exam Categories</span>
             </div>
             <div className="p-6 bg-white rounded-[2rem] shadow-sm flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-emerald-500 tracking-tighter">24/7</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 mt-2">Anti-Cheat Engine</span>
             </div>
          </div>


        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-32 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <div className="mx-auto max-w-2xl lg:text-center mb-20">
              <h2 className="text-base font-black leading-7 text-blue-600 uppercase tracking-widest">Advanced Infrastructure</h2>
              <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">Engineered for Excellence</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-12">
              {[
                { 
                  title: 'Atomic AI Generation', 
                  desc: 'Import raw data blocks and let our AI engine create flawless JSON schemas with intelligent explanations.',
                  icon: <BrainCircuit className="w-8 h-8"/>,
                  color: 'bg-blue-600'
                },
                { 
                  title: 'Category Navigators', 
                  desc: 'Deeply nested, exam-specific dashboards that keep your study materials organized by curriculum requirements.',
                  icon: <Zap className="w-8 h-8"/>,
                  color: 'bg-indigo-600'
                },
                { 
                  title: 'Real-time Analytics', 
                  desc: 'Track every second and every mark. Our leaderboard system keeps you motivated to hit the top rank.',
                  icon: <Award className="w-8 h-8"/>,
                  color: 'bg-emerald-600'
                }
              ].map((f, i) => (
                <div key={i} className="relative group p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
                   <div className={`mb-8 w-16 h-16 ${f.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                      {f.icon}
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                   <div className="mt-6 flex items-center text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="ml-2 w-4 h-4" />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div className="relative isolate py-32 overflow-hidden bg-gray-900">
         <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
            <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl mb-10">Start your journey to the <br/> <span className="text-blue-500">Global Leaderboard.</span></h2>
            <Link 
              href="/auth" 
              className="rounded-3xl bg-blue-600 px-10 py-5 text-lg font-black text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30"
            >
              Join 10,000+ Students
            </Link>
            <div className="mt-12 flex items-center gap-8 justify-center flex-wrap">
               {['Trusted by IITians', '99.9% Up-time', 'Verified Explanations'].map(t => (
                  <div key={t} className="flex items-center text-gray-400 text-sm font-bold gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {t}
                  </div>
               ))}
            </div>
         </div>
         {/* Background Glow */}
         <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl opacity-20">
            <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-blue-500 to-purple-600"></div>
         </div>
      </div>
    </div>
  );
}
