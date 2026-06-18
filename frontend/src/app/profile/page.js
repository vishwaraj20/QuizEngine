"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCircle2, Award, Zap, Crosshair, Map, Calendar, Edit3, Check, X, MapPin, User, GraduationCap, FileText, Camera, Link as LinkIcon, GitBranch, Briefcase } from 'lucide-react';

const INDIA_STATES_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Agra", "Varanasi"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri"]
};

export default function ProfilePage() {
  const [profile, setProfile] = useState({
     name: 'Candidate 001',
     state: '',
     city: 'Not Set',
     age: 'Not Set',
     qualification: '',
     about: '',
     avatar: '',
     title: '',
     linkedin: '',
     github: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [stats, setStats] = useState({ totalScore: 0, accuracy: 0, quizzesPassed: 0, streak: 0 });
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) { 
      const data = JSON.parse(stored);
      const userProfile = {
         name: data.name || 'Candidate 001',
         state: data.state || '',
         city: data.city || 'Not Set',
         age: data.age || 'Not Set',
         qualification: data.qualification || '',
         about: data.about || '',
         avatar: data.avatar || '',
         title: data.title || '',
         linkedin: data.linkedin || '',
         github: data.github || ''
      };
      setProfile(userProfile);
      setEditForm(userProfile);

      // Fetch user attempts to calculate actual stats and history
      fetch(`http://localhost:5000/api/users/${data.id || 1}/attempts`)
        .then(res => res.json())
        .then(attempts => {
          if (Array.isArray(attempts)) {
            const validAttempts = attempts.filter(a => a.total > 0);
            const totalScore = attempts.reduce((acc, a) => acc + (a.score || 0), 0);
            const accuracy = validAttempts.length > 0 
              ? Math.round((validAttempts.reduce((acc, a) => acc + (a.score / a.total), 0) / validAttempts.length) * 100) 
              : 0;
            const quizzesPassed = attempts.filter(a => a.passed).length;
            
            // Streak
            const uniqueDates = [...new Set(attempts.map(a => new Date(a.completed_at).toDateString()))];
            uniqueDates.sort((a, b) => new Date(b) - new Date(a));
            let currentStreak = 0;
            const today = new Date();
            today.setHours(0,0,0,0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            let currentCheck = new Date(today);
            if (uniqueDates.includes(today.toDateString())) {
               currentStreak = 1;
               currentCheck.setDate(currentCheck.getDate() - 1);
               while(uniqueDates.includes(currentCheck.toDateString())) {
                  currentStreak++;
                  currentCheck.setDate(currentCheck.getDate() - 1);
               }
            } else if (uniqueDates.includes(yesterday.toDateString())) {
               currentStreak = 1;
               currentCheck = new Date(yesterday);
               currentCheck.setDate(currentCheck.getDate() - 1);
               while(uniqueDates.includes(currentCheck.toDateString())) {
                  currentStreak++;
                  currentCheck.setDate(currentCheck.getDate() - 1);
               }
            }

            setStats({ totalScore, accuracy, quizzesPassed, streak: currentStreak });
            
            const formattedHistory = attempts.slice(0, 5).map(a => ({
              id: a.id,
              title: a.quiz_title || 'Mock Assessment',
              score: `${a.score}/${a.total}`,
              date: new Date(a.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
              status: a.passed ? 'Passed' : 'Failed'
            }));
            setHistory(formattedHistory);
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleAvatarUpload = (e) => {
     const file = e.target.files[0];
     if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
           setEditForm({ ...editForm, avatar: reader.result });
        };
        reader.readAsDataURL(file);
     }
  };

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


  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 p-6 md:p-12">
       <div className="max-w-4xl mx-auto">
          
          <div className="mb-10 flex items-center justify-between">
             <Link href="/dashboard" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 font-bold text-sm uppercase tracking-widest transition">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Portal
             </Link>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 md:p-16 shadow-xl border border-gray-100 dark:border-slate-700 mb-10 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-bl-[10rem] opacity-50"></div>
             
             <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="w-40 h-40 shrink-0 bg-gray-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center shadow-inner border-4 border-white relative overflow-hidden group">
                   {(isEditing ? editForm.avatar : profile.avatar) ? (
                      <img src={isEditing ? editForm.avatar : profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                      <UserCircle2 className="w-20 h-20 text-gray-300" />
                   )}
                   {isEditing && (
                      <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                         <Camera className="w-8 h-8 mb-2" />
                         <span className="text-xs font-bold">Upload Pic</span>
                         <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                   )}
                </div>
                <div className="text-center md:text-left flex-1 w-full relative">
                   
                   {!isEditing && (
                      <button onClick={() => { setEditForm(profile); setIsEditing(true); }} className="absolute -top-4 -right-4 p-3 bg-gray-50 dark:bg-slate-900 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition" title="Edit Full Profile">
                         <Edit3 className="w-6 h-6" />
                      </button>
                   )}

                   {isEditing ? (
                      <div className="bg-white dark:bg-slate-800/80 p-8 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm backdrop-blur-sm -mt-4">
                         <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center"><Edit3 className="w-5 h-5 mr-3 text-blue-600"/> Edit Details</h3>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><User className="w-3 h-3 inline mr-1"/> Full Name</label>
                               <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><Briefcase className="w-3 h-3 inline mr-1"/> Professional Title</label>
                               <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="e.g. Software Engineer" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><MapPin className="w-3 h-3 inline mr-1"/> State</label>
                               <input list="state-options" type="text" value={editForm.state} onChange={(e) => setEditForm({...editForm, state: e.target.value, city: ''})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="Search State..." />
                               <datalist id="state-options">
                                  {Object.keys(INDIA_STATES_CITIES).map(s => <option key={s} value={s} />)}
                               </datalist>
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><MapPin className="w-3 h-3 inline mr-1"/> City</label>
                               <input list="city-options" type="text" value={editForm.city} onChange={(e) => setEditForm({...editForm, city: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="Select or type City..." />
                               <datalist id="city-options">
                                  {editForm.state && INDIA_STATES_CITIES[editForm.state] && INDIA_STATES_CITIES[editForm.state].map(c => <option key={c} value={c} />)}
                               </datalist>
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Age</label>
                               <input type="number" value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="e.g. 21" />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><GraduationCap className="w-3 h-3 inline mr-1"/> Qualification</label>
                               <select value={editForm.qualification} onChange={(e) => setEditForm({...editForm, qualification: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm">
                                  <option value="">Select Qualification...</option>
                                  <option value="High School">High School (10+2)</option>
                                  <option value="Undergraduate">Undergraduate Degree</option>
                                  <option value="Postgraduate">Postgraduate Degree</option>
                                  <option value="Doctorate">Doctorate (Ph.D)</option>
                                  <option value="Other">Other</option>
                               </select>
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><LinkIcon className="w-3 h-3 inline mr-1"/> LinkedIn</label>
                               <input type="text" value={editForm.linkedin} onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="https://linkedin.com/in/..." />
                            </div>
                            <div>
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><GitBranch className="w-3 h-3 inline mr-1"/> GitHub</label>
                               <input type="text" value={editForm.github} onChange={(e) => setEditForm({...editForm, github: e.target.value})} className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 max-w-sm" placeholder="https://github.com/..." />
                            </div>
                            <div className="md:col-span-2">
                               <label className="block text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2"><FileText className="w-3 h-3 inline mr-1"/> About You</label>
                               <textarea value={editForm.about} onChange={(e) => setEditForm({...editForm, about: e.target.value})} rows="3" className="w-full border-gray-200 dark:border-slate-700 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="A short bio..."></textarea>
                            </div>
                         </div>
                         
                         <div className="flex gap-4 justify-end mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-3 font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:text-gray-200 transition">Cancel</button>
                            <button onClick={saveProfile} className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition flex items-center">
                               Save Profile <Check className="w-5 h-5 ml-2"/>
                            </button>
                         </div>
                      </div>
                   ) : (
                      <>
                         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                            <div>
                               <h1 className="text-5xl font-black text-gray-900 dark:text-white">{profile.name}</h1>
                               {profile.title && <p className="text-xl font-bold text-gray-500 dark:text-gray-400 mt-2">{profile.title}</p>}
                            </div>
                            <div className="flex items-center gap-3">
                               {profile.linkedin && (
                                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition shadow-sm">
                                     <LinkIcon className="w-5 h-5" />
                                  </a>
                               )}
                               {profile.github && (
                                  <a href={profile.github} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-900 hover:text-white transition shadow-sm border border-gray-200 dark:border-slate-700 hover:border-gray-900">
                                     <GitBranch className="w-5 h-5" />
                                  </a>
                               )}
                            </div>
                         </div>
                         
                         <p className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-6 flex justify-center md:justify-start items-center">
                            <Award className="w-4 h-4 mr-2" /> Tier 1 Aspirant
                         </p>

                         <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
                            <div className="flex items-center text-gray-600 dark:text-gray-400"><MapPin className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.city !== 'Not Set' ? `${profile.city}${profile.state ? `, ${profile.state}` : ''}` : 'Location Not Set'}</span></div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400"><User className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.age !== 'Not Set' ? `${profile.age} Yrs` : 'Age Not Set'}</span></div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400"><GraduationCap className="w-5 h-5 mr-3 text-gray-400"/> <span className="font-bold">{profile.qualification || 'Qualification Not Set'}</span></div>
                         </div>
                         
                         {profile.about && (
                            <div className="bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 mb-8 max-w-2xl">
                               <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3"><FileText className="w-3 h-3 inline mr-2"/> About</p>
                               <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{profile.about}</p>
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
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Total Points</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalScore}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Accuracy</p>
                <p className="text-4xl font-black text-blue-600">{stats.accuracy}%</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Quizzes Passed</p>
                <p className="text-4xl font-black text-green-500">{stats.quizzesPassed}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Certificates</p>
                <p className="text-4xl font-black text-purple-600">3</p>
             </div>
          </div>

          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center">
             <Calendar className="w-6 h-6 mr-3 text-gray-400" /> Recent Assessment History
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
             {history.map((h, i) => (
                <div key={h.id} className={`p-6 flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 dark:bg-slate-900 transition ${i !== history.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}>
                   <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{h.title}</h3>
                      <p className="text-sm font-medium text-gray-400">{h.date}</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</p>
                         <p className="font-black text-xl text-gray-900 dark:text-white">{h.score}</p>
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
