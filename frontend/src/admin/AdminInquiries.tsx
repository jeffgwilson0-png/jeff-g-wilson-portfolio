import React, { useEffect, useState } from 'react';
import { Mail, Search, Trash2, CheckCircle2, Clock, Filter, Eye, MessageSquare, Building, Calendar, DollarSign } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassSelect } from '../components/common/GlassSelect';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Inquiry } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { clsx } from 'clsx';

export const AdminInquiries: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);
  const [statusDraft, setStatusDraft] = useState<string>('');
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const { success, error, info } = useToast();

  const loadInquiries = async () => {
    try {
      const data = await api.getInquiries({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        search: searchQuery || undefined,
      });
      setInquiries(data);
    } catch (err: any) {
      error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [selectedCategory, selectedStatus, searchQuery]);

  const handleOpenView = (inq: Inquiry) => {
    setViewingInquiry(inq);
    setStatusDraft(inq.status);
    setNotesDraft(inq.notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!viewingInquiry) return;
    setSavingStatus(true);
    try {
      const updated = await api.updateInquiryStatus(viewingInquiry.id, statusDraft, notesDraft);
      setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setViewingInquiry(updated);
      success(`Inquiry status updated to "${statusDraft}".`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteInquiry(deleteTarget.id);
      setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      if (viewingInquiry?.id === deleteTarget.id) setViewingInquiry(null);
      success('Inquiry removed');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete inquiry');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <GlassBadge variant="error" size="sm">New</GlassBadge>;
      case 'reviewing':
        return <GlassBadge variant="warning" size="sm">Reviewing</GlassBadge>;
      case 'contacted':
        return <GlassBadge variant="primary" size="sm">Contacted</GlassBadge>;
      case 'in_discussion':
        return <GlassBadge variant="secondary" size="sm">In Discussion</GlassBadge>;
      case 'completed':
        return <GlassBadge variant="success" size="sm">Completed</GlassBadge>;
      default:
        return <GlassBadge variant="outline" size="sm">{status}</GlassBadge>;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading client inquiries inbox..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Client & Research Inquiries</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Incoming proposals submitted via the "Work With Me" and Contact portals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ghost-input rounded-xl px-3 py-2 text-xs font-mono"
          >
            <option value="all">All Categories</option>
            <option value="research">Research Collaboration</option>
            <option value="web">Web Platform</option>
            <option value="mobile">Mobile App</option>
            <option value="general">General Inquiry</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="ghost-input rounded-xl px-3 py-2 text-xs font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries..."
            className="ghost-input rounded-xl pl-9 pr-3 py-2 text-xs font-mono w-full"
          />
        </div>
      </div>

      {/* Inquiries Table */}
      {inquiries.length === 0 ? (
        <EmptyState title="No inquiries found" description="No proposals match the current filter criteria." />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Sender & Institution</GlassTableHeadCell>
              <GlassTableHeadCell>Category</GlassTableHeadCell>
              <GlassTableHeadCell>Date Received</GlassTableHeadCell>
              <GlassTableHeadCell>Status</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {inquiries.map((inq) => (
              <GlassTableRow key={inq.id} className={inq.status === 'new' ? 'bg-primary/5' : ''}>
                <GlassTableCell>
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-sm text-on-surface block flex items-center gap-2">
                      {inq.status === 'new' && <span className="w-2 h-2 rounded-full bg-error animate-pulse" />}
                      {inq.full_name}
                    </span>
                    <span className="font-mono text-xs text-primary">{inq.email}</span>
                    {inq.company_or_institution && (
                      <span className="font-mono text-[11px] text-on-surface-variant block">
                        {inq.company_or_institution}
                      </span>
                    )}
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant="outline" size="sm">
                    {inq.category.toUpperCase()}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </GlassTableCell>

                <GlassTableCell>{getStatusBadge(inq.status)}</GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <GlassButton variant="secondary" size="sm" onClick={() => handleOpenView(inq)} icon={<Eye className="w-3.5 h-3.5" />}>
                      View
                    </GlassButton>

                    <button
                      onClick={() => setDeleteTarget(inq)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-error transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassTableCell>
              </GlassTableRow>
            ))}
          </tbody>
        </GlassTable>
      )}

      {/* Inquiry Detail Modal */}
      <GlassModal
        isOpen={!!viewingInquiry}
        onClose={() => setViewingInquiry(null)}
        title={viewingInquiry ? `Inquiry from ${viewingInquiry.full_name}` : ''}
        maxWidth="2xl"
      >
        {viewingInquiry && (
          <div className="space-y-6">
            {/* Sender Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl glass-panel text-xs font-mono">
              <div>
                <span className="text-on-surface-variant block">Email:</span>
                <a href={`mailto:${viewingInquiry.email}`} className="text-primary font-bold hover:underline">
                  {viewingInquiry.email}
                </a>
              </div>

              <div>
                <span className="text-on-surface-variant block">Category:</span>
                <span className="text-on-surface font-bold uppercase">{viewingInquiry.category}</span>
              </div>

              {viewingInquiry.company_or_institution && (
                <div>
                  <span className="text-on-surface-variant block">Institution / Company:</span>
                  <span className="text-on-surface">{viewingInquiry.company_or_institution}</span>
                </div>
              )}

              {viewingInquiry.project_title_or_name && (
                <div>
                  <span className="text-on-surface-variant block">Project / Topic:</span>
                  <span className="text-on-surface">{viewingInquiry.project_title_or_name}</span>
                </div>
              )}

              {viewingInquiry.budget && (
                <div>
                  <span className="text-on-surface-variant block">Budget:</span>
                  <span className="text-secondary font-bold">{viewingInquiry.budget}</span>
                </div>
              )}

              {viewingInquiry.timeline && (
                <div>
                  <span className="text-on-surface-variant block">Timeline:</span>
                  <span className="text-on-surface">{viewingInquiry.timeline}</span>
                </div>
              )}
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                Message / Scope Description
              </label>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-body text-on-surface whitespace-pre-wrap leading-relaxed">
                {viewingInquiry.description_or_message}
              </div>
            </div>

            {/* Status & Internal Notes */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <GlassSelect
                  label="Update Pipeline Status"
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                >
                  <option value="new">New (Unread)</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </GlassSelect>

                <div className="pt-6">
                  <a
                    href={`mailto:${viewingInquiry.email}?subject=Re: Inquiry on Jeff G. Wilson Portfolio`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-mono text-xs font-bold hover:bg-secondary/90 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email Client</span>
                  </a>
                </div>
              </div>

              <GlassTextarea
                label="Internal Admin Notes (Only visible to you)"
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={2}
                placeholder="Add meeting notes, next steps, or project status comments..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <GlassButton variant="ghost" size="sm" onClick={() => setViewingInquiry(null)}>
                Close
              </GlassButton>
              <GlassButton variant="primary" size="sm" disabled={savingStatus} onClick={handleUpdateStatus}>
                {savingStatus ? 'Saving...' : 'Update Status & Notes'}
              </GlassButton>
            </div>
          </div>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Permanently delete inquiry from <strong className="text-on-surface">{deleteTarget?.full_name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <GlassButton variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</GlassButton>
            <GlassButton variant="danger" size="sm" onClick={handleDelete}>Delete</GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
