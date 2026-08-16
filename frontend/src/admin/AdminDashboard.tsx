import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  BookOpen,
  Sparkles,
  Briefcase,
  Mail,
  ArrowRight,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  MoreVertical,
  Activity,
  Layers
} from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AdminStats } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.getAdminStats()
      .then(setStats)
      .catch((err) => console.error('Error fetching admin stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleExportData = () => {
    if (!stats) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(stats, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_data_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    info('Exported portfolio database metrics');
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard telemetry..." className="min-h-[60vh]" />;
  }

  const totalInquiries = stats?.total_inquiries || 1;
  const researchPct = Math.round(((stats?.inquiry_categories?.research || 0) / totalInquiries) * 100) || 0;
  const webPct = Math.round(((stats?.inquiry_categories?.web || 0) / totalInquiries) * 100) || 0;
  const mobilePct = Math.round(((stats?.inquiry_categories?.mobile || 0) / totalInquiries) * 100) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface">Welcome back, Jeff.</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Here is what's happening with your portfolio today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton
            variant="secondary"
            size="md"
            onClick={handleExportData}
            icon={<Download className="w-4 h-4" />}
          >
            Export Metrics
          </GlassButton>

          <Link to="/admin/projects/new">
            <GlassButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
              New Project
            </GlassButton>
          </Link>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Total Projects */}
        <GlassCard
          hoverEffect
          className="p-6 flex flex-col justify-between"
          onClick={() => navigate('/admin/projects')}
        >
          <div className="flex items-center justify-between text-primary mb-3">
            <FolderGit2 className="w-6 h-6" />
            <span className="font-mono text-[11px] text-primary/80">+Live</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-on-surface">
              {stats?.total_projects || 0}
            </span>
            <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
              Total Projects
            </p>
          </div>
        </GlassCard>

        {/* Research Papers */}
        <GlassCard
          hoverEffect
          className="p-6 flex flex-col justify-between"
          onClick={() => navigate('/admin/research')}
        >
          <div className="flex items-center justify-between text-secondary mb-3">
            <BookOpen className="w-6 h-6" />
            <span className="font-mono text-[11px] text-secondary/80">Active</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-on-surface">
              {stats?.total_research || 0}
            </span>
            <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
              Research Papers
            </p>
          </div>
        </GlassCard>

        {/* Skills */}
        <GlassCard
          hoverEffect
          className="p-6 flex flex-col justify-between"
          onClick={() => navigate('/admin/skills')}
        >
          <div className="flex items-center justify-between text-tertiary mb-3">
            <Sparkles className="w-6 h-6" />
            <span className="font-mono text-[11px] text-tertiary/80">Tracked</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-on-surface">
              {stats?.total_skills || 0}
            </span>
            <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
              Skills Tracked
            </p>
          </div>
        </GlassCard>

        {/* Experience Records */}
        <GlassCard
          hoverEffect
          className="p-6 flex flex-col justify-between"
          onClick={() => navigate('/admin/experience')}
        >
          <div className="flex items-center justify-between text-primary mb-3">
            <Briefcase className="w-6 h-6" />
            <span className="font-mono text-[11px] text-primary/80">Timeline</span>
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-on-surface">
              {stats?.total_experience || 0}
            </span>
            <p className="font-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
              Experience Nodes
            </p>
          </div>
        </GlassCard>

        {/* Unread Inquiries (Pulsing Card) */}
        <GlassCard
          hoverEffect
          variant="heavy"
          className="col-span-2 sm:col-span-1 p-6 flex flex-col justify-between border-error/30 bg-error/5"
          onClick={() => navigate('/admin/inquiries')}
        >
          <div className="flex items-center justify-between text-error mb-3">
            <Mail className="w-6 h-6" />
            {stats && stats.unread_inquiries > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping" />
            )}
          </div>
          <div>
            <span className="font-display text-3xl font-extrabold text-error">
              {stats?.unread_inquiries || 0}
            </span>
            <p className="font-mono text-xs text-error font-bold mt-1 uppercase tracking-wider">
              Unread Inquiries
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid: Activity & Inquiry Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity Log (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Recent Activity Feed</span>
            </h3>
            <span className="font-mono text-xs text-on-surface-variant">Live audit log</span>
          </div>

          <GlassCard className="divide-y divide-white/5">
            {stats?.recent_activities && stats.recent_activities.length > 0 ? (
              stats.recent_activities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 hover:bg-white/5 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      {act.type === 'project' && <FolderGit2 className="w-5 h-5" />}
                      {act.type === 'research' && <BookOpen className="w-5 h-5" />}
                      {act.type === 'inquiry' && <Mail className="w-5 h-5 text-secondary" />}
                      {act.type !== 'project' && act.type !== 'research' && act.type !== 'inquiry' && (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-sm font-semibold text-on-surface">{act.title}</p>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-1">{act.description}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant/70 shrink-0">{act.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center font-mono text-xs text-on-surface-variant">
                No recent activity recorded.
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Inquiry Breakdown (Span 1) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-on-surface">Inquiry Overview</h3>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-mono text-on-surface">
              Total: {stats?.total_inquiries || 0}
            </span>
          </div>

          <GlassCard variant="heavy" className="p-6 space-y-6">
            {/* Research Collaboration */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                  Research Collaboration
                </span>
                <span className="text-primary font-bold">{researchPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-primary shadow-sm" style={{ width: `${researchPct}%` }} />
              </div>
              <p className="text-[11px] font-mono text-on-surface-variant text-right">
                {stats?.inquiry_categories?.research || 0} submissions
              </p>
            </div>

            {/* Web Platform */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                  Web Platform
                </span>
                <span className="text-secondary font-bold">{webPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-secondary shadow-sm" style={{ width: `${webPct}%` }} />
              </div>
              <p className="text-[11px] font-mono text-on-surface-variant text-right">
                {stats?.inquiry_categories?.web || 0} submissions
              </p>
            </div>

            {/* Mobile App */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-on-surface flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary inline-block" />
                  Mobile App
                </span>
                <span className="text-tertiary font-bold">{mobilePct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-tertiary shadow-sm" style={{ width: `${mobilePct}%` }} />
              </div>
              <p className="text-[11px] font-mono text-on-surface-variant text-right">
                {stats?.inquiry_categories?.mobile || 0} submissions
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <Link to="/admin/inquiries">
                <GlassButton variant="secondary" size="sm" className="w-full justify-center">
                  Open Inquiries Inbox
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
