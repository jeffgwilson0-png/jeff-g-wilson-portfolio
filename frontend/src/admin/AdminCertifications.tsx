import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ShieldCheck, Award as AwardIcon, Save } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Certification, Award } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { clsx } from 'clsx';

export const AdminCertifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'certifications' | 'awards'>('certifications');
  const [certs, setCerts] = useState<Certification[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  // Cert Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  // Award Modal State
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Partial<Award> | null>(null);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'cert' | 'award'; id: number; title: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const loadData = async () => {
    try {
      const [cData, aData] = await Promise.all([
        api.getAdminCertifications(),
        api.getAdminAwards(),
      ]);
      setCerts(cData);
      setAwards(aData);
    } catch (err: any) {
      error('Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.name || !editingCert.issuing_organization) {
      error('Please complete name and issuing organization.');
      return;
    }
    setSaving(true);
    try {
      if (editingCert.id) {
        const updated = await api.updateCertification(editingCert.id, editingCert);
        setCerts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        success('Certification updated!');
      } else {
        const created = await api.createCertification(editingCert);
        setCerts((prev) => [created, ...prev]);
        success('Certification added!');
      }
      setCertModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save certification');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAward || !editingAward.title || !editingAward.organization) {
      error('Please complete title and organization.');
      return;
    }
    setSaving(true);
    try {
      if (editingAward.id) {
        const updated = await api.updateAward(editingAward.id, editingAward);
        setAwards((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        success('Award updated!');
      } else {
        const created = await api.createAward(editingAward);
        setAwards((prev) => [created, ...prev]);
        success('Award added!');
      }
      setAwardModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save award');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'cert') {
        await api.deleteCertification(deleteTarget.id);
        setCerts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      } else {
        await api.deleteAward(deleteTarget.id);
        setAwards((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      }
      success('Item deleted successfully');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading credentials..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Certifications & Honors</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage professional credentials, badges, and honor awards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => {
              if (activeTab === 'certifications') {
                setEditingCert({ name: '', issuing_organization: '', issue_date: '', credential_id: '', verification_url: '', published: true, order_index: 0 });
                setCertModalOpen(true);
              } else {
                setEditingAward({ title: '', organization: '', award_date: '', description: '', published: true, order_index: 0 });
                setAwardModalOpen(true);
              }
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            {activeTab === 'certifications' ? 'Add Certification' : 'Add Award'}
          </GlassButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('certifications')}
          className={clsx(
            'px-5 py-2.5 rounded-xl font-mono text-xs font-medium flex items-center gap-2 transition-all',
            activeTab === 'certifications'
              ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20'
              : 'glass-panel text-on-surface-variant hover:text-on-surface'
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Certifications ({certs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('awards')}
          className={clsx(
            'px-5 py-2.5 rounded-xl font-mono text-xs font-medium flex items-center gap-2 transition-all',
            activeTab === 'awards'
              ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20'
              : 'glass-panel text-on-surface-variant hover:text-on-surface'
          )}
        >
          <AwardIcon className="w-4 h-4" />
          <span>Honors & Awards ({awards.length})</span>
        </button>
      </div>

      {/* Certifications View */}
      {activeTab === 'certifications' && (
        certs.length === 0 ? (
          <EmptyState title="No certifications added yet" />
        ) : (
          <GlassTable>
            <GlassTableHeader>
              <tr>
                <GlassTableHeadCell>Name & Issuer</GlassTableHeadCell>
                <GlassTableHeadCell>Date</GlassTableHeadCell>
                <GlassTableHeadCell>Credential ID</GlassTableHeadCell>
                <GlassTableHeadCell>Status</GlassTableHeadCell>
                <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
              </tr>
            </GlassTableHeader>
            <tbody>
              {certs.map((c) => (
                <GlassTableRow key={c.id}>
                  <GlassTableCell>
                    <span className="font-display font-bold text-sm text-on-surface block">{c.name}</span>
                    <span className="font-mono text-xs text-secondary">{c.issuing_organization}</span>
                  </GlassTableCell>
                  <GlassTableCell><span className="font-mono text-xs text-on-surface-variant">{c.issue_date || '—'}</span></GlassTableCell>
                  <GlassTableCell><span className="font-mono text-xs text-on-surface-variant">{c.credential_id || '—'}</span></GlassTableCell>
                  <GlassTableCell><GlassBadge variant={c.published ? 'success' : 'outline'} size="sm">{c.published ? 'Live' : 'Draft'}</GlassBadge></GlassTableCell>
                  <GlassTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingCert(c); setCertModalOpen(true); }} className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget({ type: 'cert', id: c.id, title: c.name })} className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-error"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </GlassTableCell>
                </GlassTableRow>
              ))}
            </tbody>
          </GlassTable>
        )
      )}

      {/* Awards View */}
      {activeTab === 'awards' && (
        awards.length === 0 ? (
          <EmptyState title="No awards added yet" />
        ) : (
          <GlassTable>
            <GlassTableHeader>
              <tr>
                <GlassTableHeadCell>Award Title & Organization</GlassTableHeadCell>
                <GlassTableHeadCell>Date</GlassTableHeadCell>
                <GlassTableHeadCell>Status</GlassTableHeadCell>
                <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
              </tr>
            </GlassTableHeader>
            <tbody>
              {awards.map((a) => (
                <GlassTableRow key={a.id}>
                  <GlassTableCell>
                    <span className="font-display font-bold text-sm text-on-surface block">{a.title}</span>
                    <span className="font-mono text-xs text-secondary">{a.organization}</span>
                  </GlassTableCell>
                  <GlassTableCell><span className="font-mono text-xs text-on-surface-variant">{a.award_date || '—'}</span></GlassTableCell>
                  <GlassTableCell><GlassBadge variant={a.published ? 'success' : 'outline'} size="sm">{a.published ? 'Live' : 'Draft'}</GlassBadge></GlassTableCell>
                  <GlassTableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingAward(a); setAwardModalOpen(true); }} className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget({ type: 'award', id: a.id, title: a.title })} className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-error"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </GlassTableCell>
                </GlassTableRow>
              ))}
            </tbody>
          </GlassTable>
        )
      )}

      {/* Cert Modal */}
      <GlassModal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} title={editingCert?.id ? 'Edit Certification' : 'Add Certification'} maxWidth="md">
        {editingCert && (
          <form onSubmit={handleSaveCert} className="space-y-4">
            <GlassInput label="Certification Name *" value={editingCert.name || ''} onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })} required />
            <GlassInput label="Issuing Organization *" value={editingCert.issuing_organization || ''} onChange={(e) => setEditingCert({ ...editingCert, issuing_organization: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <GlassInput label="Issue Date" value={editingCert.issue_date || ''} onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })} placeholder="2024" />
              <GlassInput label="Credential ID" value={editingCert.credential_id || ''} onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })} />
            </div>
            <GlassInput label="Verification URL" value={editingCert.verification_url || ''} onChange={(e) => setEditingCert({ ...editingCert, verification_url: e.target.value })} placeholder="https://..." />
            <GlassTextarea label="Description" value={editingCert.description || ''} onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })} rows={2} />
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setCertModalOpen(false)}>Cancel</GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>Save</GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Award Modal */}
      <GlassModal isOpen={awardModalOpen} onClose={() => setAwardModalOpen(false)} title={editingAward?.id ? 'Edit Award' : 'Add Award'} maxWidth="md">
        {editingAward && (
          <form onSubmit={handleSaveAward} className="space-y-4">
            <GlassInput label="Award Title *" value={editingAward.title || ''} onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })} required />
            <GlassInput label="Granting Organization *" value={editingAward.organization || ''} onChange={(e) => setEditingAward({ ...editingAward, organization: e.target.value })} required />
            <GlassInput label="Award Date" value={editingAward.award_date || ''} onChange={(e) => setEditingAward({ ...editingAward, award_date: e.target.value })} placeholder="2024" />
            <GlassTextarea label="Description" value={editingAward.description || ''} onChange={(e) => setEditingAward({ ...editingAward, description: e.target.value })} rows={3} />
            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <GlassButton type="button" variant="ghost" size="sm" onClick={() => setAwardModalOpen(false)}>Cancel</GlassButton>
              <GlassButton type="submit" variant="primary" size="sm" disabled={saving} icon={<Save className="w-4 h-4" />}>Save</GlassButton>
            </div>
          </form>
        )}
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete <strong className="text-on-surface">{deleteTarget?.title}</strong>?
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
