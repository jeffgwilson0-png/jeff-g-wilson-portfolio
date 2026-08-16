import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Star, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Research } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminResearch: React.FC = () => {
  const [researchList, setResearchList] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Research | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const loadResearch = async () => {
    try {
      const data = await api.getAdminResearch();
      setResearchList(data);
    } catch (err: any) {
      error('Failed to load research papers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResearch();
  }, []);

  const handleToggleFeatured = async (item: Research) => {
    try {
      const updated = await api.updateResearch(item.id, { featured: !item.featured });
      setResearchList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      success(`Research "${item.title.slice(0, 30)}..." featured status updated.`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleTogglePublished = async (item: Research) => {
    try {
      const updated = await api.updateResearch(item.id, { published: !item.published });
      setResearchList((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      success(`Research "${item.title.slice(0, 30)}..." published status updated.`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteResearch(deleteTarget.id);
      success(`Research paper deleted.`);
      setResearchList((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete research paper.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading research table..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Research & Publications</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage your academic papers, status (Submitted / Published), DOI, and PDF documents.
          </p>
        </div>

        <Link to="/admin/research/new">
          <GlassButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Add Research Paper
          </GlassButton>
        </Link>
      </div>

      {researchList.length === 0 ? (
        <EmptyState
          title="No research papers found"
          description="Click above to add your first research paper."
          actionText="Add Research"
          onAction={() => navigate('/admin/research/new')}
        />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Paper Title</GlassTableHeadCell>
              <GlassTableHeadCell>Status</GlassTableHeadCell>
              <GlassTableHeadCell>Target Venue</GlassTableHeadCell>
              <GlassTableHeadCell>Featured</GlassTableHeadCell>
              <GlassTableHeadCell>Published</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {researchList.map((r) => (
              <GlassTableRow key={r.id}>
                <GlassTableCell>
                  <div className="space-y-0.5 max-w-md">
                    <span className="font-display font-bold text-sm text-on-surface block line-clamp-1">{r.title}</span>
                    <span className="font-mono text-[11px] text-on-surface-variant line-clamp-1">Authors: {r.authors}</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant="primary" size="sm">
                    {r.publication_status || 'Under Review'}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">{r.conference_journal || 'IEEE'}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <button
                    onClick={() => handleToggleFeatured(r)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      r.featured
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-white/5 border-white/10 text-on-surface-variant hover:text-amber-400'
                    }`}
                  >
                    <Star className="w-4 h-4" fill={r.featured ? 'currentColor' : 'none'} />
                  </button>
                </GlassTableCell>

                <GlassTableCell>
                  <button
                    onClick={() => handleTogglePublished(r)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${
                      r.published
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-on-surface-variant'
                    }`}
                  >
                    {r.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{r.published ? 'Live' : 'Draft'}</span>
                  </button>
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/research/${r.id}/edit`}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-error hover:border-error/40 transition-colors"
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

      {/* Delete Confirmation Modal */}
      <GlassModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Research Confirmation"
        maxWidth="md"
      >
        <div className="space-y-6">
          <p className="font-body text-sm text-on-surface-variant">
            Are you sure you want to delete <strong className="text-on-surface">"{deleteTarget?.title}"</strong>?
          </p>

          <div className="flex justify-end gap-3">
            <GlassButton variant="secondary" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </GlassButton>

            <GlassButton
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              icon={<Trash2 className="w-4 h-4" />}
            >
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
