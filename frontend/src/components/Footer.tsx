import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';

export default function Footer() {
  return (
    <footer className="ea-footer public-site">
      <div className="container">
        <div className="ea-footer-top">
          <div className="ea-footer-brand">
            <Link to="/" style={{ display: 'inline-block', marginBottom: 10 }}>
              <img
                src="/images/shoaib-logo.png"
                alt="Shoaib Tashrif — AI Engineer"
                style={{
                  height: 68,
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  padding: '6px 10px',
                }}
              />
            </Link>
            <p>Full Stack AI Software Engineer · Voice AI, Agents &amp; Systems</p>
            <span>
              Based in Pakistan · Working with clients across Canada, USA, UK, Australia &amp; worldwide
            </span>
          </div>

          <div className="ea-footer-links">
            <Link to="/expertise">Expertise</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/reviews">Client Reviews</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a
              href={PORTFOLIO_PROFILE.links.github}
              aria-label="Shoaib Tashrif on GitHub"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_PROFILE.links.linkedin}
              aria-label="Shoaib Tashrif on LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <span
                aria-hidden="true"
                style={{ fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 20 }}
              >
                in
              </span>
            </a>
          </div>

          <div className="ea-footer-contact">
            <a href={`mailto:${PORTFOLIO_PROFILE.email}`}>{PORTFOLIO_PROFILE.email}</a>
            <a href={PORTFOLIO_PROFILE.calendlyUrl} target="_blank" rel="noreferrer">
              Book 30-Min Discovery Call &rarr;
            </a>
          </div>
        </div>

        <div className="ea-footer-bottom">
          <span>&copy; {new Date().getFullYear()} Shoaib Tashrif · Full Stack AI Software Engineer.</span>
          <div>
            <a href={PORTFOLIO_PROFILE.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={PORTFOLIO_PROFILE.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
