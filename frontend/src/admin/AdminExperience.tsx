import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Eye, EyeOff, Save } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Experience } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const data = await api.getAdminExperience();
      setExperiences(data);
    } catch (err: any) {
      error('Failed to load experience records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      role: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      technologies: '',
      published: true,
      order_index: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Experience) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.role || !editingItem.company || !editingItem.start_date) {
      error('Please complete role, company, and start date.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        const updated = await api.updateExperience(editingItem.id, editingItem);
        setExperiences((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
        success('Experience updated successfully!');
      } else {
        const created = await api.createExperience(editingItem);
        setExperiences((prev) => [created, ...prev]);
        success('Experience created successfully!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteExperience(deleteTarget.id);
      setExperiences((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
      success('Experience deleted successfully');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading experience data..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Experience Management</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage your employment history, research appointments, and roles.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Add Experience
        </GlassButton>
      </div>

      {experiences.length === 0 ? (
        <EmptyState
          title="No experience records"
          description="Click above to add your first work or research role."
          actionText="Add Experience"
          onAction={handleOpenAdd}
        />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Role & Company</GlassTableHeadCell>
              <GlassTableHeadCell>Duration</GlassTableHeadCell>
              <GlassTableHeadCell>Location</GlassTableHeadCell>
              <GlassTableHeadCell>Status</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {experiences.map((exp) => (
              <GlassTableRow key={exp.id}>
                <GlassTableCell>
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-sm text-on-surface block">{exp.role}</span>
                    <span className="font-mono text-xs text-primary">{exp.company}</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {exp.start_date} – {exp.end_date || (exp.is_current ? 'Present' : '')}
                  </span>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">{exp.location || '—'}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant={exp.published ? 'success' : 'outline'} size="sm">
                    {exp.published ? 'Live' : 'Draft'}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(exp)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(exp)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-error transition-colors"
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

      {/* Edit / Add Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Experience' : 'Add Experience'}
        maxWidth="lg"
      >
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Role Title *"
                value={editingItem.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                placeholder="AI / ML Engineer"
                required
              />
              <GlassInput
                label="Company / Organization *"
                value={editingItem.company || ''}
                onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                placeholder="Organization Name"
                required
              />
              <GlassInput
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                placeholder="City, Country"
              />
              <div className="flex gap-2">
                <GlassInput
                  label="Start Date *"
                  value={editingItem.start_date || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, start_date: e.target.value })}
                  placeholder="e.g. 2023"
                  required
                />
                <GlassInput
                  label="End Date"
                  value={editingItem.end_date || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, end_date: e.target.value })}
                  placeholder="e.g. 2024"
                  disabled={editingItem.is_current}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.is_current || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_current: e.target.checked })}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="font-mono text-xs">Currently working here</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.published ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="font-mono text-xs">Published</span>
              </label>
            </div>

            <GlassInput
              label="Technologies (Comma-separated)"
              value={editingItem.technologies || ''}
              onChange={(e) => setEditingItem({ ...editingItem, technologies: e.target.value })}
              placeholder="Python, FastAPI, PyTorch"
            />

            <GlassTextarea
              label="Role Description"
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              rows={4}
              placeholder="Key responsibilities, architectural accomplishments..."
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>
                {saving ? 'Saving...' : 'Save Experience'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete experience at <strong className="text-on-surface">{deleteTarget?.company}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <GlassButton variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </GlassButton>
            <GlassButton variant="danger" size="sm" onClick={handleDelete}>
              Delete
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};
