import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HeroScene } from '../components/EditorialScenes';
import { RevealText } from '../components/RevealText';
import { StoryPhoto } from '../components/StoryPhoto';
import { EXPERTISE_AREAS, PORTFOLIO_PROFILE, TECHNICAL_STACK } from '../data/portfolioData';

const EXPERTISE_IMAGES: Record<string, { src: string; caption: string }> = {
  'voice-ai': {
    src: '/images/proj-voice-ai-clean.jpg',
    caption: 'Real-time voice, telephony and multimodal conversation systems',
  },
  agents: {
    src: '/images/proj-multi-agent.jpg',
    caption: 'Tool-using agents, orchestration and grounded AI workflows',
  },
  automations: {
    src: '/images/proj-automation-crm.jpg',
    caption: 'Operational automation connected to real business systems',
  },
  'full-stack': {
    src: '/images/engineering-stack.jpg',
    caption: 'Product interfaces, APIs, data and infrastructure working as one',
  },
  infrastructure: {
    src: '/images/proj-valyrian-security.jpg',
    caption: 'Observable, secure and reliable production infrastructure',
  },
};

export default function ExpertisePage() {
  return (
    <main className="ea-individuals ea-approved-individuals portfolio-expertise">
      <section className="ea-page-hero ea-scene-hero">
        <div className="container ea-page-hero-grid">
          <div>
            <span className="eyebrow">Expertise &amp; Architecture</span>
            <div className="ea-scene-rule" aria-hidden="true" />
            <h1>
              <RevealText text="End-to-end AI, voice, and full-stack software engineering." />
            </h1>
            <p>
              From low-latency telephony voice agents and stateful LangGraph workflows to full-stack
              React, Next.js, and FastAPI applications deployed on Linux and cloud infrastructure.
            </p>
            <a
              href={PORTFOLIO_PROFILE.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="ea-button ea-button-blue"
            >
              Book a short discovery call
              <ArrowUpRight size={19} />
            </a>
          </div>
          <HeroScene
            variant="individuals"
            src="/images/shoaib-whiteboard-colleague.jpg"
            alt="Shoaib Tashrif — System Architecture"
            label="Production AI Engineering"
            note="Voice AI · Agentic Systems · Full-Stack"
          />
        </div>
      </section>

      {EXPERTISE_AREAS.map((area, idx) => (
        <section
          key={area.id}
          className={`section-space ea-approved-section ea-section-with-photo ea-expertise-section ${idx % 2 === 1 ? 'ea-programs ea-expertise-section-reverse' : ''}`}
        >
          <div className="container">
            <div className="ea-split">
              <div className="ea-section-heading">
                <h2>
                  <RevealText text={area.title} />
                </h2>
                <StoryPhoto
                  src={EXPERTISE_IMAGES[area.id].src}
                  alt={area.title}
                  caption={EXPERTISE_IMAGES[area.id].caption}
                />
              </div>
              <div className="ea-approved-copy">
                <p>{area.summary}</p>
                {area.capabilities.map((cap) => (
                  <p key={cap}>
                    <strong>&bull;</strong> {cap}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section-space ea-approved-section ea-programs">
        <div className="container">
          <div className="ea-split">
            <div className="ea-section-heading">
              <h2>
                <RevealText text="Complete Technical Stack" />
              </h2>
            </div>
            <div className="ea-approved-copy">
              {TECHNICAL_STACK.map((group) => (
                <p key={group.group}>
                  <strong>{group.group}:</strong> {group.items.join(' · ')}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ea-cta">
        <div className="container ea-cta-inner">
          <div>
            <h2>
              <RevealText text="Discuss your technical architecture" />
            </h2>
          </div>
          <div className="ea-cta-action">
            <p>
              Share your requirements via the inquiry form or schedule a 30-minute technical call on
              Calendly.
            </p>
            <Link to="/contact" className="ea-button ea-button-blue">
              Open Inquiry Form
              <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
