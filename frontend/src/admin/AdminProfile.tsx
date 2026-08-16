import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Save, User, Camera, Check, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Profile } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, info } = useToast();

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch((err) => console.error('Error fetching profile:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      success('Profile updated successfully! Public website updated.');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      error(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB) and type
    if (!file.type.startsWith('image/')) {
      error('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploadingAvatar(true);
    try {
      const updated = await api.uploadAvatar(file);
      setProfile(updated);
      success('Profile photo uploaded and updated successfully!');
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      error(err.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile({ ...profile, avatar_url: '' });
      setProfile(updated);
      info('Profile avatar removed. Default placeholder active.');
    } catch (err: any) {
      error(err.message || 'Failed to remove avatar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return <LoadingSpinner text="Loading profile manager..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Profile & Identity Management</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage your public personal details, headline, biography, and profile photo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Photo Management Card */}
        <GlassCard variant="heavy" className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>Profile Photo & Avatar</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden glass-panel border-2 border-primary/30 shadow-xl group shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl">
                  {profile.name.charAt(0)}
                </div>
              )}

              {uploadingAvatar && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarSelect}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <GlassButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {profile.avatar_url ? 'Replace Photo' : 'Upload Photo'}
                </GlassButton>

                {profile.avatar_url && (
                  <GlassButton
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={saving}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Remove
                  </GlassButton>
                )}
              </div>

              <p className="font-mono text-xs text-on-surface-variant">
                Recommended: Square JPG, PNG, or WebP. Max 10MB.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Basic Personal Information */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
            Identity & Titles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassInput
              label="Full Name *"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />

            <GlassInput
              label="Headline / Subtitle"
              value={profile.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              helperText="e.g. Computer Engineer | Data Scientist | AI / ML Researcher"
            />

            <GlassInput
              label="Status Text"
              value={profile.status_text || ''}
              onChange={(e) => handleChange('status_text', e.target.value)}
              helperText="e.g. STATUS: ONLINE"
            />

            <GlassInput
              label="Currently Exploring"
              value={profile.currently_exploring || ''}
              onChange={(e) => handleChange('currently_exploring', e.target.value)}
              helperText="Shown on home avatar card"
            />

            <GlassInput
              label="Location"
              value={profile.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
            />

            <GlassInput
              label="Contact Email"
              type="email"
              value={profile.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <GlassTextarea
            label="Hero Short Bio"
            value={profile.short_bio || ''}
            onChange={(e) => handleChange('short_bio', e.target.value)}
            rows={3}
            helperText="Concise summary shown on Hero section"
          />

          <GlassTextarea
            label="Full Biography"
            value={profile.full_bio || ''}
            onChange={(e) => handleChange('full_bio', e.target.value)}
            rows={6}
            helperText="Detailed narrative shown on About page"
          />
        </GlassCard>

        {/* Social Links */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
            Social & External Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassInput
              label="GitHub URL"
              value={profile.github_url || ''}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/..."
            />
            <GlassInput
              label="LinkedIn URL"
              value={profile.linkedin_url || ''}
              onChange={(e) => handleChange('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
            <GlassInput
              label="Instagram URL"
              value={profile.instagram_url || ''}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              placeholder="https://instagram.com/..."
            />
            <GlassInput
              label="Twitter / X URL"
              value={profile.twitter_url || ''}
              onChange={(e) => handleChange('twitter_url', e.target.value)}
              placeholder="https://x.com/..."
            />
          </div>
        </GlassCard>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-4">
          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving Changes...' : 'Save Profile Changes'}
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
