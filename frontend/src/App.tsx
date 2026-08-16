import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './admin/ProtectedRoute';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Research } from './pages/Research';
import { Experience } from './pages/Experience';
import { Education } from './pages/Education';
import { Conferences } from './pages/Conferences';
import { Certifications } from './pages/Certifications';
import { Awards } from './pages/Awards';
import { WorkWithMe } from './pages/WorkWithMe';
import { Contact } from './pages/Contact';
import { CVViewer } from './pages/CVViewer';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProfile } from './admin/AdminProfile';
import { AdminProjects } from './admin/AdminProjects';
import { AdminProjectEdit } from './admin/AdminProjectEdit';
import { AdminResearch } from './admin/AdminResearch';
import { AdminResearchEdit } from './admin/AdminResearchEdit';
import { AdminExperience } from './admin/AdminExperience';
import { AdminEducation } from './admin/AdminEducation';
import { AdminConferences } from './admin/AdminConferences';
import { AdminCertifications } from './admin/AdminCertifications';
import { AdminSkills } from './admin/AdminSkills';
import { AdminMedia } from './admin/AdminMedia';
import { AdminCV } from './admin/AdminCV';
import { AdminInquiries } from './admin/AdminInquiries';
import { AdminSettings } from './admin/AdminSettings';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes Wrapped in PublicLayout */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="research" element={<Research />} />
                <Route path="research/:slug" element={<Research />} />
                <Route path="experience" element={<Experience />} />
                <Route path="education" element={<Education />} />
                <Route path="conferences" element={<Conferences />} />
                <Route path="certifications" element={<Certifications />} />
                <Route path="awards" element={<Awards />} />
                <Route path="work-with-me" element={<WorkWithMe />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cv" element={<CVViewer />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Routes Wrapped in AdminLayout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectEdit />} />
                <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
                <Route path="research" element={<AdminResearch />} />
                <Route path="research/new" element={<AdminResearchEdit />} />
                <Route path="research/:id/edit" element={<AdminResearchEdit />} />
                <Route path="experience" element={<AdminExperience />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="conferences" element={<AdminConferences />} />
                <Route path="certifications" element={<AdminCertifications />} />
                <Route path="skills" element={<AdminSkills />} />
                <Route path="media" element={<AdminMedia />} />
                <Route path="cv" element={<AdminCV />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
