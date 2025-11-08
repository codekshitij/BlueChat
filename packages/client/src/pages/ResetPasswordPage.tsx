import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to reset password.');
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="text-muted-foreground text-sm">Enter and confirm your new password</p>
        </div>
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
        {success ? (
          <div className="text-green-600 text-center">
            Password reset successful! <Link to="/login" className="text-primary underline">Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="New password"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Confirm new password"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
