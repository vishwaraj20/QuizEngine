"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

    // Initialize Dark Mode from localStorage or system preference
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
       document.documentElement.classList.add('dark');
       setDarkMode(true);
    } else {
       document.documentElement.classList.remove('dark');
       setDarkMode(false);
    }

    return () => window.removeEventListener('user_login', handleStorageChange);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
       document.documentElement.classList.remove('dark');
       localStorage.setItem('theme', 'light');
       setDarkMode(false);
    } else {
       document.documentElement.classList.add('dark');
       localStorage.setItem('theme', 'dark');
       setDarkMode(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('quiz_user');
    setUser(null);
    router.push('/auth');
  };

  if (!loaded) return <nav className="flex space-x-6 text-sm"></nav>;

  return (
    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
      {/* Dynamic Links Based on Role */}
      {!user && (
         <Link href="/auth" className="px-4 py-2 bg-gray-900 dark:bg-blue-600 text-white rounded-md hover:bg-gray-800 dark:hover:bg-blue-700 transition">Login / Register</Link>
      )}

      {/* Simplified Navbar for Landing Page (Option 2) */}
      {user && pathname === '/' && (
         <div className="flex items-center space-x-4">
           <Link 
             href={user.role === 'admin' ? '/admin' : '/dashboard'} 
             className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold rounded-full shadow transition flex items-center gap-2 text-xs md:text-sm"
           >
             Go to Dashboard &rarr;
           </Link>
           <div className="flex items-center border-l pl-4 border-gray-300 dark:border-gray-700 space-x-3">
              <Link href={user.role === 'admin' ? '/admin' : '/profile'} className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow hover:shadow-md hover:scale-105 transition-transform" title="View Profile">
                {user.name ? user.name.charAt(0).toUpperCase() : (user.role === 'admin' ? 'A' : 'S')}
              </Link>
              <span className="text-blue-600 dark:text-blue-400 font-bold hidden md:inline">{user.name || 'Admin'}</span>
              <button onClick={logout} className="text-red-500 font-bold hover:underline text-xs">Logout</button>
           </div>
         </div>
      )}

      {user && user.role === 'admin' && pathname !== '/' && (
         <>
           <Link href="/admin/quizzes" className={`transition ${pathname === '/admin/quizzes' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Admin Dashboard</Link>
           <Link href="/admin" className={`transition ${pathname === '/admin' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Create Quiz</Link>
           <div className="flex items-center ml-4 border-l pl-4 border-gray-300 dark:border-gray-700 space-x-4">
              <span className="text-gray-400 dark:text-gray-500">Hi, Admin</span>
              <button onClick={logout} className="text-red-500 font-bold hover:underline">Logout</button>
           </div>
         </>
      )}

      {user && user.role === 'student' && pathname !== '/' && (
         <>
           <Link href="/dashboard" className={`transition ${pathname === '/dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Dashboard</Link>
           <Link href="/dashboard/leaderboard" className={`transition ${pathname === '/dashboard/leaderboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>Leaderboard</Link>
           <Link href="/profile" className={`transition ${pathname === '/profile' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>My Profile</Link>
           <div className="flex items-center ml-4 border-l pl-4 border-gray-300 dark:border-gray-700 space-x-3">
              <Link href="/profile" className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow hover:shadow-md hover:scale-105 transition-transform" title="View Profile">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Link>
              <span className="text-blue-600 dark:text-blue-400 font-bold hidden md:inline">{user.name}</span>
              <button onClick={logout} className="text-red-500 font-bold hover:underline text-xs">Logout</button>
           </div>
         </>
      )}

      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode} 
        className="ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition text-gray-500 dark:text-gray-200"
        title="Toggle Theme"
      >
         {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </nav>
  );
}
