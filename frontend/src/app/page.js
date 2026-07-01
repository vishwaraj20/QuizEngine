"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Sparkles, Zap, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [userRole, setUserRole] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) {
      setUserRole(JSON.parse(stored).role);
    }
    
    // Scroll spy logic
    const handleScroll = () => {
      const sections = ['hero', 'placement', 'cta'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPosition >= el.offsetTop && scrollPosition <= (el.offsetTop + el.offsetHeight)) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStartedHref = userRole === 'admin' ? '/admin' : userRole === 'student' ? '/dashboard' : '/auth';

  return (
    <div className="min-h-screen relative">
      {/* Scroll Navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50 hidden md:flex">
         {['hero', 'placement', 'cta'].map((section) => (
            <button
               key={section}
               onClick={() => scrollTo(section)}
               className={`w-6 h-1 rounded-full transition-all duration-300 ${activeSection === section ? 'bg-blue-600 dark:bg-white shadow-[0_0_10px_rgba(37,99,235,0.8)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-400'}`}
               aria-label={`Scroll to ${section}`}
            />
         ))}
      </div>

      {/* Dynamic Navigation Gradient Background */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <div id="hero" className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 text-center relative z-10">

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl font-black tracking-tight text-gray-900 dark:text-white sm:text-8xl mb-8 leading-[1.1]"
          >
            Unleash Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">Perfect Score.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-8 text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto"
          >
            The world's most advanced AI-powered testing platform. From UPSC Prelims to College General Aptitude, master any subject with personalized, difficulty-tuned tracks.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              href={getStartedHref} 
              className="w-full sm:w-auto rounded-[2rem] bg-gray-900 dark:bg-blue-600 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-gray-900/20 dark:shadow-blue-900/30 hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
            >
              Start Learning Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href={getStartedHref} className="text-lg font-black text-gray-700 dark:text-gray-300 flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition group">
              Browse Categories <ArrowRight className="ml-2 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>

          {/* Professional Stat Bar */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
             className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-white/50 dark:border-slate-700/50 shadow-xl shadow-gray-200/20 dark:shadow-none"
          >
             <div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] shadow-sm flex flex-col items-center justify-center border border-white/20 dark:border-white/5">
                <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">1.2M+</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 text-center">Questions Served</span>
             </div>
             <div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] shadow-sm flex flex-col items-center justify-center border border-white/20 dark:border-white/5">
                <span className="text-4xl font-black text-blue-600 tracking-tighter">94%</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 text-center">Average Pass Rate</span>
             </div>
             <div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] shadow-sm flex flex-col items-center justify-center border border-white/20 dark:border-white/5">
                <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">45+</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 text-center">Exam Categories</span>
             </div>
             <div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] shadow-sm flex flex-col items-center justify-center border border-white/20 dark:border-white/5">
                <span className="text-4xl font-black text-emerald-500 tracking-tighter">24/7</span>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mt-2 text-center">Anti-Cheat Engine</span>
             </div>
          </motion.div>


        </div>
      </div>

      {/* Information Section for Students */}
      <div id="placement" className="py-32 bg-gray-50/50 dark:bg-slate-900/50 relative overflow-hidden">
        <div className="w-full mx-auto px-6 md:px-12 max-w-7xl">
           <div className="mx-auto max-w-3xl lg:text-center mb-16">
              <h2 className="text-base font-black leading-7 text-blue-600 uppercase tracking-widest">Placement Preparation</h2>
              <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">Cracking Campus Placements at RSCOE</p>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
              
              {/* Main Content Area */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 space-y-8"
              >
                 <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                       Campus placements are a defining milestone for students at <strong>JSPM's Rajarshi Shahu College of Engineering (RSCOE), Tathawade</strong>. Every year, top-tier IT, engineering, and consulting firms visit the campus, seeking the brightest minds.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                       Industry giants such as <strong>TCS, Capgemini, Accenture, Cognizant, Infosys, KPIT, LTIMindtree, Bosch, Siemens, JSW</strong>, and many others conduct rigorous placement drives at our institute. The competition is fierce, and preparation is the key to standing out.
                    </p>
                    
                    <div className="mt-10 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/50 relative overflow-hidden shadow-sm">
                       <div className="absolute top-0 right-0 p-4 opacity-10">
                          <BrainCircuit className="w-24 h-24 text-blue-600" />
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 relative z-10">The First Hurdle: Aptitude Tests</h3>
                       <p className="text-gray-700 dark:text-gray-300 relative z-10 mb-4 leading-relaxed">
                          The recruitment journey typically kicks off with an <strong>Aptitude Test</strong>. This crucial screening round evaluates your numerical agility, logical reasoning, and verbal communication. 
                       </p>
                       <p className="text-gray-700 dark:text-gray-300 relative z-10 font-semibold leading-relaxed">
                          Performing well here is non-negotiable—only the shortlisted candidates advance to coding assessments, technical interviews, and HR rounds. Speed and accuracy are your best assets.
                       </p>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-10">
                       This module has been developed specifically to help RSCOE students prepare effectively. It covers the major aptitude topics, provides practice questions with answers, and offers deep explanations to strengthen problem-solving skills.
                    </p>
                 </div>
              </motion.div>

              {/* Syllabus / Modules Area */}
              <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="lg:col-span-5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-700"
              >
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-700 pb-4">
                    Master the Modules
                 </h3>
                 
                 <div className="space-y-8">
                    {/* Quant */}
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                             <Zap className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Quantitative Aptitude</h4>
                       </div>
                       <div className="flex flex-wrap gap-2 pl-15">
                          {['Number Systems', 'HCF & LCM', 'Percentages', 'Profit & Loss', 'Ratio & Proportion', 'Time & Distance', 'Time & Work', 'Data Interpretation'].map(topic => (
                             <span key={topic} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold border border-gray-100 dark:border-slate-600">{topic}</span>
                          ))}
                       </div>
                    </div>

                    {/* Reasoning */}
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                             <BrainCircuit className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Logical Reasoning</h4>
                       </div>
                       <div className="flex flex-wrap gap-2 pl-15">
                          {['Blood Relations', 'Coding-Decoding', 'Syllogisms', 'Seating Arrangements', 'Puzzles', 'Series Completion', 'Pattern Recognition'].map(topic => (
                             <span key={topic} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold border border-gray-100 dark:border-slate-600">{topic}</span>
                          ))}
                       </div>
                    </div>

                    {/* Verbal */}
                    <div>
                       <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                             <Sparkles className="w-6 h-6" />
                          </div>
                          <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Verbal Ability</h4>
                       </div>
                       <div className="flex flex-wrap gap-2 pl-15">
                          {['Reading Comprehension', 'Grammar', 'Vocabulary', 'Sentence Completion', 'Error Detection', 'Sentence Rearrangement'].map(topic => (
                             <span key={topic} className="px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold border border-gray-100 dark:border-slate-600">{topic}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
              
           </div>
        </div>
      </div>

      {/* Final Call to Action */}
      <div id="cta" className="relative isolate py-32 overflow-hidden bg-gray-900 dark:bg-slate-900">
         <div className="w-full mx-auto px-6 md:px-12 text-center flex flex-col items-center">
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
