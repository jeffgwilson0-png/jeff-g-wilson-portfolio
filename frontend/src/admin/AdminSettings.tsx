import React, { useEffect, useState } from 'react';
import { Settings, Shield, Lock, Save, Key, Mail, Database, Server, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassSelect } from '../components/common/GlassSelect';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auth Context for current user email
  const { user, refreshUser } = useAuth();

  // Password Change
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  // Email Change
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);

  const { success, error } = useToast();

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err: any) {
      error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateBulkSettings(settings);
      success('Site settings updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }

    setChangingPw(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      success('Password updated successfully! Please keep it secure.');
      setPwModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error(err.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailPasswordConfirm) {
      error('Please fill in all fields');
      return;
    }

    setChangingEmail(true);
    try {
      await api.changeEmail(newEmail, emailPasswordConfirm);
      await refreshUser();
      success(`Admin login email updated to: ${newEmail}`);
      setEmailModalOpen(false);
      setNewEmail('');
      setEmailPasswordConfirm('');
    } catch (err: any) {
      error(err.message || 'Failed to change login email');
    } finally {
      setChangingEmail(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading system settings..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-display text-2xl font-bold text-on-surface">Global System Settings</h1>
        <p className="font-mono text-xs text-on-surface-variant mt-1">
          Configure site metadata, security credentials, and system options.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Site Metadata */}
        <GlassCard variant="heavy" className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3 flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Site Metadata & SEO</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassInput
              label="Site Title"
              value={settings['site_title'] || ''}
              onChange={(e) => handleChange('site_title', e.target.value)}
              placeholder="Jeff G. Wilson — Portfolio & AI Research"
            />

            <GlassInput
              label="Public Contact Email"
              value={settings['contact_email'] || ''}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="contact@jeffgwilson.com"
            />
          </div>

          <GlassInput
            label="Site Tagline & Description"
            value={settings['site_description'] || ''}
            onChange={(e) => handleChange('site_description', e.target.value)}
            placeholder="Official portfolio and AI research showcase of Jeff G. Wilson"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassSelect
              label="Default Theme"
              value={settings['default_theme'] || 'dark'}
              onChange={(e) => handleChange('default_theme', e.target.value)}
            >
              <option value="dark">Liquid Glass Dark (Default)</option>
              <option value="light">Frosted Ice Light</option>
              <option value="system">System Preference</option>
            </GlassSelect>

            <GlassInput
              label="Google Analytics / Tracking ID"
              value={settings['google_analytics_id'] || ''}
              onChange={(e) => handleChange('google_analytics_id', e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </GlassCard>

        {/* Security & Access */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            <span>Admin Authentication & Security</span>
          </h2>

          <div className="space-y-4 divide-y divide-white/5">
            {/* Change Login Email */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">Admin Login Email</p>
                <p className="font-mono text-xs text-on-surface-variant">
                  Current login email: <span className="text-primary font-bold">{user?.email || 'admin@jeffgwilson.com'}</span>
                </p>
              </div>

              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEmailModalOpen(true)}
                icon={<Mail className="w-4 h-4 text-primary" />}
              >
                Change Email
              </GlassButton>
            </div>

            {/* Change Password */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <div>
                <p className="font-body text-sm font-semibold text-on-surface">Admin Password</p>
                <p className="font-mono text-xs text-on-surface-variant">
                  Update your CMS access password (requires current password).
                </p>
              </div>

              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPwModalOpen(true)}
                icon={<Key className="w-4 h-4 text-secondary" />}
              >
                Change Password
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        {/* System Telemetry Overview */}
        <GlassCard className="p-8 space-y-4">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3 flex items-center gap-2">
            <Server className="w-5 h-5 text-tertiary" />
            <span>Environment Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
              <span className="text-on-surface-variant">API Backend:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FastAPI Live
              </span>
            </div>

            <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
              <span className="text-on-surface-variant">Database:</span>
              <span className="text-primary font-bold">SQLite / Postgres</span>
            </div>

            <div className="p-4 rounded-xl glass-panel flex items-center justify-between">
              <span className="text-on-surface-variant">Design:</span>
              <span className="text-secondary font-bold">Liquid Glass</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex justify-end pt-4">
          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </GlassButton>
        </div>
      </form>

      {/* Change Email Modal */}
      <GlassModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Change Admin Login Email"
        maxWidth="sm"
      >
        <form onSubmit={handleChangeEmail} className="space-y-4">
          <p className="font-mono text-xs text-on-surface-variant">
            Enter your new login email and confirm with your current admin password.
          </p>

          <GlassInput
            label="New Admin Email *"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="youremail@example.com"
            required
          />

          <GlassInput
            label="Current Password (for confirmation) *"
            type="password"
            value={emailPasswordConfirm}
            onChange={(e) => setEmailPasswordConfirm(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <GlassButton type="button" variant="ghost" size="sm" onClick={() => setEmailModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm" disabled={changingEmail} icon={<Mail className="w-4 h-4" />}>
              {changingEmail ? 'Updating...' : 'Update Email'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Change Password Modal */}
      <GlassModal
        isOpen={pwModalOpen}
        onClose={() => setPwModalOpen(false)}
        title="Change Admin Password"
        maxWidth="sm"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <GlassInput
            label="Current Password *"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <GlassInput
            label="New Password (min 6 chars) *"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <GlassInput
            label="Confirm New Password *"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <GlassButton type="button" variant="ghost" size="sm" onClick={() => setPwModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm" disabled={changingPw} icon={<Lock className="w-4 h-4" />}>
              {changingPw ? 'Updating...' : 'Update Password'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
