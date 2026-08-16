import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, FileText, ExternalLink, Filter } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassBadge } from '../components/common/GlassBadge';
import { GlassSelect } from '../components/common/GlassSelect';
import { GlassModal } from '../components/common/GlassModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { MediaItem } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminMedia: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error, info } = useToast();

  const loadMedia = async () => {
    try {
      const data = await api.getMedia(selectedCategory !== 'all' ? { category: selectedCategory } : undefined);
      setMediaItems(data);
    } catch (err: any) {
      error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedCategory]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const item = await api.uploadMedia(file, selectedCategory !== 'all' ? selectedCategory : 'general');
      setMediaItems((prev) => [item, ...prev]);
      success('File uploaded to Media Library!');
    } catch (err: any) {
      error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    const fullUrl = window.location.origin + item.file_url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    info('Media URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteMedia(deleteTarget.id);
      setMediaItems((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      success('Media file deleted');
      setDeleteTarget(null);
    } catch (err: any) {
      error(err.message || 'Failed to delete media');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading media assets..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Media Library</h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1">
            Centralized file and image storage for projects, papers, and assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <GlassButton
            variant="primary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            icon={<Upload className="w-4 h-4" />}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </GlassButton>
        </div>
      </div>

      {/* Filter Category */}
      <div className="flex items-center gap-4 glass-panel p-3 rounded-xl max-w-sm">
        <Filter className="w-4 h-4 text-on-surface-variant" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-transparent font-mono text-xs text-on-surface focus:outline-none w-full cursor-pointer"
        >
          <option value="all" className="bg-surface">All Categories</option>
          <option value="profile" className="bg-surface">Profile Photos</option>
          <option value="projects" className="bg-surface">Project Assets</option>
          <option value="research" className="bg-surface">Research PDFs</option>
          <option value="cv" className="bg-surface">Curriculum Vitae</option>
          <option value="general" className="bg-surface">General Media</option>
        </select>
      </div>

      {/* Media Grid */}
      {mediaItems.length === 0 ? (
        <EmptyState
          title="No media files found"
          description="Upload your first asset to use across the portfolio."
          actionText="Upload File"
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaItems.map((item) => {
            const isImage = item.file_type.toLowerCase() === 'image';

            return (
              <GlassCard key={item.id} className="p-3 flex flex-col justify-between group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20 mb-2 flex items-center justify-center border border-white/5">
                  {isImage ? (
                    <img
                      src={item.file_url}
                      alt={item.original_filename}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-10 h-10 text-primary/70" />
                  )}

                  <div className="absolute top-1.5 right-1.5">
                    <GlassBadge variant="outline" size="sm">
                      {item.category}
                    </GlassBadge>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-mono text-xs font-medium text-on-surface truncate" title={item.original_filename}>
                    {item.original_filename}
                  </p>
                  <p className="font-mono text-[10px] text-on-surface-variant">
                    {Math.round(item.file_size / 1024)} KB
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-error transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <GlassModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirm Delete" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm font-body text-on-surface-variant">
            Delete file <strong className="text-on-surface">{deleteTarget?.original_filename}</strong>?
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
