import React, { useState } from 'react';
import { Mail, ShieldCheck, X, ArrowRight, Loader2, FileText, Lock } from 'lucide-react';
import { supabase } from '../services/supabase'; // Import your configured Supabase client

interface Props {
  onClose: () => void;
  onLogin: (email: string) => void;
}

export const StudentLoginModal: React.FC<Props> = ({ onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [showTOS, setShowTOS] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    
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

  // Pop-out Modal Component for TOS and Privacy
  const InfoModal = ({ title, icon: Icon, children, onClose }: any) => (
    <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col pt-16 px-6 pb-6 animate-in slide-in-from-bottom-4 duration-300">
      <button 
        onClick={onClose}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2"
        type="button"
      >
        <X className="w-5 h-5" /> 
        <span className="text-sm font-bold uppercase">Back to Login</span>
      </button>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        <div className="prose prose-sm text-slate-600">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/60 animate-in zoom-in-95 duration-300 relative h-[600px] flex flex-col">
        
        {/* TOS Overlay */}
        {showTOS && (
          <InfoModal title="Terms of Service" icon={FileText} onClose={() => setShowTOS(false)}>
            <p className="font-medium text-slate-900 mb-4">Effective Date: May 24, 2026</p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using this platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            
            <h3>2. User Responsibilities & Conduct</h3>
            <p>Users must submit genuine, constructive, and respectful feedback. Any form of harassment, hate speech, spamming, or sharing of strictly confidential exam materials is prohibited and will result in moderation action.</p>
            
            <h3>3. Accuracy of Information</h3>
            <p>We do not verify the factual accuracy of every user review. Experiences are subjective and represent the opinions of individual students, not the institution.</p>

            <h3>4. Account Suspension</h3>
            <p>Administrators reserve the right to remove access or censor content that violates these guidelines to maintain a safe community environment.</p>
          </InfoModal>
        )}

        {/* Privacy Policy Overlay */}
        {showPrivacy && (
          <InfoModal title="Privacy Policy" icon={Lock} onClose={() => setShowPrivacy(false)}>
            <p className="font-medium text-slate-900 mb-4">Your Privacy Matters to Us</p>
            <h3>1. Data Collection</h3>
            <p>We collect your Siswa email strictly for verification purposes to ensure reviews are from legitimate students. We do not track your browsing history or collect unnecessary metadata.</p>
            
            <h3>2. Anonymity & Display Name</h3>
            <p>Once verified, your email address is fully anonymized. Reviews are tied to pseudonymous usernames to encourage honest feedback without fear of academic retaliation.</p>
            
            <h3>3. Data Protection</h3>
            <p>Your authentication tokens and email records are secured via Supabase using industry-standard encryption. We do not sell your data to third parties.</p>

            <h3>4. Your Rights</h3>
            <p>You have the right to request the deletion of your account and associated reviews at any time by contacting the administration.</p>
          </InfoModal>
        )}

        {/* Close Button */}
        {!showTOS && !showPrivacy && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
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
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => { setAgreedToTerms(e.target.checked); setError(''); }}
                  className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-slate-600 leading-snug">
                I agree to the{' '}
                <button type="button" onClick={() => setShowTOS(true)} className="text-blue-600 font-medium hover:underline">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" onClick={() => setShowPrivacy(true)} className="text-blue-600 font-medium hover:underline">
                  Privacy Policy
                </button>.
              </label>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-medium ml-1 animate-in slide-in-from-top-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

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