import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Project } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { success, error } = useToast();
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const data = await api.getAdminProjects();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleToggleFeatured = async (project: Project) => {
    try {
      const updated = await api.updateProject(project.id, { featured: !project.featured });
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      success(`Project "${project.title}" ${updated.featured ? 'marked as featured' : 'unfeatured'}`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleTogglePublished = async (project: Project) => {
    try {
      const updated = await api.updateProject(project.id, { published: !project.published });
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      success(`Project "${project.title}" ${updated.published ? 'published' : 'hidden from public'}`);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteProject(deleteTarget.id);
      success(`Project "${deleteTarget.title}" deleted.`);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete project.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading projects management table..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Projects Management</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Create, edit, reorder, and publish portfolio projects.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <GlassButton variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
            Add Project
          </GlassButton>
        </Link>
      </div>

      {/* Projects Table */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects in database"
          description="Click the button above to add your first portfolio project."
          actionText="Create Project"
          onAction={() => navigate('/admin/projects/new')}
        />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Project</GlassTableHeadCell>
              <GlassTableHeadCell>Category</GlassTableHeadCell>
              <GlassTableHeadCell>Technologies</GlassTableHeadCell>
              <GlassTableHeadCell>Featured</GlassTableHeadCell>
              <GlassTableHeadCell>Status</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {projects.map((p) => (
              <GlassTableRow key={p.id}>
                <GlassTableCell>
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-sm text-on-surface block">{p.title}</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">/projects/{p.slug}</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant="outline" size="sm">
                    {p.category}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant line-clamp-1 max-w-[200px]">
                    {p.technologies || 'None'}
                  </span>
                </GlassTableCell>

                <GlassTableCell>
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      p.featured
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-white/5 border-white/10 text-on-surface-variant hover:text-amber-400'
                    }`}
                    title={p.featured ? 'Featured on Home page' : 'Click to feature'}
                  >
                    <Star className="w-4 h-4" fill={p.featured ? 'currentColor' : 'none'} />
                  </button>
                </GlassTableCell>

                <GlassTableCell>
                  <button
                    onClick={() => handleTogglePublished(p)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs border transition-colors ${
                      p.published
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-on-surface-variant'
                    }`}
                  >
                    {p.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{p.published ? 'Live' : 'Draft'}</span>
                  </button>
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/admin/projects/${p.id}/edit`}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => setDeleteTarget(p)}
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
        title="Delete Project Confirmation"
        maxWidth="md"
      >
        <div className="space-y-6">
          <p className="font-body text-sm text-on-surface-variant">
            Are you sure you want to delete project <strong className="text-on-surface">"{deleteTarget?.title}"</strong>? This action is permanent and cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <GlassButton
              variant="secondary"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
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
