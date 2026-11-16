import { Link } from 'react-router-dom';
import { ArrowUpRight, Bot } from 'lucide-react';
import { RevealText } from '../components/RevealText';
import { CinematicSection } from '../components/CinematicSection';
import { StoryPhoto } from '../components/StoryPhoto';
import ClientReviewsSection from '../components/ClientReviewsSection';
import TrustedLogosMarquee from '../components/TrustedLogosMarquee';
import { EXPERTISE_AREAS, PORTFOLIO_PROFILE, PROJECTS } from '../data/portfolioData';

export default function HomePage() {
  const featuredProjects = PROJECTS.slice(0, 6);

  const openAssistant = () => {
    window.dispatchEvent(new Event('open-shoaib-assistant'));
  };

  return (
    <main className="ea-home-v2 ea-approved-home">
      {/* HERO — IDENTICAL TO SCOTT'S HOME HERO */}
      <section className="ea-hero">
        <div className="container ea-hero-grid">
          <div className="ea-hero-copy">
            <span className="eyebrow">Full Stack AI Software Engineer</span>
            <div className="ea-hero-rule" aria-hidden="true" />
            <h1>
              <RevealText text="Not just another AI demo." />
              <br />
              <span className="blue-text">
                <RevealText
                  text="Production voice, agents, and full-stack systems."
                  offset={18}
                />
              </span>
            </h1>
            <p>{PORTFOLIO_PROFILE.shortSummary}</p>
            <p>
              From real-time telephony voice pipelines and LangGraph multi-agent workflows to
              complete React, Next.js, and FastAPI platforms integrated with CRMs and calendars.
            </p>
            <div className="ea-hero-actions">
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                Book a short discovery call
                <ArrowUpRight size={19} />
              </a>
              <button type="button" className="ea-text-link" onClick={openAssistant}>
                Talk to Shoaib&apos;s AI Assistant
                <Bot size={17} />
              </button>
            </div>

            {/* PROMINENT TRUSTED BY CLIENTS PROOF PILL */}
            <div style={{ marginTop: 22 }}>
              <Link
                to="/reviews"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: 'rgba(2, 132, 199, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.38)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                <span style={{ color: '#facc15', fontWeight: 800, letterSpacing: '0.04em' }}>★★★★★ 5.0</span>
                <span>
                  Trusted by <strong>Wosler Corp (Canada)</strong>, <strong>Executive Ally (USA)</strong>, <strong>VSI</strong> &amp; 15+ Clients
                </span>
                <span style={{ color: '#38bdf8', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  See 14 Verified Reviews &amp; Letters <ArrowUpRight size={15} />
                </span>
              </Link>
            </div>
          </div>

          <figure className="ea-hero-portrait">
            <div className="ea-portrait-backplate" aria-hidden="true" />
            <div className="ea-portrait-window">
              <img
                src="/images/shoaib-hero-workspace.jpg"
                alt="Shoaib Tashrif — Full Stack AI Software Engineer"
                width="1264"
                height="1568"
                fetchPriority="high"
              />
            </div>
            <figcaption>
              <div>
                <strong>Shoaib Tashrif</strong>
                <span>Full Stack AI Software Engineer</span>
              </div>
              <Link to="/about" aria-label="Meet Shoaib Tashrif">
                <ArrowUpRight size={27} />
              </Link>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* TRUSTED BY — LARGE MOVING ORIGINAL LOGOS RIGHT BELOW HERO */}
      <TrustedLogosMarquee />

      {/* TWO DOORS — IDENTICAL TO SCOTT'S PHOTO PATHS */}
      <section className="ea-photo-paths">
        <div className="container">
          <div className="ea-paths-intro">
            <span className="eyebrow">Two pillars. One engineering approach.</span>
          </div>
          <div className="ea-photo-paths-grid">
            <Link to="/expertise" className="ea-photo-path ea-path-individuals">
              <div className="ea-path-image">
                <img
                  src="/images/shoaib-cafe-coding.jpg"
                  alt="Shoaib Tashrif solving complex engineering problems"
                  width="1536"
                  height="1024"
                 
                />
                <span>Voice AI &amp; Agents</span>
              </div>
              <div className="ea-path-copy">
                <div>
                  <h2>Voice AI &amp; Agentic Workflows</h2>
                  <p>
                    Real-time inbound/outbound phone agents, STT &rarr; LLM &rarr; TTS pipelines,
                    stateful LangGraph orchestration, and RAG knowledge assistants.
                  </p>
                  <span className="ea-text-link">Explore Expertise &rarr;</span>
                </div>
                <span className="ea-door-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </div>
            </Link>

            <Link to="/projects" className="ea-photo-path ea-path-organizations">
              <div className="ea-path-image">
                <img
                  src="/images/shoaib-whiteboard-architecture.jpg"
                  alt="Shoaib Tashrif designing full-stack system architecture"
                  width="1536"
                  height="1024"
                 
                />
                <span>Full Stack &amp; Automation</span>
              </div>
              <div className="ea-path-copy">
                <div>
                  <h2>Full-Stack Software &amp; CRM Automation</h2>
                  <p>
                    Production web apps, backend microservices, and automated workflows connected to
                    Twilio, CRMs, calendars, databases, and cloud infrastructure.
                  </p>
                  <span className="ea-text-link">View Case Studies &rarr;</span>
                </div>
                <span className="ea-door-arrow">
                  <ArrowUpRight size={25} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT SECTION — IDENTICAL TO SCOTT'S COPY SECTION */}
      <section className="section-space ea-approved-section ea-section-with-photo">
        <div className="container">
          <div className="ea-split">
            <div className="ea-section-heading">
              <h2>
                <RevealText text="Built for real workflows, not fragile prototypes." />
              </h2>
              <StoryPhoto
                src="/images/shoaib-tech-talk.jpg"
                alt="Shoaib Tashrif presenting AI engineering at a tech meetup"
                caption="Shoaib Tashrif · Full Stack AI Engineer"
              />
            </div>
            <div className="ea-approved-copy">
              <p>{PORTFOLIO_PROFILE.detailedSummary}</p>
              {EXPERTISE_AREAS.slice(0, 3).map((area) => (
                <p key={area.id}>
                  <strong>{area.title}:</strong> {area.summary}
                </p>
              ))}
              <Link to="/expertise" className="ea-text-link">
                See all engineering capabilities &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC SECTION — IDENTICAL TO SCOTT'S CINEMATIC SECTION */}
      <CinematicSection
        section={{
          title: 'How I Engineer Reliable AI Systems',
          body: [
            'Start by mapping the real business workflow, constraints, users, and existing tools before choosing between conventional software, automation, or AI.',
            'Design modular architectures with replaceable model providers, real failure paths, low-latency audio/API handling, and clear human escalation.',
          ],
        }}
        src="/images/shoaib-whiteboard-architecture.jpg"
        alt="Shoaib Tashrif — System Architecture"
      />

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="section-space ea-approved-section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 36,
            }}
          >
            <div>
              <span className="eyebrow">Selected Case Studies</span>
              <h2 style={{ marginTop: 8 }}>
                <RevealText text="Delivered across Healthcare, SaaS, and Operations." />
              </h2>
            </div>
            <Link to="/projects" className="ea-button ea-button-navy">
              View all {PROJECTS.length} projects
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="ea-photo-paths-grid">
            {featuredProjects.map((project) => (
              <Link
                to={`/projects/${project.slug}`}
                key={project.id}
                className="ea-photo-path ea-path-individuals"
              >
                <div className="ea-path-image">
                  <img
                    src={project.image}
                    alt={project.title}
                    width="1536"
                    height="1024"
                   
                  />
                  <span>{project.clientLabel}</span>
                </div>
                <div className="ea-path-copy">
                  <div>
                    <h2>{project.shortTitle}</h2>
                    <p>{project.summary}</p>
                    <span className="ea-text-link">Explore Full Case Study &rarr;</span>
                  </div>
                  <span className="ea-door-arrow">
                    <ArrowUpRight size={25} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VERIFIED CLIENT ENDORSEMENTS, LINKEDIN RECOMMENDATIONS & 5.0 UPWORK REVIEWS */}
      <ClientReviewsSection />

      {/* APPROVED CLOSE CTA — IDENTICAL TO SCOTT'S CLOSE */}
      <section className="ea-cta">
        <div className="container ea-cta-inner">
          <div>
            <h2>
              <RevealText text="Book a short discovery call" />
            </h2>
          </div>
          <div className="ea-cta-action">
            <p>
              Whether you need a production voice AI agent, multi-agent workflow, or full-stack
              application, let&apos;s map out the simplest dependable architecture.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                Book 30-Min Call on Calendly
                <ArrowUpRight size={19} />
              </a>
              <Link to="/contact" className="ea-button ea-button-navy">
                Send Project Inquiry
                <ArrowUpRight size={19} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
