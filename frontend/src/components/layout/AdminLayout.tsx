import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Calendar,
  Award,
  Cpu,
  Image as ImageIcon,
  FileText,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { BackgroundGlows } from './BackgroundGlows';
import { Profile } from '../../types';
import { api } from '../../api/client';
import { clsx } from 'clsx';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadInquiries, setUnreadInquiries] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.getProfile().then(setProfile).catch(() => {});
    api.getInquiries({ status: 'new' }).then((inqs) => setUnreadInquiries(inqs.length)).catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Profile', to: '/admin/profile', icon: User },
    { label: 'Projects', to: '/admin/projects', icon: FolderGit2 },
    { label: 'Research', to: '/admin/research', icon: BookOpen },
    { label: 'Experience', to: '/admin/experience', icon: Briefcase },
    { label: 'Education', to: '/admin/education', icon: GraduationCap },
    { label: 'Conferences', to: '/admin/conferences', icon: Calendar },
    { label: 'Certifications & Awards', to: '/admin/certifications', icon: Award },
    { label: 'Skills', to: '/admin/skills', icon: Cpu },
    { label: 'Media Library', to: '/admin/media', icon: ImageIcon },
    { label: 'CV Manager', to: '/admin/cv', icon: FileText },
    { label: 'Inquiries', to: '/admin/inquiries', icon: Inbox, badge: unreadInquiries },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface">
      <BackgroundGlows />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-surface-container/70 backdrop-blur-32 z-30 shrink-0">
        {/* Sidebar Header with Profile */}
        <div className="p-6 border-b border-white/5 flex flex-col items-center text-center">
          <div className="relative w-16 h-16 rounded-full overflow-hidden glass-panel border border-white/20 mb-3 shadow-lg group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                {profile?.name ? profile.name.charAt(0) : 'J'}
              </div>
            )}
          </div>
          <h2 className="font-display text-sm font-bold text-on-surface">{profile?.name || 'Jeff G. Wilson'}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Admin Console</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = item.to === '/admin';
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={isExact}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all duration-200 group',
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold shadow-md shadow-primary/10'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-bold text-[10px] animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-error hover:bg-error/10 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/10 glass-nav px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg glass-panel text-on-surface hover:text-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display text-base font-bold text-on-surface hidden sm:block">
              Portfolio Control Center
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {unreadInquiries > 0 && (
              <Link
                to="/admin/inquiries"
                className="relative p-2 rounded-full glass-panel hover:border-primary/50 text-on-surface transition-colors"
                title={`${unreadInquiries} unread inquiries`}
              >
                <Bell className="w-4 h-4 text-primary" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
              </Link>
            )}

            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-xs text-primary overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.email?.charAt(0).toUpperCase() || 'A'
                )}
              </div>
              <span className="font-mono text-xs text-on-surface hidden md:block">
                {user?.email || 'admin@jeffgwilson.com'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Canvas (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1300px] mx-auto pb-12">
            <Outlet context={{ profile, setProfile }} />
          </div>
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-surface-container border-r border-white/10 h-full flex flex-col p-6 z-10 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="font-display font-bold text-sm">Admin Console</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-colors',
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-bold'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-error text-on-error font-bold text-[10px]">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-on-surface-variant hover:text-primary"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Public Website</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-error hover:bg-error/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
