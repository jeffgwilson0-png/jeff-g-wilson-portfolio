import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { BackgroundGlows } from '../components/layout/BackgroundGlows';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      success('Welcome back to the Admin Console!');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 relative bg-background text-on-surface">
      <BackgroundGlows />

      {/* Top Bar for Back & Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 max-w-[1200px] mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <GlassCard variant="heavy" className="w-full max-w-md p-8 sm:p-10 relative z-10 shadow-2xl border border-white/20">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface">Admin Console</h1>
            <p className="font-mono text-xs text-on-surface-variant mt-1">
              Secure authentication for Jeff G. Wilson
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <GlassInput
            label="Email Address"
            type="email"
            placeholder="admin@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <GlassInput
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Authenticating...' : 'Sign In to Console'}
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
