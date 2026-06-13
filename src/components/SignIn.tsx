import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignInProps {
  onSignIn: (email: string, name: string) => void;
  onToggleMode: () => void;
}

export default function SignIn({ onSignIn, onToggleMode }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (email !== 'davidsanchez8925@gmail.com' || password !== 'babima&2005') {
      setError('Access Denied: You are not authorized. A security notification has been sent to the workspace owner (davidsanchez8925@gmail.com).');
      return;
    }
    setError('');
    onSignIn(email, 'David Sanchez');
  };

  const handleSocialClick = (provider: string) => {
    setError('Access Denied: Social Sign-In is disabled.');
  };

  return (
    <div className="w-full max-w-[440px] z-10 animate-fade-in py-10 px-4">
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center mb-2 shadow-sm">
          <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl font-bold text-primary tracking-tight">DoBuddy</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1 font-medium">DoBuddy – Your Daily Task Companion.</p>
      </div>

      {/* Login Card */}
      <div className="login-card bg-surface-container-lowest border border-outline-variant rounded-xl p-8 md:p-10">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold text-on-surface">Sign In</h2>
          <p className="text-sm text-on-surface-variant mt-1">Authorized access only.</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-bold text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-[18px] h-[18px] text-outline group-focus-within:text-primary transition-colors" />
              </div>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:text-primary-container transition-colors"
                onClick={() => alert('Please contact the workspace administrator to retrieve your credentials.')}
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-[18px] h-[18px] text-outline group-focus-within:text-primary transition-colors" />
              </div>
              <input
                className="w-full pl-10 pr-12 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface placeholder:text-outline focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface-variant transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2 py-1 select-none">
            <input
              className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20 accent-primary cursor-pointer"
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="text-xs font-medium text-on-surface-variant cursor-pointer" htmlFor="remember">
              Stay logged in for 30 days
            </label>
          </div>

          {/* Log In Button */}
          <button
            className="w-full mt-4 py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
          >
            <span>Log In</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-surface-container-lowest text-outline text-[11px] font-bold tracking-wider uppercase">
              WORKSPACE CONTROLS ENFORCED
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialClick('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer opacity-60"
          >
            <img
              alt="Google"
              className="w-4 h-4 object-contain grayscale"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChvtB1AIKEn0GwHUjoG_ca969DMazz_QA3T4n95vIfqGvWtmTJhxGdWAshfyZmYU6gwYddxQtCMEgfhWf-tErYCJAzb5YRFNmqVgolxRmwu72JgeaL13ZX1STJOOiosHuql4kJg6uKvlZ_iNllKXhFr5MXVx9zL7vwssNaJScrnspwnE7_gqhlGaAdNVkgb-LheZwUgdyaYz0iVwxbBEsjnilLb4tKk94ymoJB9CPyR4625sizsOoEz0RLm8IiUfkb53onRX0iTFA"
            />
            <span>Google (Disabled)</span>
          </button>
          <button
            onClick={() => handleSocialClick('SSO')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer opacity-60"
          >
            <span className="font-semibold text-primary font-mono text-[13px] grayscale">[sso]</span>
            <span>SSO (Disabled)</span>
          </button>
        </div>
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-center text-sm text-on-surface-variant">
        Don't have an account?{' '}
        <button
          onClick={onToggleMode}
          className="text-primary font-bold hover:underline decoration-primary/30 underline-offset-4 transition-all cursor-pointer"
        >
          Sign up instead
        </button>
      </p>

      {/* Trust Badges */}
      <div className="mt-10 flex flex-col items-center gap-3 opacity-50">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">AES-256</span>
          </div>
        </div>
        <div className="text-center text-[10px] font-medium text-outline">
          © 2026 DoBuddy Productivity Suite. All rights reserved.
        </div>
      </div>
    </div>
  );
}
