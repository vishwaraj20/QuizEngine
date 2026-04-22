"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCircle2, Award, Zap, Crosshair, Map, Calendar, Edit3, Check, X, MapPin, User, GraduationCap, FileText } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
     name: 'Candidate 001',
     city: 'Not Set',
     age: 'Not Set',
     qualification: '',
     about: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  
  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) { 
      const data = JSON.parse(stored);
      const userProfile = {
         name: data.name || 'Candidate 001',
         city: data.city || 'Not Set',
         age: data.age || 'Not Set',
         qualification: data.qualification || '',
         about: data.about || ''
      };
      setProfile(userProfile);
      setEditForm(userProfile);
    }
  }, []);

  const saveProfile = () => {
    const stored = localStorage.getItem('quiz_user');
    let user = stored ? JSON.parse(stored) : {};
    user = { ...user, ...editForm };
    localStorage.setItem('quiz_user', JSON.stringify(user));
    
    setProfile(editForm);
    setIsEditing(false);
    // Dispatch event so layout/header updates real-time
    window.dispatchEvent(new Event('user_login'));
  };

  // Gamification & Progress Mock Data for visual illustration
  const stats = {
     totalScore: 4250,
     accuracy: 84,
     quizzesPassed: 14,
     streak: 7
  };

  const history = [
     { id: 101, title: 'UPSC History Mock 1', score: "18/20", date: 'Today, 2:30 PM', status: 'Passed' },
     { id: 102, title: 'SSC Quantitative Aptitude', score: "15/20", date: 'Yesterday, 11:15 AM', status: 'Passed' },
     { id: 103, title: 'GATE Engineering Math', score: "9/25", date: 'Apr 16, 2024', status: 'Failed' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
       <div className="max-w-4xl mx-auto">
          
          <div className="mb-10 flex items-center justify-between">
             <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal
             </Link>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-100 mb-10 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-bl-[10rem] opacity-50"></div>
             
             <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="w-40 h-40 bg-gray-100 rounded-[3rem] flex items-center justify-center shadow-inner border-4 border-white">
                   <UserCircle2 className="w-20 h-20 text-gray-300" />
                </div>
                <div className="text-center md:text-left flex-1 w-full relative">
                   
                   {!isEditing && (
                      <button onClick={() => { setEditForm(profile); setIsEditing(true); }} className="absolute -top-4 -right-4 p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition" title="Edit Full Profile">
                         <Edit3 className="w-6 h-6" />
                      </button>
                   )}

                   {isEditing ? (
                      <div className="bg-white/80 p-8 rounded-3xl border border-gray-200 shadow-sm backdrop-blur-sm -mt-4">
                         <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center"><Edit3 className="w-5 h-5 mr-3 text-blue-600"/> Edit Details</h3>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                               <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2"><User className="w-3 h-3 inline mr-1"/> Full Name</label>
                               <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2"><MapPin className="w-3 h-3 inline mr-1"/> City</label>
                               <input type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="e.g. Mumbai" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Age</label>
                               <input type="number" value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="e.g. 21" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2"><GraduationCap className="w-3 h-3 inline mr-1"/> Qualification</label>
                               <select value={editForm.qualification} onChange={(e) => setEditForm({...editForm, qualification: e.target.value})} className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm">
                                  <option value="">Select Qualification...</option>
                                  <option value="High School">High School (10+2)</option>
                                  <option value="Undergraduate">Undergraduate Degree</option>
                                  <option value="Postgraduate">Postgraduate Degree</option>
                                  <option value="Doctorate">Doctorate (Ph.D)</option>
                                  <option value="Other">Other</option>
                               </select>
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2"><FileText className="w-3 h-3 inline mr-1"/> About You</label>
                               <textarea value={editForm.about} onChange={(e) => setEditForm({...editForm, about: e.target.value})} rows="3" className="w-full border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="A short bio..."></textarea>
                            </div>
                         </div>
                         
                         <div className="flex gap-4 justify-end mt-8 border-t border-gray-200 pt-6">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-800 transition">Cancel</button>
                            <button onClick={saveProfile} className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition flex items-center">
                               Save Profile <Check className="w-5 h-5 ml-2"/>
                            </button>
                         </div>
                      </div>
                   ) : (
                      <>
                         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                            <h1 className="text-5xl font-black text-gray-900">{profile.name}</h1>
                         </div>
                         
                         <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-6 flex justify-center md:justify-start items-center">
                            <Award className="w-4 h-4 mr-2" /> Tier 1 Aspirant
                         </p>

                         <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
                            <div className="flex items-center text-gray-600"><MapPin className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.city}</span></div>
                            <div className="flex items-center text-gray-600"><User className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.age !== 'Not Set' ? `${profile.age} Yrs` : 'Age Not Set'}</span></div>
                            <div className="flex items-center text-gray-600"><GraduationCap className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.qualification || 'Qualification Not Set'}</span></div>
                         </div>
                         
                         {profile.about && (
                            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 mb-8 max-w-2xl">
                               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3"><FileText className="w-3 h-3 inline mr-2"/> About</p>
                               <p className="text-gray-700 font-medium leading-relaxed">{profile.about}</p>
                            </div>
                         )}
                         
                         <div className="flex flex-wrap gap-4">
                            <div className="px-6 py-3 bg-yellow-50 text-yellow-700 rounded-2xl font-bold flex items-center shadow-inner border border-yellow-100/50">
                               <Award className="w-5 h-5 mr-2" /> Advanced Rank
                            </div>
                            <div className="px-6 py-3 bg-orange-50 text-orange-600 rounded-2xl font-bold flex items-center shadow-inner border border-orange-100/50">
                               <Zap className="w-5 h-5 mr-2 fill-orange-500" /> {stats.streak} Day Streak!
                            </div>
                         </div>
                      </>
                   )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Total Points</p>
                <p className="text-4xl font-black text-gray-900">{stats.totalScore}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Accuracy</p>
                <p className="text-4xl font-black text-blue-600">{stats.accuracy}%</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Quizzes Passed</p>
                <p className="text-4xl font-black text-green-500">{stats.quizzesPassed}</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Certificates</p>
                <p className="text-4xl font-black text-purple-600">3</p>
             </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
             <Calendar className="w-6 h-6 mr-3 text-gray-400" /> Recent Assessment History
          </h2>
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
             {history.map((h, i) => (
                <div key={h.id} className={`p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition ${i !== history.length - 1 ? 'border-b border-gray-100' : ''}`}>
                   <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                      <h3 className="font-bold text-gray-900 text-lg">{h.title}</h3>
                      <p className="text-sm font-medium text-gray-400">{h.date}</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</p>
                         <p className="font-black text-xl text-gray-900">{h.score}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-sm font-bold w-24 text-center ${h.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {h.status}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}
