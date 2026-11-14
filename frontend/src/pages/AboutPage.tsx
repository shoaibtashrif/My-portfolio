import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { HeroScene } from '../components/EditorialScenes';
import { RevealText } from '../components/RevealText';
import { StoryPhoto } from '../components/StoryPhoto';
import { EMPLOYMENT_HISTORY, PORTFOLIO_PROFILE, WORK_METHOD } from '../data/portfolioData';

export default function AboutPage() {
  return (
    <main className="ea-about-authentic ea-approved-about portfolio-about">
      <section className="ea-page-hero ea-scene-hero">
        <div className="container ea-page-hero-grid">
          <div>
            <span className="eyebrow">About &amp; Experience</span>
            <div className="ea-scene-rule" aria-hidden="true" />
            <h1>
              <RevealText text="Building intelligent systems. Staying grounded in the real world." />
            </h1>
            <p>{PORTFOLIO_PROFILE.detailedSummary}</p>
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
            variant="about"
            src="/images/shoaib-nature-perspective.jpg"
            alt="Shoaib Tashrif outdoors at sunset, reflecting in nature"
            label="Technology with perspective"
            note="Shoaib Tashrif · Engineer · Builder · Outdoors"
          />
        </div>
      </section>

      <section className="portfolio-nature-note">
        <div className="container portfolio-nature-note-grid">
          <span className="eyebrow">Beyond the screen</span>
          <h2>
            <RevealText text="Engineering gives me focus. Nature gives me perspective." />
          </h2>
          <p>
            I enjoy building complex AI systems, but I do my clearest thinking away from the noise.
            Time outdoors keeps me curious, patient, and grounded—the same qualities I bring back to
            every architecture decision and every product I ship.
          </p>
        </div>
      </section>

      <section className="section-space ea-approved-section ea-section-with-photo">
        <div className="container">
          <div className="ea-split">
            <div className="ea-section-heading">
              <h2>
                <RevealText text="Career Timeline & Roles" />
              </h2>
              <StoryPhoto
                src="/images/shoaib-cafe-coding.jpg"
                alt="Shoaib Tashrif solving software architecture problems"
                caption="Shoaib Tashrif · Engineering Problem Solving"
              />
            </div>
            <div className="ea-approved-copy">
              {EMPLOYMENT_HISTORY.map((job) => (
                <div
                  key={job.id}
                  style={{
                    paddingBottom: 24,
                    marginBottom: 24,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <p style={{ margin: '0 0 4px', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {job.role}
                  </p>
                  <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    {job.organizationLabel} · {job.location} ({job.period})
                  </p>
                  <p style={{ margin: '0 0 10px' }}>{job.summary}</p>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>Stack:</strong> {job.technologyTags.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-space ea-approved-section ea-programs ea-section-with-photo">
        <div className="container">
          <div className="ea-split">
            <div className="ea-section-heading">
              <h2>
                <RevealText text="5-Stage Engineering Method & Education" />
              </h2>
              <StoryPhoto
                src="/images/shoaib-tech-talk.jpg"
                alt="Shoaib Tashrif speaking at a developer conference"
                caption={`${PORTFOLIO_PROFILE.education.degree} · ${PORTFOLIO_PROFILE.education.institution}`}
              />
            </div>
            <div className="ea-approved-copy">
              {WORK_METHOD.map((w) => (
                <p key={w.step}>
                  <strong>{w.step}:</strong> {w.description}
                </p>
              ))}
              <blockquote>
                “Solve real business problems before choosing tools. Use AI only where it adds value, and keep sensitive actions reviewable.”
              </blockquote>
              <p>
                <strong>Education:</strong> {PORTFOLIO_PROFILE.education.degree},{' '}
                {PORTFOLIO_PROFILE.education.institution} ({PORTFOLIO_PROFILE.education.campus}) — CGPA{' '}
                {PORTFOLIO_PROFILE.education.cgpa}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ea-cta">
        <div className="container ea-cta-inner">
          <div>
            <h2>
              <RevealText text="Let’s discuss your system or role" />
            </h2>
          </div>
          <div className="ea-cta-action">
            <p>
              Open to Remote, Freelance, Contract, and Full-Time opportunities across international
              teams.
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
