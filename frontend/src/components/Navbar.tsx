import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, FolderGit2, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/portfolioData';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setOpen(false);
    setProjectsDropdownOpen(false);
    setMobileProjectsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open && !projectsDropdownOpen) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setProjectsDropdownOpen(false);
        toggleRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProjectsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, projectsDropdownOpen]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setProjectsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setProjectsDropdownOpen(false);
    }, 180);
  };

  const isProjectsActive = pathname === '/projects' || pathname.startsWith('/projects/');

  return (
    <div className="ea-header public-site">
      <nav className="container ea-nav" aria-label="Main navigation">
        <Link
          className="ea-logo"
          to="/"
          aria-label="Shoaib Tashrif home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <img
            src="/images/shoaib-logo.png"
            alt="Shoaib Tashrif — AI Engineer"
            style={{
              height: 52,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 8,
            }}
          />
        </Link>

        <div className="ea-desktop-links" style={{ alignItems: 'center' }}>
          <Link
            to="/expertise"
            aria-current={pathname === '/expertise' ? 'page' : undefined}
          >
            Expertise
          </Link>

          {/* Projects Dropdown */}
          <div
            ref={dropdownRef}
            className="nav-projects"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setProjectsDropdownOpen((prev) => !prev)}
              aria-expanded={projectsDropdownOpen}
              className={isProjectsActive ? 'nav-projects-trigger is-active' : 'nav-projects-trigger'}
            >
              Projects
              <ChevronDown
                size={15}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: projectsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {projectsDropdownOpen && (
              <div className="nav-projects-menu">
                <Link
                  to="/projects"
                  onClick={() => setProjectsDropdownOpen(false)}
                  className="nav-projects-all"
                >
                  <span>
                    <FolderGit2 size={17} />
                    <span><strong>All projects</strong><small>{PROJECTS.length} selected case studies</small></span>
                  </span>
                  <ArrowUpRight size={16} />
                </Link>

                <div className="nav-projects-grid">
                  {PROJECTS.map((proj) => {
                    const active = pathname === `/projects/${proj.slug}`;
                    return (
                      <Link
                        key={proj.slug}
                        to={`/projects/${proj.slug}`}
                        onClick={() => setProjectsDropdownOpen(false)}
                        className={active ? 'nav-project-card is-active' : 'nav-project-card'}
                      >
                        <img
                          src={proj.image}
                          alt={proj.shortTitle}
                        />
                        <div>
                          <strong>{proj.shortTitle}</strong>
                          <small>{proj.clientLabel}</small>
                        </div>
                        <ArrowUpRight size={14} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/about"
            aria-current={pathname === '/about' ? 'page' : undefined}
          >
            About
          </Link>

          <Link
            to="/contact"
            aria-current={pathname === '/contact' ? 'page' : undefined}
          >
            Contact
          </Link>
        </div>

        <button
          type="button"
          className="ea-button ea-button-navy nav-book"
          onClick={() => navigate('/contact')}
        >
          Let&apos;s talk <ArrowUpRight size={17} />
        </button>

        <button
          ref={toggleRef}
          type="button"
          className="ea-menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div id="mobile-navigation" className="ea-mobile-nav">
          <div className="container ea-mobile-nav-inner">
            <Link to="/expertise" onClick={() => setOpen(false)}>
              Expertise
            </Link>

            <div>
              <button
                type="button"
                onClick={() => setMobileProjectsOpen((p) => !p)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '10px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#0a1930',
                  cursor: 'pointer',
                }}
              >
                <span>Projects ({PROJECTS.length})</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: mobileProjectsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {mobileProjectsOpen && (
                <div
                  style={{
                    paddingLeft: 12,
                    marginBottom: 8,
                    borderLeft: '2px solid rgba(0, 127, 190, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <Link
                    to="/projects"
                    onClick={() => setOpen(false)}
                    style={{ fontWeight: 700, color: '#007fbe', fontSize: 14 }}
                  >
                    → View All Projects
                  </Link>
                  {PROJECTS.map((proj) => (
                    <Link
                      key={proj.slug}
                      to={`/projects/${proj.slug}`}
                      onClick={() => setOpen(false)}
                      style={{ fontSize: 13.5, color: '#1e293b', padding: '4px 0' }}
                    >
                      {proj.shortTitle}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>

            <button
              type="button"
              className="ea-button ea-button-blue"
              onClick={() => {
                setOpen(false);
                navigate('/contact');
              }}
            >
              Let&apos;s talk <ArrowUpRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
