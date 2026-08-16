import {
  Profile, Project, Research, Experience, Education,
  Conference, Certification, Award, Skill, MediaItem,
  CVItem, Inquiry, AdminStats, User, AuthToken
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = 'An error occurred';
    try {
      const data = await res.json();
      errorDetail = data.detail || data.message || JSON.stringify(data);
    } catch {
      errorDetail = res.statusText || `HTTP ${res.status}`;
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthToken> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthToken>(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<User>(res);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async changeEmail(newEmail: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/change-email`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ new_email: newEmail, password }),
    });
    return handleResponse<User>(res);
  },

  // Profile
  async getProfile(): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`);
    return handleResponse<Profile>(res);
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Profile>(res);
  },

  async uploadAvatar(file: File): Promise<Profile> {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/profile/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<Profile>(res);
  },

  // Projects
  async getProjects(params?: { featured?: boolean; category?: string; published_only?: boolean }): Promise<Project[]> {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.category) query.append('category', params.category);
    if (params?.published_only !== undefined) query.append('published_only', String(params.published_only));
    const res = await fetch(`${API_BASE}/projects?${query.toString()}`);
    return handleResponse<Project[]>(res);
  },

  async getAdminProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Project[]>(res);
  },

  async getProject(slugOrId: string | number): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${slugOrId}`);
    return handleResponse<Project>(res);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async updateProject(id: number, data: Partial<Project>): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async deleteProject(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Research
  async getResearch(params?: { featured?: boolean; published_only?: boolean }): Promise<Research[]> {
    const query = new URLSearchParams();
    if (params?.featured !== undefined) query.append('featured', String(params.featured));
    if (params?.published_only !== undefined) query.append('published_only', String(params.published_only));
    const res = await fetch(`${API_BASE}/research?${query.toString()}`);
    return handleResponse<Research[]>(res);
  },

  async getAdminResearch(): Promise<Research[]> {
    const res = await fetch(`${API_BASE}/research/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Research[]>(res);
  },

  async getResearchItem(slugOrId: string | number): Promise<Research> {
    const res = await fetch(`${API_BASE}/research/${slugOrId}`);
    return handleResponse<Research>(res);
  },

  async createResearch(data: Partial<Research>): Promise<Research> {
    const res = await fetch(`${API_BASE}/research`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Research>(res);
  },

  async updateResearch(id: number, data: Partial<Research>): Promise<Research> {
    const res = await fetch(`${API_BASE}/research/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Research>(res);
  },

  async deleteResearch(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/research/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Experience
  async getExperience(published_only: boolean = true): Promise<Experience[]> {
    const res = await fetch(`${API_BASE}/experience?published_only=${published_only}`);
    return handleResponse<Experience[]>(res);
  },

  async getAdminExperience(): Promise<Experience[]> {
    const res = await fetch(`${API_BASE}/experience/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Experience[]>(res);
  },

  async createExperience(data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/experience`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  async updateExperience(id: number, data: Partial<Experience>): Promise<Experience> {
    const res = await fetch(`${API_BASE}/experience/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Experience>(res);
  },

  async deleteExperience(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/experience/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Education
  async getEducation(published_only: boolean = true): Promise<Education[]> {
    const res = await fetch(`${API_BASE}/education?published_only=${published_only}`);
    return handleResponse<Education[]>(res);
  },

  async getAdminEducation(): Promise<Education[]> {
    const res = await fetch(`${API_BASE}/education/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Education[]>(res);
  },

  async createEducation(data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  async updateEducation(id: number, data: Partial<Education>): Promise<Education> {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Education>(res);
  },

  async deleteEducation(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/education/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Conferences
  async getConferences(published_only: boolean = true): Promise<Conference[]> {
    const res = await fetch(`${API_BASE}/conferences?published_only=${published_only}`);
    return handleResponse<Conference[]>(res);
  },

  async getAdminConferences(): Promise<Conference[]> {
    const res = await fetch(`${API_BASE}/conferences/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Conference[]>(res);
  },

  async createConference(data: Partial<Conference>): Promise<Conference> {
    const res = await fetch(`${API_BASE}/conferences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Conference>(res);
  },

  async updateConference(id: number, data: Partial<Conference>): Promise<Conference> {
    const res = await fetch(`${API_BASE}/conferences/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Conference>(res);
  },

  async deleteConference(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/conferences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Certifications
  async getCertifications(published_only: boolean = true): Promise<Certification[]> {
    const res = await fetch(`${API_BASE}/certifications?published_only=${published_only}`);
    return handleResponse<Certification[]>(res);
  },

  async getAdminCertifications(): Promise<Certification[]> {
    const res = await fetch(`${API_BASE}/certifications/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Certification[]>(res);
  },

  async createCertification(data: Partial<Certification>): Promise<Certification> {
    const res = await fetch(`${API_BASE}/certifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Certification>(res);
  },

  async updateCertification(id: number, data: Partial<Certification>): Promise<Certification> {
    const res = await fetch(`${API_BASE}/certifications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Certification>(res);
  },

  async deleteCertification(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/certifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Awards
  async getAwards(published_only: boolean = true): Promise<Award[]> {
    const res = await fetch(`${API_BASE}/awards?published_only=${published_only}`);
    return handleResponse<Award[]>(res);
  },

  async getAdminAwards(): Promise<Award[]> {
    const res = await fetch(`${API_BASE}/awards/admin/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Award[]>(res);
  },

  async createAward(data: Partial<Award>): Promise<Award> {
    const res = await fetch(`${API_BASE}/awards`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Award>(res);
  },

  async updateAward(id: number, data: Partial<Award>): Promise<Award> {
    const res = await fetch(`${API_BASE}/awards/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Award>(res);
  },

  async deleteAward(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/awards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Skills
  async getSkills(params?: { category?: string; featured_only?: boolean }): Promise<Skill[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured_only) query.append('featured_only', 'true');
    const res = await fetch(`${API_BASE}/skills?${query.toString()}`);
    return handleResponse<Skill[]>(res);
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  async updateSkill(id: number, data: Partial<Skill>): Promise<Skill> {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Skill>(res);
  },

  async deleteSkill(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Inquiries
  async submitInquiry(data: {
    category: string;
    full_name: string;
    email: string;
    company_or_institution?: string;
    project_title_or_name?: string;
    research_area?: string;
    project_type?: string;
    platform?: string;
    has_design?: boolean;
    budget?: string;
    timeline?: string;
    description_or_message: string;
  }): Promise<Inquiry> {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Inquiry>(res);
  },

  async getInquiries(params?: { category?: string; status?: string; search?: string }): Promise<Inquiry[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/inquiries?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Inquiry[]>(res);
  },

  async updateInquiryStatus(id: number, status: string, notes?: string): Promise<Inquiry> {
    const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse<Inquiry>(res);
  },

  async deleteInquiry(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Media
  async getMedia(params?: { category?: string; file_type?: string }): Promise<MediaItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.file_type) query.append('file_type', params.file_type);
    const res = await fetch(`${API_BASE}/media?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<MediaItem[]>(res);
  },

  async uploadMedia(file: File, category: string = 'general'): Promise<MediaItem> {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<MediaItem>(res);
  },

  async deleteMedia(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // CV
  async getActiveCV(): Promise<CVItem | null> {
    const res = await fetch(`${API_BASE}/cv/active`);
    return handleResponse<CVItem | null>(res);
  },

  async getAllCVs(): Promise<CVItem[]> {
    const res = await fetch(`${API_BASE}/cv/all`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<CVItem[]>(res);
  },

  async uploadCV(file: File, title: string, version: string, setActive: boolean = true): Promise<CVItem> {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('version', version);
    formData.append('set_active', String(setActive));
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/cv/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<CVItem>(res);
  },

  async activateCV(id: number): Promise<CVItem> {
    const res = await fetch(`${API_BASE}/cv/${id}/activate`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse<CVItem>(res);
  },

  async deleteCV(id: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/cv/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Settings
  async getSettings(): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<Record<string, string>>(res);
  },

  async updateBulkSettings(settings: Record<string, string>): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/settings/bulk`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Dashboard Stats
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AdminStats>(res);
  },
};
