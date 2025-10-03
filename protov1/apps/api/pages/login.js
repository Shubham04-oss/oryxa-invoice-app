import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { authService } from '../lib/api';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'admin@oryxa.com',
    password: 'demo123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if already logged in
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-50" 
        style={{ 
          background: 'radial-gradient(circle at 20% 50%, rgba(20, 184, 166, 0.15), transparent 50%), radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.15), transparent 50%)' 
        }} 
      />
      
      {/* Login Card */}
      <div className="glass-card p-8 max-w-md w-full relative z-10 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 
            className="gradient-text mb-2" 
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: '700' }}
          >
            Oryxa
          </h1>
          <p className="text-tertiary" style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
            Invoice & Automation Platform
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg animate-fade-in" 
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5'
            }}
          >
            <p style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              className="block text-secondary mb-2" 
              style={{ fontSize: '0.875rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-glass"
              placeholder="admin@oryxa.com"
              required
            />
          </div>

          <div>
            <label 
              className="block text-secondary mb-2" 
              style={{ fontSize: '0.875rem', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}
            >
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-glass"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between" style={{ fontSize: '0.875rem' }}>
            <label className="flex items-center gap-2 text-tertiary cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="btn-ghost"
              style={{ 
                padding: '0.25rem', 
                color: 'var(--accent-start)',
                fontWeight: '500'
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid var(--border-color)' }} />
          </div>
          <div className="relative flex justify-center" style={{ fontSize: '0.875rem' }}>
            <span 
              className="px-4 text-tertiary" 
              style={{ background: 'var(--bg-surface)' }}
            >
              Demo Credentials
            </span>
          </div>
        </div>

        {/* Demo Info */}
        <div 
          className="text-center text-tertiary space-y-1" 
          style={{ fontSize: '0.875rem', fontFamily: 'JetBrains Mono, monospace' }}
        >
          <p>Email: admin@oryxa.com</p>
          <p>Password: demo123</p>
        </div>

        {/* Footer */}
        <div 
          className="mt-8 text-center text-tertiary" 
          style={{ fontSize: '0.875rem' }}
        >
          Don't have an account?{' '}
          <button 
            className="btn-ghost"
            style={{ 
              padding: '0.25rem', 
              color: 'var(--accent-start)',
              fontWeight: '500'
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
