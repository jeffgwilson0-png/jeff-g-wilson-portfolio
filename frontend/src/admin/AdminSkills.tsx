import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Star, Save } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassSelect } from '../components/common/GlassSelect';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Skill } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const { success, error } = useToast();

  const loadSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (err: any) {
      error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingSkill({
      name: '',
      category: 'Programming',
      proficiency: 85,
      featured: true,
      order_index: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name) {
      error('Please enter skill name');
      return;
    }
    setSaving(true);
    try {
      if (editingSkill.id) {
        const updated = await api.updateSkill(editingSkill.id, editingSkill);
        setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        success('Skill updated!');
      } else {
        const created = await api.createSkill(editingSkill);
        setSkills((prev) => [...prev, created]);
        success('Skill added!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteSkill(deleteTarget.id);
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      success('Skill deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading skills..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Skills & Competencies</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage your technical skills matrix, categories, and proficiency levels.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Add Skill
        </GlassButton>
      </div>

      {skills.length === 0 ? (
        <EmptyState title="No skills found" onAction={handleOpenAdd} actionText="Add Skill" />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Skill Name</GlassTableHeadCell>
              <GlassTableHeadCell>Category</GlassTableHeadCell>
              <GlassTableHeadCell>Proficiency</GlassTableHeadCell>
              <GlassTableHeadCell>Featured</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {skills.map((s) => (
              <GlassTableRow key={s.id}>
                <GlassTableCell>
                  <span className="font-display font-bold text-sm text-on-surface">{s.name}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant="outline" size="sm">
                    {s.category}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell>
                  <div className="flex items-center gap-2 max-w-xs">
                    <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${s.proficiency}%` }} />
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">{s.proficiency}%</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  {s.featured ? (
                    <span className="text-amber-400 font-mono text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" fill="currentColor" />
                      <span>Featured</span>
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/60 font-mono text-xs">Standard</span>
                  )}
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(s)}
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
        title={editingSkill?.id ? 'Edit Skill' : 'Add Skill'}
        maxWidth="md"
      >
        {editingSkill && (
          <form onSubmit={handleSave} className="space-y-4">
            <GlassInput
              label="Skill Name *"
              value={editingSkill.name || ''}
              onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              placeholder="e.g. PyTorch / Fastify / Next.js"
              required
            />

            <GlassSelect
              label="Category *"
              value={editingSkill.category || 'Programming'}
              onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
            >
              <option value="Programming">Programming</option>
              <option value="AI / Machine Learning">AI / Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud">Cloud</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Tools & DevOps">Tools & DevOps</option>
            </GlassSelect>

            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-xs">
                <label className="text-on-surface-variant uppercase tracking-wider">Proficiency</label>
                <span className="text-primary font-bold">{editingSkill.proficiency || 85}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={editingSkill.proficiency || 85}
                onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: parseInt(e.target.value) })}
                className="w-full cursor-pointer accent-primary"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={editingSkill.featured || false}
                onChange={(e) => setEditingSkill({ ...editingSkill, featured: e.target.checked })}
                className="w-4 h-4 rounded text-primary"
              />
              <span className="font-mono text-xs">Feature on Home Page</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>
                {saving ? 'Saving...' : 'Save Skill'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete skill <strong className="text-on-surface">{deleteTarget?.name}</strong>?
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
