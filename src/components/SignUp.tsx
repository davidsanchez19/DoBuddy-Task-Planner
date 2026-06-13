import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignUpProps {
  onSignUp: (email: string, name: string) => void;
  onToggleMode: () => void;
}

export default function SignUp({ onSignUp, onToggleMode }: SignUpProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', pct: 0, color: 'bg-outline-variant', labelColor: 'text-on-surface-variant' };
    if (password.length < 5) return { label: 'Weak', pct: 25, color: 'bg-error', labelColor: 'text-error' };
    if (password.length < 8) return { label: 'Medium', pct: 60, color: 'bg-tertiary-container', labelColor: 'text-tertiary' };
    return { label: 'Strong', pct: 100, color: 'bg-secondary', labelColor: 'text-secondary' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('Access Denied: Self-registration is disabled. Please log in with authorized credentials.');
  };

  const handleSocialClick = (provider: string) => {
    setError('Access Denied: Social Registration is disabled for safety/security.');
  };

  return (
    <div className="w-full max-w-[480px] z-10 animate-fade-in py-10 px-4">
      {/* Brand Anchor */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-container text-white mb-2 shadow-sm">
          <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h1 className="font-display text-4xl font-bold text-primary tracking-tight">DoBuddy</h1>
      </div>

      {/* Signup Card */}
      <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8 md:p-10">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-on-surface mb-1">Create Account</h2>
          <p className="text-sm text-on-surface-variant font-medium">
            Registration is restricted.
          </p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-bold text-red-500 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant px-1" htmlFor="fullName">
              Full Name
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <UserIcon className="w-[18px] h-[18px]" />
              </span>
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface transition-all duration-200 outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10"
                id="fullName"
                placeholder="Enter your full name"
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant px-1" htmlFor="email">
              Work Email
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Mail className="w-[18px] h-[18px]" />
              </span>
              <input
                className="w-full pl-12 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface transition-all duration-200 outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10"
                id="email"
                placeholder="name@company.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant px-1" htmlFor="password">
              Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Lock className="w-[18px] h-[18px]" />
              </span>
              <input
                className="w-full pl-12 pr-12 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface transition-all duration-200 outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10"
                id="password"
                placeholder="At least 8 characters"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 flex-1 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                    style={{ width: `${strength.pct}%` }}
                  ></div>
                </div>
                <span className={`text-[11px] font-semibold ${strength.labelColor}`}>
                  Security: {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 py-1">
            <input
              className="mt-1 w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              id="terms"
              required
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label className="text-xs text-on-surface-variant leading-relaxed select-none cursor-pointer" htmlFor="terms">
              I agree to the{' '}
              <a onClick={(e) => { e.preventDefault(); alert('Terms of Service: Play nicely with productivity!'); }} className="text-primary font-semibold hover:underline" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Your local task data is 100% private to this browser!'); }} className="text-primary font-semibold hover:underline" href="#">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* CTA Button */}
          <button
            className="mt-2 w-full bg-primary text-white font-semibold py-3.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            type="submit"
          >
            <span>Create Account</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </form>

        {/* Social Sign Up Divider */}
        <div className="relative flex items-center gap-3 my-6">
          <div className="h-[1px] flex-1 bg-outline-variant"></div>
          <span className="text-[10px] font-semibold text-outline uppercase tracking-wider">
            Or register with
          </span>
          <div className="h-[1px] flex-1 bg-outline-variant"></div>
        </div>

        {/* Social Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialClick('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <img
              alt="Google"
              className="w-4 h-4 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChvtB1AIKEn0GwHUjoG_ca969DMazz_QA3T4n95vIfqGvWtmTJhxGdWAshfyZmYU6gwYddxQtCMEgfhWf-tErYCJAzb5YRFNmqVgolxRmwu72JgeaL13ZX1STJOOiosHuql4kJg6uKvlZ_iNllKXhFr5MXVx9zL7vwssNaJScrnspwnE7_gqhlGaAdNVkgb-LheZwUgdyaYz0iVwxbBEsjnilLb4tKk94ymoJB9CPyR4625sizsOoEz0RLm8IiUfkb53onRX0iTFA"
            />
            <span>Google</span>
          </button>
          <button
            onClick={() => handleSocialClick('GitHub')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-on-surfacefill" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.435 22 12.017 22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        <footer className="mt-10 pt-6 border-t border-outline-variant/30 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            Already have an account?
            <button
              onClick={onToggleMode}
              className="text-primary font-bold hover:underline underline-offset-4 transition-all ml-1 cursor-pointer"
            >
              Log in instead
            </button>
          </p>
        </footer>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 flex items-center justify-center gap-3 opacity-50 text-outline">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">Enterprise Grade Security</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-wider">GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}
