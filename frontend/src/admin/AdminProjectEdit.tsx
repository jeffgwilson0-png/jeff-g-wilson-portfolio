import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { GlassInput } from '../components/common/GlassInput';
import { GlassTextarea } from '../components/common/GlassTextarea';
import { GlassSelect } from '../components/common/GlassSelect';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Project } from '../types';
import { api } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export const AdminProjectEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    image_url: '',
    category: 'Web Application',
    technologies: '',
    github_url: '',
    live_demo_url: '',
    research_url: '',
    featured: false,
    published: true,
    order_index: 0,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isNew && id) {
      api.getProject(id)
        .then(setProject)
        .catch((err) => {
          console.error(err);
          error('Failed to load project');
          navigate('/admin/projects');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew, navigate, error]);

  const handleChange = (field: keyof Project, value: any) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const media = await api.uploadMedia(file, 'projects');
      setProject((prev) => ({ ...prev, image_url: media.file_url }));
      success('Project image uploaded!');
    } catch (err: any) {
      error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.title || !project.short_description) {
      error('Please enter title and short description.');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await api.createProject(project);
        success('Project created successfully!');
      } else {
        await api.updateProject(Number(id), project);
        success('Project updated successfully!');
      }
      navigate('/admin/projects');
    } catch (err: any) {
      console.error(err);
      error(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading project editor..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>
        <h1 className="font-display text-xl font-bold text-on-surface">
          {isNew ? 'Create New Project' : `Edit: ${project.title}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <GlassCard variant="heavy" className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
            Core Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <GlassInput
              label="Project Title *"
              value={project.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Liberia Opportunities Hub"
              required
            />

            <GlassInput
              label="URL Slug (Optional)"
              value={project.slug || ''}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="Auto-generated from title if blank"
            />

            <GlassSelect
              label="Category"
              value={project.category || 'Web Application'}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="AI Research">AI Research</option>
              <option value="Web Application">Web Application</option>
              <option value="Data Platform">Data Platform</option>
              <option value="ML System">ML System</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Algorithms">Algorithms</option>
              <option value="Distributed System">Distributed System</option>
            </GlassSelect>

            <GlassInput
              label="Technologies (Comma-separated)"
              value={project.technologies || ''}
              onChange={(e) => handleChange('technologies', e.target.value)}
              placeholder="React, FastAPI, PostgreSQL, PyTorch"
            />
          </div>

          <GlassTextarea
            label="Short Description (Shown on cards) *"
            value={project.short_description || ''}
            onChange={(e) => handleChange('short_description', e.target.value)}
            rows={3}
            required
          />

          <GlassTextarea
            label="Full Description & Architecture Breakdown"
            value={project.full_description || ''}
            onChange={(e) => handleChange('full_description', e.target.value)}
            rows={6}
            placeholder="Detailed overview of technical architecture, features, algorithms used, and challenges solved..."
          />
        </GlassCard>

        {/* Project Links */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3">
            External Links & Research
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <GlassInput
              label="GitHub Repository URL"
              value={project.github_url || ''}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/..."
            />

            <GlassInput
              label="Live Demo URL"
              value={project.live_demo_url || ''}
              onChange={(e) => handleChange('live_demo_url', e.target.value)}
              placeholder="https://..."
            />

            <GlassInput
              label="Research Paper Route / URL"
              value={project.research_url || ''}
              onChange={(e) => handleChange('research_url', e.target.value)}
              placeholder="/research/trustrag-multimodal-framework"
            />
          </div>
        </GlassCard>

        {/* Media & Image Upload */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-on-surface border-b border-white/10 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Project Image</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {project.image_url ? (
              <div className="relative w-48 h-32 rounded-xl overflow-hidden glass-panel border border-white/20 shrink-0">
                <img src={project.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-48 h-32 rounded-xl glass-panel border border-dashed border-white/20 flex flex-col items-center justify-center text-on-surface-variant text-xs font-mono shrink-0">
                <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                <span>No Image</span>
              </div>
            )}

            <div className="space-y-3 w-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <GlassButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                </GlassButton>

                {project.image_url && (
                  <GlassButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleChange('image_url', '')}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    Clear
                  </GlassButton>
                )}
              </div>

              <GlassInput
                label="Or paste direct image URL:"
                value={project.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </GlassCard>

        {/* Publication & Order Controls */}
        <GlassCard className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={project.featured || false}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-surface text-primary focus:ring-primary"
                />
                <span className="font-mono text-xs text-on-surface">Feature on Home Page Bento Grid</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={project.published || false}
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
                value={project.order_index ?? 0}
                onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </GlassCard>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link to="/admin/projects">
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
            {saving ? 'Saving...' : isNew ? 'Create Project' : 'Save Project Changes'}
          </GlassButton>
        </div>
      </form>
    </div>
  );
};
