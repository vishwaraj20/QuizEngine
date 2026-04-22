"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle, Shield, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // If successful, extract role from metadata or default to what was selected
        const dbRole = data.user.user_metadata?.role;
        
        if (dbRole && dbRole !== role) {
           await supabase.auth.signOut();
           throw new Error(`Invalid section. Please select the ${dbRole.charAt(0).toUpperCase() + dbRole.slice(1)} tab to log into this account.`);
        }

        const userRole = dbRole || role;
        const userName = data.user.user_metadata?.full_name || 'User';

        // Keep local storage for existing UI elements
        const userData = { role: userRole, name: userName, id: data.user.id };
        localStorage.setItem('quiz_user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user_login'));

        router.push(userRole === 'admin' ? '/admin' : '/dashboard');

      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role,
              full_name: name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
           const userData = { role, name, id: data.user.id };
           localStorage.setItem('quiz_user', JSON.stringify(userData));
           window.dispatchEvent(new Event('user_login'));
           router.push(role === 'admin' ? '/admin' : '/dashboard');
        } else {
           alert("Check your email to confirm your account!");
        }
      }
    } catch (error) {
       alert(error.message || "An error occurred during authentication.");
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p className="text-gray-500">Sign in to your CampusQuest portal.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UserCircle className="w-4 h-4 mr-2"/> Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${role === 'admin' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Shield className="w-4 h-4 mr-2"/> Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-gray-900 bg-white placeholder-gray-400 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-gray-900 bg-white placeholder-gray-400 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="you@college.edu"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                 <input 
                   type={showPassword ? "text" : "password"} 
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full text-gray-900 bg-white placeholder-gray-400 border-gray-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                   placeholder="••••••••"
                   required
                 />
                 <button 
                   type="button" 
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex justify-center items-center group transition ${role === 'admin' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                 <><Loader2 className="animate-spin w-5 h-5 mr-2"/> Authenticating...</>
              ) : (
                 <>
                   {isLogin ? 'Sign In' : 'Create Account'} 
                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                 </>
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-bold text-blue-600 hover:text-blue-800 transition"
            >
              {isLogin ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
