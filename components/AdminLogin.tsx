import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert } from 'lucide-react';
import { ParticlesBackground } from './ParticlesBackground';

interface Props {
  onLogin: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'A199710' && password === '123456') {
      onLogin();
    } else {
      setError('Invalid Administrator Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-blue-50 z-0"></div>
      <ParticlesBackground 
        className="absolute inset-0 w-full h-full z-0"
        particleCountFactor={6000}
        baseSpeed={0.4}
        particleColor="rgba(99, 102, 241, 0.3)" 
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 mt-2 text-sm">Restricted Access. Authorized personnel only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Admin ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ShieldAlert className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => { setId(e.target.value); setError(''); }}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                  placeholder="Enter Admin ID"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                  placeholder="Enter Password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium text-center animate-in fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
              Authenticate
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            System ID: UKM-MIS-2025-V1.0
          </p>
        </div>
      </div>
    </div>
  );
};