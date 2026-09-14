import { useState, useEffect } from 'react';
import { RouteProvider, useRouter } from '@/lib/router';
import { supabase, type Project } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProjectsPage from '@/pages/ProjectsPage';
import ContactPage from '@/pages/ContactPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import AdminPage from '@/pages/AdminPage';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { path } = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('published_at', { ascending: false });

      if (!error && data) {
        setProjects(data as Project[]);
      }
      setLoading(false);
    })();
  }, []);

  // Anti-screenshot / anti-print CSS (best-effort)
  useEffect(() => {
    const styleId = 'anti-capture-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media print {
        body { display: none !important; }
      }
      img {
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }
    `;
    document.head.appendChild(style);

    // Block common screenshot key combos (best-effort deterrent)
    const blockKeys = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText('');
        e.preventDefault();
        return false;
      }
      // Block Ctrl+Shift+S, Cmd+Shift+S (browser screenshot shortcuts)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S' || e.key === '3' || e.key === '4')) {
        e.preventDefault();
        return false;
      }
      // Block Ctrl+P (print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener('keydown', blockKeys);
    document.addEventListener('contextmenu', (e) => {
      // Block right-click on images only
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'IMG') {
        e.preventDefault();
      }
    });

    return () => {
      document.removeEventListener('keydown', blockKeys);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <Loader2 size={32} className="text-amber-400 animate-spin" />
      </div>
    );
  }

  // Route: /project/:slug
  const projectMatch = path.match(/^\/project\/(.+)$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      return (
        <>
          <Navbar />
          <ProjectDetailPage project={project} allProjects={projects} />
          <Footer />
        </>
      );
    }
    // Project not found — redirect to projects page
    window.location.hash = '/projects';
    return null;
  }

  if (path === '/' || path === '') {
    return (
      <>
        <Navbar />
        <HomePage projects={projects} />
        <Footer />
      </>
    );
  }

  if (path.startsWith('/projects')) {
    return (
      <>
        <Navbar />
        <ProjectsPage projects={projects} />
        <Footer />
      </>
    );
  }

  if (path.startsWith('/contact')) {
    return (
      <>
        <Navbar />
        <ContactPage />
        <Footer />
      </>
    );
  }

  if (path.startsWith('/admin')) {
    return <AdminPage />;
  }

  // Default: home
  return (
    <>
      <Navbar />
      <HomePage projects={projects} />
      <Footer />
    </>
  );
}

function App() {
  return (
    <RouteProvider>
      <AppContent />
    </RouteProvider>
  );
}

export default App;
