import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAssistantWidget from './components/FloatingAssistantWidget';
import CalendlyModal from './components/CalendlyModal';
import HomePage from './pages/HomePage';
import ExpertisePage from './pages/ExpertisePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import { usePublicMotion } from './hooks/usePublicMotion';
import { PROJECTS } from './data/portfolioData';

const retainedImageObjects: HTMLImageElement[] = [];

function preloadPortfolioImages() {
  if (retainedImageObjects.length > 0) return;
  const urls = new Set<string>([
    '/images/shoaib-logo.png',
    '/images/shoaib-hero-workspace.jpg',
    '/images/shoaib-whiteboard-architecture.jpg',
    '/images/shoaib-cafe-coding.jpg',
    '/images/shoaib-tech-talk.jpg',
    '/images/shoaib-whiteboard-colleague.jpg',
    '/images/shoaib-problem-solving.jpg',
    '/images/shoaib-team-architecture.jpg',
  ]);

  for (const project of PROJECTS) {
    if (project.image) urls.add(project.image);
    if (project.workImage) urls.add(project.workImage);
    for (const visual of project.gallery || []) {
      if (visual?.src) urls.add(visual.src);
    }
  }

  urls.forEach((src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    retainedImageObjects.push(img);
  });
}

function AppLayout() {
  const { pathname } = useLocation();
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  usePublicMotion(pathname);

  useEffect(() => {
    preloadPortfolioImages();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;
      if (anchor.dataset.calendlyExternal === 'true') return;
      const href = anchor.getAttribute('href') || '';
      if (/^https?:\/\/(www\.)?calendly\.com\//i.test(href)) {
        e.preventDefault();
        e.stopPropagation();
        setCalendlyUrl(href);
      }
    };
    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, []);

  return (
    <div className="site-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="sticky-top-wrapper">
        <Navbar />
      </header>
      <div id="main-content" tabIndex={-1} className="public-site" style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
      <FloatingAssistantWidget />
      <CalendlyModal url={calendlyUrl} onClose={() => setCalendlyUrl(null)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
