import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Save } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Conference } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminConferences: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Conference> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Conference | null>(null);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const data = await api.getAdminConferences();
      setConferences(data);
    } catch (err: any) {
      error('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      event_name: '',
      location: '',
      date_string: '',
      role: '',
      description: '',
      external_url: '',
      featured: false,
      published: true,
      order_index: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Conference) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.event_name) {
      error('Please enter the event name.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem.id) {
        const updated = await api.updateConference(editingItem.id, editingItem);
        setConferences((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        success('Conference updated!');
      } else {
        const created = await api.createConference(editingItem);
        setConferences((prev) => [created, ...prev]);
        success('Conference added!');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save conference');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteConference(deleteTarget.id);
      setConferences((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      success('Conference deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading conference records..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Conferences & Summits</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage academic events, committees, and conference presentations.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Add Conference
        </GlassButton>
      </div>

      {conferences.length === 0 ? (
        <EmptyState title="No conference records found" onAction={handleOpenAdd} actionText="Add Conference" />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>Event Name</GlassTableHeadCell>
              <GlassTableHeadCell>Role</GlassTableHeadCell>
              <GlassTableHeadCell>Date & Location</GlassTableHeadCell>
              <GlassTableHeadCell>Status</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {conferences.map((conf) => (
              <GlassTableRow key={conf.id}>
                <GlassTableCell>
                  <span className="font-display font-bold text-sm text-on-surface block">{conf.event_name}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-primary">{conf.role || 'Attendee'}</span>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {conf.date_string} {conf.location ? `• ${conf.location}` : ''}
                  </span>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant={conf.published ? 'success' : 'outline'} size="sm">
                    {conf.published ? 'Live' : 'Draft'}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(conf)}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(conf)}
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
        title={editingItem?.id ? 'Edit Conference' : 'Add Conference'}
        maxWidth="lg"
      >
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <GlassInput
                  label="Conference / Event Name *"
                  value={editingItem.event_name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, event_name: e.target.value })}
                  placeholder="Vibrant Gujarat Regional Conference 2026"
                  required
                />
              </div>
              <GlassInput
                label="Role / Contribution"
                value={editingItem.role || ''}
                onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                placeholder="Volunteer — Documentation Committee"
              />
              <GlassInput
                label="Date String"
                value={editingItem.date_string || ''}
                onChange={(e) => setEditingItem({ ...editingItem, date_string: e.target.value })}
                placeholder="January 2026"
              />
              <GlassInput
                label="Location"
                value={editingItem.location || ''}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                placeholder="Saurashtra & Kutch, India"
              />
              <GlassInput
                label="External Event Link"
                value={editingItem.external_url || ''}
                onChange={(e) => setEditingItem({ ...editingItem, external_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-primary"
                />
                <span className="font-mono text-xs">Featured Event</span>
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
              label="Description & Highlights"
              value={editingItem.description || ''}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>
                {saving ? 'Saving...' : 'Save Conference'}
              </GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete conference <strong className="text-on-surface">{deleteTarget?.event_name}</strong>?
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
