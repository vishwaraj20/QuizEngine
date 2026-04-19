"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('quiz_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoaded(true);

    const handleStorageChange = () => {
       const u = localStorage.getItem('quiz_user');
       setUser(u ? JSON.parse(u) : null);
    };
    window.addEventListener('user_login', handleStorageChange);
    return () => window.removeEventListener('user_login', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('quiz_user');
    setUser(null);
    router.push('/auth');
  };

  if (!loaded) return <nav className="flex space-x-6 text-sm"></nav>;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
      {/* Dynamic Links Based on Role */}
      {!user && (
         <Link href="/auth" className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition">Login / Register</Link>
      )}

      {user && user.role === 'admin' && (
         <>
           <Link href="/admin/quizzes" className="hover:text-blue-600 transition">Admin Dashboard</Link>
           <Link href="/admin" className="hover:text-blue-600 transition">Create Quiz</Link>
           <div className="flex items-center ml-4 border-l pl-4 border-gray-300 space-x-4">
              <span className="text-gray-400">Hi, Admin</span>
              <button onClick={logout} className="text-red-500 font-bold hover:underline">Logout</button>
           </div>
         </>
      )}

      {user && user.role === 'student' && (
         <>
           <Link href="/dashboard" className="hover:text-blue-600 transition">Quizzes & Leaderboard</Link>
           <Link href="/profile" className="hover:text-blue-600 transition">My Profile</Link>
           <div className="flex items-center ml-4 border-l pl-4 border-gray-300 space-x-3">
              <Link href="/profile" className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow hover:shadow-md hover:scale-105 transition-transform" title="View Profile">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Link>
              <span className="text-blue-600 font-bold hidden md:inline">{user.name}</span>
              <button onClick={logout} className="text-red-500 font-bold hover:underline text-xs">Logout</button>
           </div>
         </>
      )}
    </nav>
  );
}
