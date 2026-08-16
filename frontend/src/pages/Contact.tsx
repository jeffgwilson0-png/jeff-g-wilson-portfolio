import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, Github, Linkedin, Instagram, Twitter, CheckCircle2, MessageSquare } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { Profile } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const Contact: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitInquiry({
        category: 'general',
        full_name: name,
        email,
        description_or_message: message,
      });
      success('Message sent successfully!');
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      error(err.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 sm:px-8 space-y-12 pb-20">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <Mail className="w-4 h-4" />
          <span>Get In Touch</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
          Contact <span className="text-primary">Jeff G. Wilson</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Reach out directly for consulting, speaking engagements, technical advisory, or general questions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-8 space-y-6">
            <h3 className="font-display text-xl font-bold text-on-surface border-b border-white/10 pb-3">
              Direct Channels
            </h3>

            <div className="space-y-4 font-mono text-xs">
              {profile?.email && (
                <div className="flex items-start gap-3 text-on-surface">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-on-surface-variant block">Email:</span>
                    <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors font-medium">
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-start gap-3 text-on-surface">
                  <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-on-surface-variant block">Location:</span>
                    <span className="font-medium">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Grid */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3">
                Social Profiles
              </h4>
              <div className="flex flex-wrap gap-2">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {profile?.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {profile?.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Contact Form */}
        <GlassCard variant="heavy" className="lg:col-span-7 p-8 sm:p-10 relative overflow-hidden">
          {submitted ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface">Message Received!</h3>
              <p className="font-body text-sm text-on-surface-variant max-w-sm">
                Thank you for your message. I will respond to your email as soon as possible.
              </p>
              <GlassButton variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                Send Another Message
              </GlassButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="font-display text-xl font-bold text-on-surface border-b border-white/10 pb-3">
                Send a Direct Message
              </h2>

              <GlassInput
                label="Your Name *"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <GlassInput
                label="Your Email *"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <GlassTextarea
                label="Message *"
                placeholder="Write your message, proposal, or inquiry here..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <div className="flex justify-end">
                <GlassButton
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </GlassButton>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
