import { RevealText } from './RevealText';

export interface CopySectionData {
  title: string;
  body: string[];
}

export function CinematicSection({
  section,
  src,
  alt,
}: {
  section: CopySectionData;
  src: string;
  alt: string;
}) {
  return (
    <section className="ea-cinematic-story">
      <div className="ea-cinematic-stage">
        <img
          className="ea-cinematic-background"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
        <div className="container">
          <div className="ea-cinematic-copy">
            <span className="eyebrow">Engineering Method</span>
            <h2>
              <RevealText text={section.title} />
            </h2>
            <p>{section.body[0]}</p>
          </div>
        </div>
      </div>
      {section.body.length > 1 && (
        <div className="container ea-cinematic-details">
          {section.body.slice(1).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </section>
  );
}
