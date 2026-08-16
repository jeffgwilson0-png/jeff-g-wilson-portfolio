import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, FileText, CheckCircle2, Download, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTable, GlassTableHeader, GlassTableRow, GlassTableHeadCell, GlassTableCell } from '../components/common/GlassTable';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { CVItem } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { downloadFile, resolveFileUrl } from '../utils/download';

export const AdminCV: React.FC = () => {
  const [cvList, setCvList] = useState<CVItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('Jeff_G_Wilson_CV.pdf');
  const [version, setVersion] = useState('2026.1');
  const [setActive, setSetActive] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CVItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { success, error, info } = useToast();

  const loadCVs = async () => {
    try {
      const data = await api.getAllCVs();
      setCvList(data);
    } catch (err: any) {
      error('Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTitle(file.name);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      error('Please choose a PDF file.');
      return;
    }

    setUploading(true);
    try {
      const newCv = await api.uploadCV(selectedFile, title, version, setActive);
      success('CV uploaded successfully!');
      setIsModalOpen(false);
      setSelectedFile(null);
      loadCVs();
    } catch (err: any) {
      error(err.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (cv: CVItem) => {
    try {
      await api.activateCV(cv.id);
      success(`CV version ${cv.version} activated for public download!`);
      loadCVs();
    } catch (err: any) {
      error(err.message || 'Failed to activate CV');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteCV(deleteTarget.id);
      setCvList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      success('CV record deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading CV manager..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Curriculum Vitae Manager</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Manage and version control official CV documents linked to public download buttons.
          </p>
        </div>

        <GlassButton variant="primary" size="md" onClick={() => setIsModalOpen(true)} icon={<Upload className="w-4 h-4" />}>
          Upload New CV Version
        </GlassButton>
      </div>

      {cvList.length === 0 ? (
        <EmptyState
          title="No CV uploaded yet"
          description="Upload an official CV PDF to enable public downloads."
          actionText="Upload CV"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <GlassTable>
          <GlassTableHeader>
            <tr>
              <GlassTableHeadCell>File Title</GlassTableHeadCell>
              <GlassTableHeadCell>Version</GlassTableHeadCell>
              <GlassTableHeadCell>File Size</GlassTableHeadCell>
              <GlassTableHeadCell>Active Download</GlassTableHeadCell>
              <GlassTableHeadCell className="text-right">Actions</GlassTableHeadCell>
            </tr>
          </GlassTableHeader>
          <tbody>
            {cvList.map((cv) => (
              <GlassTableRow key={cv.id}>
                <GlassTableCell>
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-mono text-xs font-semibold text-on-surface">{cv.title}</span>
                  </div>
                </GlassTableCell>

                <GlassTableCell>
                  <GlassBadge variant="outline" size="sm">
                    v{cv.version}
                  </GlassBadge>
                </GlassTableCell>

                <GlassTableCell>
                  <span className="font-mono text-xs text-on-surface-variant">
                    {Math.round(cv.file_size / 1024)} KB
                  </span>
                </GlassTableCell>

                <GlassTableCell>
                  {cv.is_active ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivate(cv)}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      Set as Active
                    </button>
                  )}
                </GlassTableCell>

                <GlassTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => downloadFile(cv.file_url, cv.title || 'Jeff_G_Wilson_CV.pdf')}
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <a
                      href={resolveFileUrl(cv.file_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg glass-panel text-on-surface-variant hover:text-primary transition-colors"
                      title="Open in New Tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => setDeleteTarget(cv)}
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

      {/* Upload Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Curriculum Vitae"
        maxWidth="md"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-wider">
              Select PDF File *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf"
              className="block w-full text-xs font-mono text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
              required
            />
          </div>

          <GlassInput
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <GlassInput
            label="Version Tag"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 2026.1"
            required
          />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={setActive}
              onChange={(e) => setSetActive(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <span className="font-mono text-xs">Set as current active CV for public download</span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
            <GlassButton type="button" variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" size="sm" disabled={uploading} icon={<Upload className="w-4 h-4" />}>
              {uploading ? 'Uploading...' : 'Upload & Save'}
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete CV version <strong className="text-on-surface">{deleteTarget?.version}</strong>?
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
