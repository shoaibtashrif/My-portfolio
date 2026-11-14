/** Supporting editorial imagery, integrated into the existing section/motion system. */
export function StoryPhoto({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`ea-moment-photo ea-integrated-photo ${className}`}>
      <div className="ea-moment-window">
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
      {caption && (
        <figcaption style={{ fontSize: "0.78rem", color: "#536174", marginTop: "8px" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
