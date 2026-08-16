export interface Profile {
  id: number;
  name: string;
  headline?: string;
  titles?: string;
  short_bio?: string;
  full_bio?: string;
  avatar_url?: string;
  status_text?: string;
  currently_exploring?: string;
  email?: string;
  phone?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  image_url?: string;
  gallery?: string;
  category: string;
  technologies?: string;
  github_url?: string;
  live_demo_url?: string;
  research_url?: string;
  featured: boolean;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Research {
  id: number;
  title: string;
  slug: string;
  authors?: string;
  abstract: string;
  research_area?: string;
  methodology?: string;
  technologies?: string;
  conference_journal?: string;
  publication_status?: string;
  year?: string;
  doi?: string;
  external_url?: string;
  pdf_url?: string;
  featured_image_url?: string;
  featured: boolean;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  technologies?: string;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  degree: string;
  field_of_study: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
  description?: string;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Conference {
  id: number;
  event_name: string;
  location?: string;
  date_string?: string;
  role?: string;
  description?: string;
  image_url?: string;
  certificate_url?: string;
  external_url?: string;
  featured: boolean;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date?: string;
  expiry_date?: string;
  credential_id?: string;
  verification_url?: string;
  image_url?: string;
  pdf_url?: string;
  description?: string;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: number;
  title: string;
  organization: string;
  award_date?: string;
  description?: string;
  certificate_url?: string;
  external_url?: string;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_name?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  category: string;
  created_at: string;
}

export interface CVItem {
  id: number;
  title: string;
  filename: string;
  file_url: string;
  file_size: number;
  version: string;
  is_active: boolean;
  created_at: string;
}

export interface Inquiry {
  id: number;
  category: "research" | "web" | "mobile" | "general" | string;
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
  status: "new" | "reviewing" | "contacted" | "in_discussion" | "completed" | "archived" | string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AdminStats {
  total_projects: number;
  total_research: number;
  total_skills: number;
  total_experience: number;
  total_conferences: number;
  total_certifications: number;
  total_awards: number;
  unread_inquiries: number;
  total_inquiries: number;
  inquiry_categories: Record<string, number>;
  recent_activities: ActivityItem[];
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// Runtime constants to prevent any module import syntax errors in browser dev mode
export const Profile = {};
export const Project = {};
export const Research = {};
export const Experience = {};
export const Education = {};
export const Conference = {};
export const Certification = {};
export const Award = {};
export const Skill = {};
export const MediaItem = {};
export const CVItem = {};
export const Inquiry = {};
export const AdminStats = {};
export const User = {};
export const AuthToken = {};
