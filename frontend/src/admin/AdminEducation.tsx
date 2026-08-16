import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Save } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Education } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminEducation: React.FC = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Education> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const data = await api.getAdminEducation();
      setEducations(data);
    } catch (err: any) {
      error('Failed to load education');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      degree: '',
      field_of_study: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      grade: '',
      description: '',
      published: true,
      order_index: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Education) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.degree || !editingItem.institution || !editingItem.start_date) {
      error('Please fill required fields.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        const updated = await api.updateEducation(editingItem.id, editingItem);
        setEducations((prev) => prev.map((edu) => (edu.id === updated.id ? updated : edu)));
        success('Education updated!');
      } else {
        const created = await api.createEducation(editingItem);
        setEducations((prev) => [created, ...prev]);
        success('Education created!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteEducation(deleteTarget.id);
      setEducations((prev) => prev.filter((edu) => edu.id !== deleteTarget.id));
      success('Education record deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading education records..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Education Management</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage academic degrees, institutions, and specializations.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Add Degree
        </GlassButton>
      </div>

      {educations.length === 0 ? (
        <EmptyState title="No education records found" onAction={handleOpenAdd} actionText="Add Education" />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Degree & Institution</GlassTableHeadCell>
              <GlassTableHeadCell>Field of Study</GlassTableHeadCell>
              <GlassTableHeadCell>Duration</GlassTableHeadCell>
              <GlassTableHeadCell>Grade</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {educations.map((edu) => (
              <GlassTableRow key={edu.id}>
                <GlassTableCell>
                  <div className="space-y-0.5">
                    <span className="font-display font-bold text-sm text-on-surface block">{edu.degree}</span>
                    <span className="font-mono text-xs text-on-surface-variant">{edu.institution}</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-primary">{edu.field_of_study}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {edu.start_date} – {edu.end_date || (edu.is_current ? 'Present' : '')}
                  </span>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-secondary">{edu.grade || '—'}</span>
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(edu)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(edu)}
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

      {/* Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Education' : 'Add Degree'}
        maxWidth="lg"
      >
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Degree Title *"
                value={editingItem.degree || ''}
                onChange={(e) => setEditingItem({ ...editingItem, degree: e.target.value })}
                placeholder="M.Tech in Data Science"
                required
              />
              <GlassInput
                label="Field of Study *"
                value={editingItem.field_of_study || ''}
                onChange={(e) => setEditingItem({ ...editingItem, field_of_study: e.target.value })}
                placeholder="Data Science & Artificial Intelligence"
                required
              />
              <GlassInput
                label="Institution *"
                value={editingItem.institution || ''}
                onChange={(e) => setEditingItem({ ...editingItem, institution: e.target.value })}
                placeholder="Marwadi University"
                required
              />
              <GlassInput
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                placeholder="Rajkot, Gujarat, India"
              />
              <GlassInput
                label="Start Date *"
                value={editingItem.start_date || ''}
                onChange={(e) => setEditingItem({ ...editingItem, start_date: e.target.value })}
                placeholder="2024"
                required
              />
              <GlassInput
                label="End Date"
                value={editingItem.end_date || ''}
                onChange={(e) => setEditingItem({ ...editingItem, end_date: e.target.value })}
                placeholder="2026"
                disabled={editingItem.is_current}
              />
              <GlassInput
                label="Grade / Distinction"
                value={editingItem.grade || ''}
                onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                placeholder="First Class with Distinction"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.is_current || false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_current: e.target.checked })}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="font-mono text-xs">Currently pursuing</span>
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

            <GlassTextarea
              label="Description / Key Coursework"
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>
                {saving ? 'Saving...' : 'Save Degree'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete degree <strong className="text-on-surface">{deleteTarget?.degree}</strong>?
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
