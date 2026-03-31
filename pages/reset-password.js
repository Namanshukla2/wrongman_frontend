// pages/reset-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success('Password reset successful!');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50';
  const inputStyle = { background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--fg)' };

  if (success) {
    return (
      <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--fg)' }}>Password Reset!</h1>
          <p style={{ color: 'var(--muted)' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30">
            <Skull className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--fg)' }}>Reset Password</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>Enter your new password below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>New Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} style={inputStyle} required />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted)' }}>Confirm Password</label>
            <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} style={inputStyle} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25 transition-all disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}