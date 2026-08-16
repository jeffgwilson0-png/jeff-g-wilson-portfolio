import React, { useState } from 'react';
import {
  Brain,
  Globe,
  Smartphone,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  Building
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassSelect } from '../components/common/GlassSelect';
import { useToast } from '../contexts/ToastContext';
import { api } from '../api/client';
import { clsx } from 'clsx';

type ServiceTab = 'research' | 'web' | 'mobile' | 'general';

export const WorkWithMe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('research');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const { success, error } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_or_institution: '',
    project_title_or_name: '',
    research_area: '',
    project_type: '',
    platform: 'Both',
    has_design: false,
    budget: '',
    timeline: '',
    description_or_message: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.description_or_message) {
      error('Please complete all required fields (Name, Email, and Description).');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitInquiry({
        category: activeTab,
        full_name: formData.full_name,
        email: formData.email,
        company_or_institution: formData.company_or_institution,
        project_title_or_name: formData.project_title_or_name,
        research_area: activeTab === 'research' ? formData.research_area : undefined,
        project_type: activeTab === 'web' ? formData.project_type : undefined,
        platform: activeTab === 'mobile' ? formData.platform : undefined,
        has_design: activeTab === 'mobile' ? formData.has_design : false,
        budget: formData.budget,
        timeline: formData.timeline,
        description_or_message: formData.description_or_message,
      });

      success('Thank you! Your inquiry has been submitted successfully.');
      setSubmittedSuccess(true);
      setFormData({
        full_name: '',
        email: '',
        company_or_institution: '',
        project_title_or_name: '',
        research_area: '',
        project_type: '',
        platform: 'Both',
        has_design: false,
        budget: '',
        timeline: '',
        description_or_message: '',
      });
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      error(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'research' as ServiceTab, label: 'Research Collaboration', icon: Brain, color: 'text-primary' },
    { id: 'web' as ServiceTab, label: 'Web Platform', icon: Globe, color: 'text-secondary' },
    { id: 'mobile' as ServiceTab, label: 'Mobile App', icon: Smartphone, color: 'text-tertiary' },
    { id: 'general' as ServiceTab, label: 'General Inquiry', icon: MessageSquare, color: 'text-primary' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-6 sm:px-8 space-y-12 pb-20">
      {/* Hero Header */}
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-primary font-mono text-xs uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Let's Connect & Collaborate</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-on-surface leading-tight">
          HAVE AN IDEA?<br />
          <span className="text-primary">LET'S BUILD IT.</span>
        </h1>
        <p className="font-body text-base sm:text-lg text-on-surface-variant leading-relaxed">
          Whether you are looking to collaborate on academic research, engineer a scalable web system, or develop a mobile app, let's connect.
        </p>
      </header>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap justify-center gap-3 p-2 rounded-2xl glass-panel-heavy max-w-fit mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSubmittedSuccess(false);
              }}
              className={clsx(
                'px-5 py-3 rounded-xl font-mono text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-all duration-200',
                isActive
                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(173,198,255,0.2)] font-bold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              )}
            >
              <Icon className={clsx('w-4 h-4', isActive ? 'text-primary' : tab.color)} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dynamic Form Container */}
      <GlassCard variant="heavy" className="p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {submittedSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface">Inquiry Sent Successfully!</h2>
            <p className="font-body text-base text-on-surface-variant max-w-md">
              Thank you for reaching out. Your proposal has been securely saved to the database. I will review it and get back to you promptly.
            </p>
            <GlassButton variant="secondary" size="md" onClick={() => setSubmittedSuccess(false)}>
              Send Another Inquiry
            </GlassButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Form Title & Subtitle */}
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-on-surface flex items-center gap-2">
                {activeTab === 'research' && <span>Academic & Research Collaboration</span>}
                {activeTab === 'web' && <span>Web Platform Engineering Proposal</span>}
                {activeTab === 'mobile' && <span>Mobile Application Development</span>}
                {activeTab === 'general' && <span>General Inquiry & Discussion</span>}
              </h2>
              <p className="font-mono text-xs text-on-surface-variant mt-1">
                Fill in the details below to initialize our discussion.
              </p>
            </div>

            {/* Standard Personal Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GlassInput
                label="Full Name *"
                placeholder="Dr. Jane Doe / Alexander Vance"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
              <GlassInput
                label="Email Address *"
                type="email"
                placeholder="jane@university.edu / name@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>

            {/* Tab-Specific Fields */}
            {activeTab === 'research' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <GlassInput
                  label="Institution / University"
                  placeholder="e.g., Marwadi University / MIT / OpenAI"
                  value={formData.company_or_institution}
                  onChange={(e) => handleChange('company_or_institution', e.target.value)}
                />
                <GlassSelect
                  label="Primary Research Domain"
                  value={formData.research_area}
                  onChange={(e) => handleChange('research_area', e.target.value)}
                >
                  <option value="">Select Domain</option>
                  <option value="Retrieval-Augmented Generation (RAG)">Retrieval-Augmented Generation (RAG)</option>
                  <option value="Multimodal Misinformation Detection">Multimodal Misinformation Detection</option>
                  <option value="Natural Language Processing (NLP)">Natural Language Processing (NLP)</option>
                  <option value="High-Performance Data Architecture">High-Performance Data Architecture</option>
                  <option value="Other AI/ML Topic">Other AI/ML Topic</option>
                </GlassSelect>

                <div className="sm:col-span-2">
                  <GlassInput
                    label="Research Title / Topic"
                    placeholder="e.g., Graph-augmented RAG Factuality in Healthcare"
                    value={formData.project_title_or_name}
                    onChange={(e) => handleChange('project_title_or_name', e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'web' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <GlassInput
                  label="Company / Organization"
                  placeholder="e.g., TechVentures Global / NGO Initiative"
                  value={formData.company_or_institution}
                  onChange={(e) => handleChange('company_or_institution', e.target.value)}
                />
                <GlassSelect
                  label="Project Type"
                  value={formData.project_type}
                  onChange={(e) => handleChange('project_type', e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="SaaS Platform">SaaS Application</option>
                  <option value="E-Commerce System">E-Commerce Solution</option>
                  <option value="Data Hub / Internal Tool">Data Hub / Internal Tool</option>
                  <option value="Portfolio / Branding Site">Portfolio / Branding Site</option>
                  <option value="Custom API Architecture">Custom API Architecture</option>
                </GlassSelect>

                <GlassSelect
                  label="Estimated Budget"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                >
                  <option value="">Select Budget Range</option>
                  <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000+">$25,000+</option>
                </GlassSelect>

                <GlassInput
                  label="Target Timeline"
                  placeholder="e.g., 6 weeks, starting next month"
                  value={formData.timeline}
                  onChange={(e) => handleChange('timeline', e.target.value)}
                />
              </div>
            )}

            {activeTab === 'mobile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <GlassInput
                    label="App / Concept Name"
                    placeholder="e.g., PulseFit Mobile / Community Tracker"
                    value={formData.project_title_or_name}
                    onChange={(e) => handleChange('project_title_or_name', e.target.value)}
                  />
                  <GlassSelect
                    label="Target Platform"
                    value={formData.platform}
                    onChange={(e) => handleChange('platform', e.target.value)}
                  >
                    <option value="Both">Both (iOS & Android)</option>
                    <option value="iOS">iOS Only (Apple)</option>
                    <option value="Android">Android Only</option>
                  </GlassSelect>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <GlassSelect
                    label="Estimated Budget"
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                  >
                    <option value="">Select Budget Range</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                    <option value="$20,000 - $50,000">$20,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </GlassSelect>

                  <GlassInput
                    label="Target Timeline"
                    placeholder="e.g., 2-3 months"
                    value={formData.timeline}
                    onChange={(e) => handleChange('timeline', e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl glass-panel">
                  <input
                    type="checkbox"
                    id="has_design"
                    checked={formData.has_design}
                    onChange={(e) => handleChange('has_design', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-surface text-primary focus:ring-primary"
                  />
                  <label htmlFor="has_design" className="font-mono text-xs text-on-surface cursor-pointer select-none">
                    UI/UX wireframes or Figma designs are already prepared
                  </label>
                </div>
              </div>
            )}

            {/* Description / Abstract Textarea */}
            <GlassTextarea
              label={
                activeTab === 'research'
                  ? 'Research Abstract / Collaboration Hypothesis *'
                  : activeTab === 'general'
                  ? 'Your Message *'
                  : 'Project Scope & Requirements Description *'
              }
              placeholder={
                activeTab === 'research'
                  ? 'Describe the scientific inquiry, dataset requirements, expected outcomes, and target publication venues...'
                  : 'Describe core functionality, user personas, technical requirements, integrations, or specific goals...'
              }
              rows={5}
              value={formData.description_or_message}
              onChange={(e) => handleChange('description_or_message', e.target.value)}
              required
            />

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                icon={<Send className="w-4 h-4" />}
              >
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
