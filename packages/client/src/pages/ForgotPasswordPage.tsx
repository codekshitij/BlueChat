import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to request password reset.');
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden flex items-center justify-center p-4">
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
          <p className="text-muted-foreground text-sm">Enter your email to receive a reset link</p>
        </div>
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          {submitted ? (
            <div className="text-green-600 text-center">
              If an account with that email exists, a reset link has been sent.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button type="submit" className="w-full bg-gradient-to-r from-primary via-accent to-secondary text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                Request Reset
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

export default ForgotPasswordPage;
