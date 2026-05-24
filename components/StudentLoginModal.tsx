import React, { useState } from 'react';
import { Mail, ShieldCheck, X, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase'; // Import your configured Supabase client

interface Props {
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const StudentLoginModal: React.FC<Props> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 1. Strict Regex for UKM Matriculation Number Format
    // Matches: 1 letter (A/P) + 5 to 7 digits + @siswa.ukm.edu.my
    const ukmEmailRegex = /^[a-zA-Z]\d{5,7}@siswa\.ukm\.edu\.my$/i;

    if (!ukmEmailRegex.test(email)) {
      setError('Invalid format. Use your matric number (e.g., A123456@siswa.ukm.edu.my)');
      return;
    }

    setIsVerifying(true);
    
    try {
      // 2. Send a Magic Link using Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // This will append a 'verified=true' parameter when they click the link in their email
          emailRedirectTo: window.location.origin + '?verified=true', 
        }
      });

      if (error) throw error;

      // Change UI state to tell the user to check their email
      alert("Verification link sent! Please check your Siswa email inbox.");
      onClose(); 

    } catch (err: any) {
      setError(err.message || 'Failed to send verification email.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/60 animate-in zoom-in-95 duration-300 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Student Verification</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Verify your status to post trusted reviews.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">UKM Student Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300"
                  placeholder="A123456@siswa.ukm.edu.my"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-medium ml-1 animate-in slide-in-from-top-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-blue-600 hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-slate-900"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Login
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              By verifying, you gain a "Verified Student" badge on all your future reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};