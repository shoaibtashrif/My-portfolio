import { ArrowUpRight } from 'lucide-react';

export function HeroScene({
  variant,
  src,
  alt,
  label,
  note,
}: {
  variant: 'individuals' | 'organizations' | 'about';
  src: string;
  alt: string;
  label: string;
  note: string;
}) {
  return (
    <figure className={`ea-hero-scene ea-scene-${variant}`}>
      <span className="ea-scene-plane" aria-hidden="true" />
      <div className="ea-scene-window">
        <img src={src} alt={alt} width="1536" height="1024" fetchPriority="high" />
      </div>
      <figcaption className="ea-scene-caption">
        <span className="ea-scene-index">{note}</span>
        <strong>{label}</strong>
        <ArrowUpRight aria-hidden="true" size={25} />
      </figcaption>
    </figure>
  );
}
