import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BrandLogoItem {
  id: string;
  name: string;
  subtitle: string;
  to: string;
  renderMark: () => JSX.Element;
}

const TRUSTED_BRANDS: BrandLogoItem[] = [
  {
    id: 'wosler',
    name: 'Wosler Corp.',
    subtitle: 'Healthcare AI · Canada',
    to: '/projects/hilum-healthcare-ai',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#0B2447" />
        <path
          d="M10 15L15.2 29L22 18L28.8 29L34 15"
          stroke="#38BDF8"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="12" r="2.2" fill="#38BDF8" />
      </svg>
    ),
  },
  {
    id: 'h2o',
    name: 'H2O Water Co.',
    subtitle: 'Delivery & CRM · USA',
    to: '/projects/h2o-water-company',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#0369A1" />
        <path
          d="M22 9C22 9 13 19.2 13 25.5C13 30.5 17 34.5 22 34.5C27 34.5 31 30.5 31 25.5C31 19.2 22 9 22 9Z"
          fill="#E0F2FE"
        />
        <path
          d="M18.2 26.2C18.2 28.4 19.9 30.1 22 30.1"
          stroke="#0284C7"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: 'executive-ally',
    name: 'Executive Ally',
    subtitle: 'Miles LeHane · USA',
    to: '/projects/executive-ally-platform',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#0A1930" />
        <path
          d="M13 13H29M13 22H25M13 31H29"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M27 29L32 13L36 29"
          stroke="#38BDF8"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'baboo-travel',
    name: 'Baboo Travel',
    subtitle: 'Voice & Travel AI · Global',
    to: '/projects/baboo-travel-ai',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#0F766E" />
        <circle cx="22" cy="22" r="10.5" stroke="#CCFBF1" strokeWidth="2.4" />
        <path
          d="M12.5 22H31.5M22 11.5C25 14.5 26.5 18.2 26.5 22C26.5 25.8 25 29.5 22 32.5C19 29.5 17.5 25.8 17.5 22C17.5 18.2 19 14.5 22 11.5Z"
          stroke="#CCFBF1"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: 'valyrian',
    name: 'Valyrian Systems',
    subtitle: 'AI Cybersecurity · VSI',
    to: '/projects/valyrian-systems',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#1E1B4B" />
        <path
          d="M22 10L32 14.5V22.5C32 28.4 27.7 32.9 22 34.8C16.3 32.9 12 28.4 12 22.5V14.5L22 10Z"
          stroke="#818CF8"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 19.5L22 27L26.5 19.5"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'hilum',
    name: 'Hilum',
    subtitle: 'DICOM & Clinic AI · Canada',
    to: '/projects/hilum-healthcare-ai',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#0F172A" />
        <path
          d="M14 13V31M30 13V31M14 22H30"
          stroke="#38BDF8"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="22" cy="22" r="3" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'sergeant',
    name: 'Sergeant AI',
    subtitle: 'Better You · Video Coach',
    to: '/projects/sergeant-ai-coach',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#1D4ED8" />
        <path
          d="M15 26L22 13L29 26L22 22.5L15 26Z"
          fill="#FFFFFF"
        />
        <path
          d="M15 31L22 27.5L29 31"
          stroke="#93C5FD"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'nextstep',
    name: 'NextStepAI',
    subtitle: 'Multi-Agent SaaS',
    to: '/projects/nextstep-multi-agent',
    renderMark: () => (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect width="44" height="44" rx="11" fill="#082F49" />
        <path
          d="M14 30V14L30 30V14"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function BrandTrack({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="ea-trust-track" aria-hidden={duplicate || undefined}>
      {TRUSTED_BRANDS.map((brand) => (
        <Link
          key={`${duplicate ? 'dup-' : ''}${brand.id}`}
          to={brand.to}
          tabIndex={duplicate ? -1 : undefined}
          className="ea-trust-logo-card"
        >
          <span className="ea-trust-logo-mark">{brand.renderMark()}</span>
          <span className="ea-trust-logo-text">
            <strong>{brand.name}</strong>
            <small>{brand.subtitle}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}

export default function TrustedLogosMarquee() {
  return (
    <section className="ea-trust-band" aria-label="Trusted by organizations and teams">
      <div className="container ea-trust-band-header">
        <div>
          <span className="eyebrow">Trusted By</span>
          <p className="ea-trust-band-sub">
            Companies, startups &amp; global teams across Canada, USA, UK, and Australia
          </p>
        </div>
        <Link to="/reviews" className="ea-trust-reviews-pill">
          <span>★★★★★ 5.0 · 14 Verified Reviews</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="ea-trust-marquee">
        <div className="ea-trust-marquee-inner">
          <BrandTrack />
          <BrandTrack duplicate />
        </div>
      </div>
    </section>
  );
}
