import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/auth';

const Login = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Call real login API
      const response = await authAPI.login(email, password);
      
      // 2. Extract tokens from API response
      // Structure varies based on backend, using fallback optional chaining
      const accessToken = response?.accessToken || response?.data?.accessToken;
      const refreshToken = response?.refreshToken || response?.data?.refreshToken;

      // 3. Save explicitly to localStorage so interceptors will pick them up
      if (accessToken) localStorage.setItem('accessToken', accessToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

      // 4. Derive correct role from the API response or fallback to email test
      const responseRole = response?.role || response?.user?.role || response?.data?.role;
      const userRole = responseRole || (email.toLowerCase().includes('admin') ? 'admin' : 'employee');

      toast.success('Login Successful!');
      login(userRole); // Call context login

    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || 'Invalid credentials or API unreachable.');
      
      // Optional: For testing purposes if backend is down, we automatically let the user in if they typed admin 
      // (REMOVE this block in production)
      if (!error.response) {
        toast('Simulation fallback -> letting you in since API is down.');
        const userRole = email.toLowerCase().includes('admin') ? 'admin' : 'employee';
        localStorage.setItem('accessToken', 'mock_token');
        login(userRole);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#eef2f0] relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-300/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden z-10 mx-4 border border-white/50">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#1e3a34] to-[#2f6645] text-white relative">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-[#9ae66e] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <ShieldCheck className="text-[#1e3a34] w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">EcoConstruct <span className="text-[#9ae66e]">CRM</span></span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Manage your <span className="text-[#9ae66e]">projects</span> with confidence.
            </h1>
            <p className="text-green-100/80 text-lg max-w-md leading-relaxed">
              The all-in-one construction management platform designed for modern teams.
            </p>
          </div>

          <div className="z-10 space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#9ae66e]/20 flex items-center justify-center">
                <CheckCircle2 className="text-[#9ae66e] w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Real-time Analytics</p>
                <p className="text-xs text-green-100/60">Track progress instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#9ae66e]/20 flex items-center justify-center">
                <CheckCircle2 className="text-[#9ae66e] w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Smart Resource Allocation</p>
                <p className="text-xs text-green-100/60">Optimize your workforce</p>
              </div>
            </div>
          </div>

          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[80px]"></div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2f6645] transition-colors" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f6645]/20 focus:border-[#2f6645] transition-all text-slate-900 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-[#2f6645] hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2f6645] transition-colors" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2f6645]/20 focus:border-[#2f6645] transition-all text-slate-900 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#2f6645] focus:ring-[#2f6645]" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-[#2f6645] hover:bg-[#1e3a34] text-white rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-green-900/20 active:scale-[0.98] ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Portal
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account? <a href="#" className="font-bold text-[#2f6645] hover:underline">Contact Administrator</a>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="absolute bottom-8 text-slate-400 text-xs font-medium">
        © 2026 EcoConstruct CRM. All rights reserved. Built for Excellence.
      </p>
    </div>
  );
};

export default Login;
