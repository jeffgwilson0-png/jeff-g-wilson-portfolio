import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Trash2, BookOpen, FileText } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassSelect } from '../components/common/GlassSelect';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Research } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminResearchEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const [research, setResearch] = useState<Partial<Research>>({
    title: '',
    slug: '',
    authors: 'Jeff G. Wilson',
    abstract: '',
    research_area: 'Artificial Intelligence / Multimodal AI / RAG',
    methodology: '',
    technologies: '',
    conference_journal: 'IEEE Gujarat Section',
    publication_status: 'Submitted / Under Review',
    year: '2024 - 2026',
    doi: '',
    external_url: '',
    pdf_url: '',
    featured: true,
    published: true,
    order_index: 0,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew && id) {
      api.getResearchItem(id)
        .then(setResearch)
        .catch((err) => {
          console.error(err);
          error('Failed to load research paper');
          navigate('/admin/research');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, navigate, error]);

  const handleChange = (field: keyof Research, value: any) => {
    setResearch((prev) => ({ ...prev, [field]: value }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const media = await api.uploadMedia(file, 'research');
      setResearch((prev) => ({ ...prev, pdf_url: media.file_url }));
      success('Research PDF uploaded successfully!');
    } catch (err: any) {
      error(err.message || 'PDF upload failed');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!research.title || !research.abstract) {
      error('Please enter title and abstract.');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await api.createResearch(research);
        success('Research paper created successfully!');
      } else {
        await api.updateResearch(Number(id), research);
        success('Research paper updated successfully!');
      }
      navigate('/admin/research');
    } catch (err: any) {
      error(err.message || 'Failed to save research paper');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading research editor..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          to="/admin/research"
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Research List</span>
        </Link>
        <h1 className="font-display text-xl font-bold text-on-surface">
          {isNew ? 'New Research Paper' : `Edit: ${research.title?.slice(0, 35)}...`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <GlassCard variant="heavy" className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
            Paper Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <GlassInput
                label="Paper Title *"
                value={research.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="TrustRAG: A Trustworthy Retrieval-Augmented Multimodal Framework..."
                required
              />
            </div>

            <GlassInput
              label="Authors (Comma-separated) *"
              value={research.authors || ''}
              onChange={(e) => handleChange('authors', e.target.value)}
              placeholder="Jeff G. Wilson, Co-Authors"
              required
            />

            <GlassSelect
              label="Publication Status *"
              value={research.publication_status || 'Submitted / Under Review'}
              onChange={(e) => handleChange('publication_status', e.target.value)}
            >
              <option value="Submitted / Under Review">Submitted / Under Review</option>
              <option value="Published">Published</option>
              <option value="Preprint / ArXiv">Preprint / ArXiv</option>
              <option value="In Preparation">In Preparation</option>
            </GlassSelect>

            <GlassInput
              label="Conference / Target Journal / Venue"
              value={research.conference_journal || ''}
              onChange={(e) => handleChange('conference_journal', e.target.value)}
              placeholder="IEEE Gujarat Section / NeurIPS Workshop"
            />

            <GlassInput
              label="Year / Timeline"
              value={research.year || ''}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder="2024 - 2026"
            />

            <GlassInput
              label="Research Area / Discipline"
              value={research.research_area || ''}
              onChange={(e) => handleChange('research_area', e.target.value)}
              placeholder="Multimodal AI / RAG / Factuality"
            />

            <GlassInput
              label="DOI / Paper Identifier"
              value={research.doi || ''}
              onChange={(e) => handleChange('doi', e.target.value)}
              placeholder="10.1109/..."
            />
          </div>

          <GlassTextarea
            label="Abstract *"
            value={research.abstract || ''}
            onChange={(e) => handleChange('abstract', e.target.value)}
            rows={5}
            placeholder="Comprehensive abstract summary of scientific inquiry, findings, and contributions..."
            required
          />

          <GlassTextarea
            label="Methodology & Technical Approach"
            value={research.methodology || ''}
            onChange={(e) => handleChange('methodology', e.target.value)}
            rows={4}
            placeholder="Methodology breakdown, vector retrieval, cross-modal attention mechanisms..."
          />
        </GlassCard>

        {/* PDF & External Links */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>PDF Upload & Links</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <input
                type="file"
                ref={pdfInputRef}
                onChange={handlePdfUpload}
                accept="application/pdf"
                className="hidden"
              />

              <label className="font-mono text-xs text-on-surface-variant block uppercase tracking-wider">
                Research PDF Document
              </label>

              <div className="flex items-center gap-3">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => pdfInputRef.current?.click()}
                  disabled={uploadingPdf}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {uploadingPdf ? 'Uploading...' : 'Upload PDF File'}
                </GlassButton>

                {research.pdf_url && (
                  <span className="text-xs font-mono text-emerald-400">PDF Attached</span>
                )}
              </div>
            </div>

            <GlassInput
              label="External Paper URL"
              value={research.external_url || ''}
              onChange={(e) => handleChange('external_url', e.target.value)}
              placeholder="https://ieeexplore.ieee.org/..."
            />
          </div>
        </GlassCard>

        {/* Publication & Order Controls */}
        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={research.featured || false}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-surface text-primary focus:ring-primary"
                />
                <span className="font-mono text-xs text-on-surface">Feature Spotlight on Home Page</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={research.published || false}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-surface text-primary focus:ring-primary"
                />
                <span className="font-mono text-xs text-on-surface">Publish (Visible to public)</span>
              </label>
            </div>

            <div className="w-24">
              <GlassInput
                label="Order"
                type="number"
                value={research.order_index ?? 0}
                onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link to="/admin/research">
            <GlassButton type="button" variant="ghost" size="lg">
              Cancel
            </GlassButton>
          </Link>

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            icon={<Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : isNew ? 'Create Research Paper' : 'Save Paper Changes'}
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
