// pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login, register, loginWithGoogle, sendOtp, verifyOtp, forgotPassword } = useAuth();

  const [mode, setMode] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const getNextUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('next') || '/';
    }
    return '/';
  };

  const redirectToNext = () => {
    window.location.href = getNextUrl();
  };

  useEffect(() => {
    if (!loading && user) redirectToNext();
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--muted)' }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'register') {
        await register(email, password, name);
        toast.success('Account created!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      redirectToNext();
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Logged in with Google!');
      redirectToNext();
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    setIsLoading(true);
    try {
      await sendOtp(phone);
      toast.success('OTP sent!');
      setMode('otp');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { toast.error('Enter 6-digit OTP'); return; }
    setIsLoading(true);
    try {
      await verifyOtp(phone, otp);
      toast.success('Phone verified!');
      redirectToNext();
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      toast.success('Reset link sent to your email!');
      setMode('login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50';
  const inputStyle = { background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--fg)' };
  const btnClass = 'w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30">
            <Skull className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--fg)' }}>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'phone' && 'Phone Login'}
            {mode === 'otp' && 'Verify OTP'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>
            {mode === 'login' && 'Sign in to continue shopping'}
            {mode === 'register' && 'Join the WrongMan family'}
            {mode === 'phone' && 'Enter your phone number'}
            {mode === 'otp' && `Code sent to +91 ${phone}`}
            {mode === 'forgot' && "We'll send you a reset link"}
          </p>
        </div>

        {(mode === 'login' || mode === 'register') && (
          <>
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Full Name</label>
                  <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} style={inputStyle} />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Email Address</label>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} style={inputStyle} required />
              </div>
              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode('forgot')} className="text-sm text-red-600 hover:underline">Forgot password?</button>
                </div>
              )}
              <button type="submit" disabled={isLoading} className={`${btnClass} bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25`}>
                {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div>
              <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>OR</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }}></div>
            </div>

            <div className="space-y-3">
              {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                <div className="w-full flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} theme="outline" shape="pill" size="large" text="continue_with" locale="en" />
                </div>
              )}
              <button onClick={() => setMode('phone')} className={`${btnClass} flex items-center justify-center gap-3`} style={{ background: 'var(--bg-3)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Continue with Phone
              </button>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-red-600 font-semibold hover:underline">
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </>
        )}

        {mode === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: 'var(--muted)' }}>+91</span>
                <input type="tel" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className={`${inputClass} pl-12`} style={inputStyle} required />
              </div>
            </div>
            <button type="submit" disabled={isLoading || phone.length !== 10} className={`${btnClass} bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25`}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-center py-2 hover:text-red-600 transition-colors" style={{ color: 'var(--muted)' }}>
              ← Back to Login
            </button>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Enter 6-digit OTP</label>
              <input type="text" placeholder="• • • • • •" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`} style={inputStyle} maxLength={6} required />
            </div>
            <button type="submit" disabled={isLoading || otp.length !== 6} className={`${btnClass} bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25`}>
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => { setMode('phone'); setOtp(''); }} style={{ color: 'var(--muted)' }} className="hover:text-red-600 transition-colors">← Change Number</button>
              <button type="button" onClick={handleSendOtp} className="text-red-600 font-medium hover:underline" disabled={isLoading}>Resend OTP</button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} style={inputStyle} required />
            </div>
            <button type="submit" disabled={isLoading} className={`${btnClass} bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25`}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-sm text-center py-2 hover:text-red-600 transition-colors" style={{ color: 'var(--muted)' }}>
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}