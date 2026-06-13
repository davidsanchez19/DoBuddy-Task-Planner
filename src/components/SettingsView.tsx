import React, { useState } from 'react';
import { Settings as SettingsIcon, User, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  user: { name: string; email: string; avatar: string };
  onUpdateUser: (name: string, email: string) => void;
  onResetApp: () => void;
}

export default function SettingsView({ user, onUpdateUser, onResetApp }: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [prefNotification, setPrefNotification] = useState(true);
  const [prefAtmosphericGlow, setPrefAtmosphericGlow] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onUpdateUser(name, email);
    alert('Profile information updated successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all goals to default mock datasets? This resets your completed score progress.')) {
      onResetApp();
      alert('Application dataset reset successfully!');
    }
  };

  return (
    <div className="flex-1 p-6 max-w-[1280px] w-full mx-auto space-y-6">
      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-outline-variant shadow-sm select-none">
        <SettingsIcon className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold font-display text-on-surface">Application System Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Profile Card Box (7 cols) */}
        <div className="md:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3 select-none">
            <User className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold text-on-surface text-sm">Personal Developer Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Account name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/25 rounded-lg text-sm text-on-surface outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Work Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/25 rounded-lg text-sm text-on-surface outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-container text-white py-2 px-4 rounded-lg font-bold text-xs select-none shadow-sm cursor-pointer"
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Administration Box (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Preferences Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4 select-none">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-on-surface text-sm">System Experience Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between font-medium text-xs">
                <div>
                  <p className="text-on-surface font-semibold">Workspace Toast Updates</p>
                  <p className="text-on-surface-variant text-[10px] opacity-70 mt-0.5">Show notifications when goals are completed.</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary cursor-pointer border border-outline-variant rounded"
                  checked={prefNotification}
                  onChange={(e) => setPrefNotification(e.target.checked)}
                />
              </div>

              <div className="flex items-center justify-between font-medium text-xs">
                <div>
                  <p className="text-on-surface font-semibold">Atmospheric Mouse follow Glow</p>
                  <p className="text-on-surface-variant text-[10px] opacity-70 mt-0.5">Dynamic glowing mesh backing based on pointer triggers.</p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary cursor-pointer border border-outline-variant rounded"
                  checked={prefAtmosphericGlow}
                  onChange={(e) => setPrefAtmosphericGlow(e.target.checked)}
                />
              </div>
            </div>
          </div>

          {/* Reset utilities card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3 select-none">
              <ShieldAlert className="w-4 h-4 text-error" />
              <h3 className="font-display font-semibold text-on-surface text-sm">Workspace Diagnostics</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-on-surface-variant font-medium select-none">
                Resetting deletes all newly added goals, and reloads standard baseline project datasets on subsequent navigation terms.
              </p>
              <button
                onClick={handleReset}
                className="bg-error hover:bg-red-700 text-white py-2 px-3 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-red-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Local Dataset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
