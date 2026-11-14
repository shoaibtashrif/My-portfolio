import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface CalendlyModalProps {
  url: string | null;
  onClose: () => void;
}

export default function CalendlyModal({ url, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (!url) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [url, onClose]);

  if (!url) return null;

  const separator = url.includes('?') ? '&' : '?';
  const embedDomain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const embedSrc = `${url}${separator}embed_domain=${encodeURIComponent(embedDomain)}&embed_type=Inline&hide_gdpr_banner=1`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a 30-minute discovery call"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(10, 25, 48, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          width: '100%',
          maxWidth: 920,
          height: 'min(86vh, 720px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(10, 25, 48, 0.35)',
          border: '1px solid rgba(10, 25, 48, 0.12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0a1930' }}>
              Book a 30-Min Discovery Call
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>
              Shoaib Tashrif · Full Stack AI Software Engineer
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              data-calendly-external="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                color: '#0284c7',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #bae6fd',
                backgroundColor: '#f0f9ff',
              }}
            >
              Open tab <ExternalLink size={13} />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close booking window"
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                width: 34,
                height: 34,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <iframe
          src={embedSrc}
          title="Calendly Scheduling"
          style={{
            flex: 1,
            width: '100%',
            border: 'none',
            backgroundColor: '#ffffff',
          }}
          allow="payment"
        />
      </div>
    </div>
  );
}
