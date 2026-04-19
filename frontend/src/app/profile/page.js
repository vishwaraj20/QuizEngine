"use client";
import { useEffect, useState } from 'react';
import { UserCircle, History, Clock, Pencil, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editBranch, setEditBranch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (!stored) {
      router.push('/auth');
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    setEditName(parsedUser.name || '');
    setEditEmail(parsedUser.email || '');
    setEditPhone(parsedUser.phone || '');
    setEditCollege(parsedUser.college || '');
    setEditBranch(parsedUser.branch || '');

    fetch(`http://localhost:5000/api/users/${parsedUser.id}/attempts`)
      .then(r => r.json())
      .then(data => {
        setAttempts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const saveProfile = () => {
    const updated = { ...user, name: editName, email: editEmail, phone: editPhone, college: editCollege, branch: editBranch };
    localStorage.setItem('quiz_user', JSON.stringify(updated));
    setUser(updated);
    setEditing(false);
    window.dispatchEvent(new Event('user_login'));
  };

  if (loading || !user) return <div className="p-10 text-center text-gray-500 font-medium">Loading your profile...</div>;

  const totalAttempts = attempts.length;
  const bestScoreObj = attempts.reduce((prev, current) => (prev.score > current.score) ? prev : current, { score: 0 });
  const averageScore = totalAttempts > 0
    ? (attempts.reduce((sum, a) => sum + (a.score / (a.total || 1)), 0) / totalAttempts) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
       <div className="max-w-4xl mx-auto">

          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
             <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                   <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex justify-center items-center mr-6 shadow-lg">
                      <span className="text-3xl font-bold">{user.name ? user.name.charAt(0).toUpperCase() : 'S'}</span>
                   </div>
                   <div>
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-gray-500 font-medium capitalize">{user.role} Account</p>
                      {user.email && <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>}
                   </div>
                </div>
                <button
                   onClick={() => setEditing(!editing)}
                   className="flex items-center px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition"
                >
                   {editing ? <><X className="w-4 h-4 mr-2"/>Cancel</> : <><Pencil className="w-4 h-4 mr-2"/>Edit Profile</>}
                </button>
             </div>

             {/* Stats Row */}
             <div className="flex space-x-4">
                <div className="flex-1 px-4 py-3 bg-blue-50 rounded-xl text-center"><p className="text-2xl font-bold text-blue-700">{totalAttempts}</p><p className="text-xs text-blue-500 font-medium">Quizzes Taken</p></div>
                <div className="flex-1 px-4 py-3 bg-green-50 rounded-xl text-center"><p className="text-2xl font-bold text-green-700">{averageScore.toFixed(0)}%</p><p className="text-xs text-green-500 font-medium">Avg Score</p></div>
                <div className="flex-1 px-4 py-3 bg-yellow-50 rounded-xl text-center"><p className="text-2xl font-bold text-yellow-700">{bestScoreObj.score}</p><p className="text-xs text-yellow-500 font-medium">Best Score</p></div>
             </div>
          </div>

          {/* Edit Profile Section */}
          {editing && (
             <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><Pencil className="w-5 h-5 mr-3 text-blue-600"/>Edit Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="Your name"/>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                      <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="you@college.edu"/>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <input value={editPhone} onChange={e => setEditPhone(e.target.value)} type="tel" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="+91 98765 43210"/>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">College / University</label>
                      <input value={editCollege} onChange={e => setEditCollege(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="e.g. IIT Bombay"/>
                   </div>
                   <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Branch / Department</label>
                      <input value={editBranch} onChange={e => setEditBranch(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" placeholder="e.g. Computer Science"/>
                   </div>
                </div>
                <div className="mt-6 flex justify-end">
                   <button onClick={saveProfile} className="flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">
                      <Save className="w-5 h-5 mr-2"/> Save Changes
                   </button>
                </div>
             </div>
          )}

          {/* Previously Attempted Quizzes */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center"><History className="w-6 h-6 mr-3 text-purple-600"/> Previously Attempted Quizzes</h2>

             {attempts.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                   <p className="text-gray-500 mb-4">You haven&apos;t attempted any quizzes yet.</p>
                   <Link href="/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Browse Quizzes</Link>
                </div>
             ) : (
                <div className="space-y-4">
                  {attempts.map(attempt => {
                    const passPercent = (attempt.score / attempt.total) * 100;
                    const passed = passPercent >= 50;

                    return (
                      <div key={attempt.id} className="p-5 border rounded-2xl flex justify-between items-center hover:bg-gray-50 transition">
                         <div>
                           <h3 className="font-bold text-lg text-gray-900">{attempt.quiz_title}</h3>
                           <div className="flex items-center text-sm text-gray-500 mt-1">
                             <Clock className="w-4 h-4 mr-1.5" /> {new Date(attempt.completed_at).toLocaleDateString()}
                             <span className="mx-3 border-l h-3 border-gray-300"></span>
                             {attempt.category || 'General'}
                           </div>
                         </div>
                         <div className="flex items-center space-x-6">
                            <div className="text-right">
                               <p className="text-sm text-gray-500 font-medium">Score</p>
                               <p className="font-bold text-xl">{attempt.score} <span className="text-gray-400 text-sm">/ {attempt.total}</span></p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-bold text-sm ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               {passed ? 'Passed' : 'Failed'}
                            </div>
                         </div>
                      </div>
                    )
                  })}
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
