import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Play } from 'lucide-react';
import { HeroScene } from '../components/EditorialScenes';
import { RevealText } from '../components/RevealText';
import { PORTFOLIO_PROFILE, PROJECTS } from '../data/portfolioData';

const CATEGORIES = [
  'All',
  'Healthcare AI',
  'Voice AI',
  'CRM & Payments',
  'Marketing AI',
  'Animated Video AI',
  'AI Cybersecurity',
  'Agentic AI',
  'Full Stack',
];

export default function ProjectsPage() {
  const [selected, setSelected] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (selected === 'All') return PROJECTS;
    return PROJECTS.filter((p) =>
      p.category.some((c) => c.toLowerCase().includes(selected.toLowerCase()))
    );
  }, [selected]);

  return (
    <main className="ea-individuals ea-approved-organizations portfolio-projects">
      <section className="ea-page-hero ea-scene-hero">
        <div className="container ea-page-hero-grid">
          <div>
            <span className="eyebrow">All Projects & Case Studies</span>
            <div className="ea-scene-rule" aria-hidden="true" />
            <h1>
              <RevealText text="Production AI, voice, medical, security, and automation systems." />
            </h1>
            <p>
              Click any project below to explore its dedicated case study page—complete with system
              architecture, live visuals, engineering breakdown, and how I built it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                Book a 30-Min Discovery Call
                <ArrowUpRight size={19} />
              </a>
              <Link to="/contact" className="ea-button ea-button-navy">
                Send Project Inquiry
              </Link>
            </div>
          </div>
          <HeroScene
            variant="individuals"
            src="/images/shoaib-whiteboard-architecture.jpg"
            alt="Shoaib Tashrif — AI Systems Architecture"
            label={`${PROJECTS.length} Deep-Dive Case Studies`}
            note="Hilum · H2O Water · Social AI · Sergeant Coach · Valyrian VSI"
          />
        </div>
      </section>

      <section className="ea-photo-paths portfolio-project-grid">
        <div className="container">
          {/* Quick Jump Bar to Any Project Page */}
          <div
            className="portfolio-project-jump"
            style={{
              marginBottom: 28,
              padding: '18px 22px',
              borderRadius: 16,
              background: '#0a1930',
              color: '#ffffff',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8' }}>
              Direct Project Pages:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROJECTS.map((proj) => (
                <Link
                  key={proj.slug}
                  to={`/projects/${proj.slug}`}
                  className="portfolio-project-jump-link"
                  style={{
                    padding: '6px 13px',
                    borderRadius: 999,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#f8fafc',
                    textDecoration: 'none',
                    fontSize: 12.5,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  {proj.shortTitle}
                  <ArrowUpRight size={13} color="#38bdf8" />
                </Link>
              ))}
            </div>
          </div>

          <div
            className="ea-paths-intro"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span className="eyebrow">Filter by Engineering Domain</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map((cat) => {
                const active = selected === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelected(cat)}
                    className={active ? 'ea-button ea-button-blue' : 'ea-button ea-button-navy'}
                    style={{
                      padding: '8px 16px',
                      minHeight: 38,
                      fontSize: '0.84rem',
                      opacity: active ? 1 : 0.78,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ea-photo-paths-grid">
            {filtered.map((project, idx) => (
              <article
                key={project.id}
                onClick={() => navigate(`/projects/${project.slug}`)}
                className={`ea-photo-path portfolio-project-card ${idx % 2 === 0 ? 'ea-path-individuals' : 'ea-path-organizations'}`}
                style={{ cursor: 'pointer' }}
              >
                <div className="ea-path-image" style={{ position: 'relative' }}>
                  <img
                    src={project.image}
                    alt={project.title}
                    width="1536"
                    height="1024"
                   
                    style={{ objectFit: 'cover' }}
                  />
                  <span>{project.clientLabel}</span>

                  {project.videoUrl && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        padding: '6px 12px',
                        borderRadius: 999,
                        background: 'rgba(0, 127, 190, 0.92)',
                        color: '#ffffff',
                        fontSize: 11.5,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                      }}
                    >
                      <Play size={13} fill="#ffffff" /> Animated Video Call Demo Inside
                    </div>
                  )}
                </div>

                <div className="ea-path-copy">
                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {project.category.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            padding: '3px 9px',
                            borderRadius: 999,
                            background: 'rgba(56, 189, 248, 0.16)',
                            color: '#7dd3fc',
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <h2>{project.title}</h2>
                    <p>{project.summary}</p>

                    <ul style={{ margin: '12px 0 16px', paddingLeft: 18, color: 'rgba(255,255,255,0.84)', fontSize: '0.92rem' }}>
                      {project.solution.slice(0, 3).map((item) => (
                        <li key={item} style={{ marginBottom: 5 }}>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <Link
                        to={`/projects/${project.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        Explore Full Project Page →
                      </Link>

                      {project.externalUrl && (
                        <a
                          href={project.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: 12.5,
                            color: '#7dd3fc',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            textDecoration: 'none',
                          }}
                        >
                          Live Website <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ea-circle-arrow"
                    aria-label={`Open ${project.shortTitle}`}
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
