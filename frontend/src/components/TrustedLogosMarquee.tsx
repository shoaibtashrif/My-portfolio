import { Link } from 'react-router-dom';

interface BrandLogo {
  id: string;
  name: string;
  src: string;
  to: string;
  tall?: boolean;
}

const TRUSTED_BRANDS: BrandLogo[] = [
  {
    id: 'wosler',
    name: 'Wosler Diagnostics',
    src: '/images/logos/wosler.png',
    to: '/projects/hilum-healthcare-ai',
  },
  {
    id: 'h2o',
    name: 'H2O Water Company',
    src: '/images/logos/h2o-water.png',
    to: '/projects/h2o-water-company',
    tall: true,
  },
  {
    id: 'executive-ally',
    name: 'Executive Ally',
    src: '/images/logos/executive-ally.png',
    to: '/projects/executive-ally-platform',
  },
  {
    id: 'baboo-travel',
    name: 'Baboo Travel',
    src: '/images/logos/baboo-travel.svg',
    to: '/projects/baboo-travel-ai',
  },
  {
    id: 'valyrian',
    name: 'Valyrian Systems',
    src: '/images/logos/valyrian.svg',
    to: '/projects/valyrian-systems',
  },
];

// Repeat twice inside each half so ultra-wide screens stay seamlessly filled
const TRACK_ITEMS = [...TRUSTED_BRANDS, ...TRUSTED_BRANDS];

function BrandTrack({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="ea-trust-track" aria-hidden={duplicate || undefined}>
      {TRACK_ITEMS.map((brand, idx) => (
        <Link
          key={`${duplicate ? 'dup' : 'main'}-${brand.id}-${idx}`}
          to={brand.to}
          tabIndex={duplicate ? -1 : undefined}
          className="ea-trust-logo-link"
          aria-label={brand.name}
          title={brand.name}
        >
          <img
            src={brand.src}
            alt={brand.name}
            className={`ea-trust-logo-img${brand.tall ? ' is-tall' : ''}`}
            loading="eager"
            decoding="async"
          />
        </Link>
      ))}
    </div>
  );
}

export default function TrustedLogosMarquee() {
  return (
    <section className="ea-trust-band" aria-label="Trusted by">
      <div className="container">
        <h2 className="ea-trust-heading">Trusted by</h2>
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
