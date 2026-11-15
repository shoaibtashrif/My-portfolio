import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ExternalLink, Eye, FileCheck2, Star, X, ZoomIn } from 'lucide-react';
import { RevealText } from './RevealText';

export interface ProofScreenshot {
  id: string;
  title: string;
  subtitle: string;
  category: 'letter' | 'linkedin' | 'upwork_contract' | 'upwork_card';
  badge: string;
  src: string;
}

export const ALL_PROOF_SCREENSHOTS: ProofScreenshot[] = [
  {
    id: 'wosler-ref-leah',
    title: 'Wosler Diagnostics — Official Reference Letter',
    subtitle: 'Signed by Leah Groves · Authorized Signatory, Wosler Corp (Sep 28, 2026)',
    category: 'letter',
    badge: 'Official Reference Letter',
    src: '/images/reviews/wosler-reference-letter-leah-groves.jpg',
  },
  {
    id: 'wosler-exp-marco',
    title: 'Wosler Diagnostics — Official Experience Letter',
    subtitle: 'Signed by Marco Gallone · Authorized Signatory, Wosler Corp (Sep 28, 2026)',
    category: 'letter',
    badge: 'Official Experience Letter',
    src: '/images/reviews/wosler-experience-letter-marco-gallone.jpg',
  },
  {
    id: 'linkedin-scott',
    title: 'Scott Miles, CMF — Executive Ally (Miles LeHane)',
    subtitle: 'LinkedIn Recommendation · Full-Stack Platform, Payments, E-Signatures & Admin',
    category: 'linkedin',
    badge: 'LinkedIn Verified',
    src: '/images/reviews/linkedin-scott-miles.jpg',
  },
  {
    id: 'linkedin-richard',
    title: 'Richard Denton — Head of Talent Acquisition @ Rhino',
    subtitle: 'LinkedIn Recommendation · AI & Product Engineering Partner',
    category: 'linkedin',
    badge: 'LinkedIn Verified',
    src: '/images/reviews/linkedin-richard-denton.jpg',
  },
  {
    id: 'upwork-voice-local',
    title: 'AI Voice Agent / Chatbot Developer for Local Businesses',
    subtitle: 'Upwork 5.0 ★ · Long-term multi-project partnership',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★',
    src: '/images/reviews/upwork-voice-agent-local-biz.jpg',
  },
  {
    id: 'upwork-elevenlabs',
    title: 'AI Voice UX + ElevenLabs Workflow – Helpdesk Intake System',
    subtitle: 'Upwork 5.0 ★ · Clear Communicator · Detail Oriented · Accountable',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★',
    src: '/images/reviews/upwork-voice-ux-elevenlabs.jpg',
  },
  {
    id: 'upwork-custom-llm',
    title: 'AI Developer for Custom LLM Deployment & API Integration',
    subtitle: 'Upwork 5.0 ★ · Committed to Quality · Solution Oriented',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★',
    src: '/images/reviews/upwork-custom-llm-deployment.jpg',
  },
  {
    id: 'upwork-chatbot-refine',
    title: 'AI Chatbot Enhancement & LLM Response Accuracy',
    subtitle: 'Upwork 5.0 ★ · Committed to Quality · Clear Communicator',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★',
    src: '/images/reviews/upwork-chatbot-refinement.jpg',
  },
  {
    id: 'upwork-chatbot-contract',
    title: 'Chatbot Development AI — Fixed-Price Contract',
    subtitle: 'Upwork 5.0 ★ · "Fantastic help, highly responsive and qualified."',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★',
    src: '/images/reviews/upwork-chatbot-dev-contract.jpg',
  },
  {
    id: 'upwork-card-crm',
    title: 'AI Chatbot + CRM Integration & Flow Optimization',
    subtitle: 'Upwork 5.0 ★ Verified Completion Card',
    category: 'upwork_card',
    badge: 'Upwork Share Card',
    src: '/images/reviews/upwork-card-crm-chatbot.jpg',
  },
  {
    id: 'upwork-card-voice',
    title: 'AI Voice UX + ElevenLabs Helpdesk Intake',
    subtitle: 'Upwork 5.0 ★ Verified Completion Card',
    category: 'upwork_card',
    badge: 'Upwork Share Card',
    src: '/images/reviews/upwork-card-voice-ux.jpg',
  },
  {
    id: 'upwork-card-llm',
    title: 'NLP & LLM Chatbot Accuracy Refinement',
    subtitle: 'Upwork 5.0 ★ Verified Completion Card',
    category: 'upwork_card',
    badge: 'Upwork Share Card',
    src: '/images/reviews/upwork-card-llm-accuracy.jpg',
  },
  {
    id: 'upwork-card-chatdev',
    title: 'Chatbot Development AI',
    subtitle: 'Upwork 5.0 ★ Verified Completion Card',
    category: 'upwork_card',
    badge: 'Upwork Share Card',
    src: '/images/reviews/upwork-card-chatbot-dev.jpg',
  },
];

const UPWORK_REVIEWS = [
  {
    title: 'AI Voice Agent / Chatbot Developer for Local Businesses',
    period: 'Jan 2026 – Present',
    quote:
      'Shoaib has been amazing to work with! His work is top-notch and he is incredibly responsive! So much so that we have invited him to join us on other projects! We look forward to continuing a long, prosperous working relationship with Shoaib!',
    tags: ['Long-Term Retainer', 'Voice AI', 'Multi-Project Invite'],
    screenshotSrc: '/images/reviews/upwork-voice-agent-local-biz.jpg',
  },
  {
    title: 'AI Voice UX + ElevenLabs Workflow – Helpdesk Intake System',
    period: 'Apr 2026 – May 2026',
    quote: 'Outstanding work! Thank you for your support!',
    tags: ['Clear Communicator', 'Detail Oriented', 'Accountable'],
    screenshotSrc: '/images/reviews/upwork-voice-ux-elevenlabs.jpg',
  },
  {
    title: 'AI Developer for Custom LLM Deployment Expert',
    period: 'Mar 2025',
    quote:
      'Shoaib was active and showcased deep expertise in deploying LLM and API integration. He quickly identified the best approach and provided valuable suggestions to enhance LLM response.',
    tags: ['Committed to Quality', 'Solution Oriented'],
    screenshotSrc: '/images/reviews/upwork-custom-llm-deployment.jpg',
  },
  {
    title: 'AI Chatbot Enhancement & Response Accuracy',
    period: 'Feb 2025',
    quote:
      'Shoaib did an excellent job refining our AI chatbot responses and pouring more accuracy. His expertise in NLP and LLM is impressive, and he delivered what I wanted with clear communication and a helping nature. I recommend him for AI chatbots.',
    tags: ['Committed to Quality', 'Clear Communicator'],
    screenshotSrc: '/images/reviews/upwork-chatbot-refinement.jpg',
  },
  {
    title: 'AI Chatbot + CRM Integration & Flow Optimization',
    period: 'Verified Upwork Client',
    quote:
      'Shoaib worked great, he was always attentive, easily learned new tools and integrated an AI chatbot to our CRM, and improved the flow.',
    tags: ['CRM Integration', 'Workflow Automation'],
    screenshotSrc: '/images/reviews/upwork-card-crm-chatbot.jpg',
  },
  {
    title: 'Chatbot Development AI',
    period: 'Nov 2026',
    quote:
      'Very well qualified and responsive. Fantastic help, highly responsive and qualified.',
    tags: ['AI Chatbot Deliverables', '5.0 ★ Fixed Price'],
    screenshotSrc: '/images/reviews/upwork-chatbot-dev-contract.jpg',
  },
];

export default function ClientReviewsSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'letter' | 'linkedin' | 'upwork_contract' | 'upwork_card'>('all');
  const [lightbox, setLightbox] = useState<{ src: string; title: string; subtitle?: string } | null>(null);

  const filteredScreenshots =
    activeFilter === 'all'
      ? ALL_PROOF_SCREENSHOTS
      : ALL_PROOF_SCREENSHOTS.filter((item) => item.category === activeFilter);

  return (
    <section className="section-space ea-approved-section" id="client-reviews" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
      <div className="container">
        {/* SECTION HEADER */}
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
            <span className="eyebrow">Verified Client Endorsements &amp; Letters</span>
            <h2 style={{ marginTop: 8 }}>
              <RevealText text="Trusted by founders, executives, and engineering teams." />
            </h2>
            <p style={{ color: '#475569', maxWidth: 680, marginTop: 8, marginBottom: 0 }}>
              Every recommendation and 5.0★ contract review below is backed by the original signed reference letter, LinkedIn endorsement, or Upwork verification screenshot.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: '#0a1930',
                color: '#ffffff',
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              <Star size={14} fill="#facc15" color="#facc15" /> 5.0 ★ Upwork Rating (100% JSS)
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                background: '#e0f2fe',
                color: '#0369a1',
                fontSize: 12.5,
                fontWeight: 700,
                border: '1px solid #bae6fd',
              }}
            >
              <CheckCircle2 size={14} /> 13 Verified Proof Documents
            </span>
          </div>
        </div>

        {/* PART 1: FEATURED EXECUTIVE ENDORSEMENTS & OFFICIAL LETTERS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 22,
            marginBottom: 32,
          }}
        >
          {/* CARD 1: SCOTT MILES (EXECUTIVE ALLY) */}
          <article
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px rgba(10, 25, 48, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src="/images/reviews/avatar-scott-miles.jpg"
                    alt="Scott Miles, CMF"
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0a1930' }}>Scott Miles, CMF</div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.35 }}>
                      Founder, Executive Ally – Miles LeHane (USA)
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    whiteSpace: 'nowrap',
                  }}
                >
                  LinkedIn Verified
                </span>
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#1e293b', margin: '0 0 12px' }}>
                &ldquo;I hired Shoaib to build the website and client platform for Executive Ally – Miles LeHane, and he delivered far more than a website. He built the full system behind it, which includes payments, e-signatures, booking, automated email, and an admin panel I can run the business from, and he handled our migration and launch without missing a beat.&rdquo;
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#1e293b', margin: 0 }}>
                &ldquo;He&apos;s skilled, but what sets him apart is how he works: responsive, thorough, and honest about what needs to happen next. If you need a developer you can trust with something that matters, Shoaib is that person.&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    src: '/images/reviews/linkedin-scott-miles.jpg',
                    title: 'Scott Miles, CMF — LinkedIn Recommendation',
                    subtitle: 'Executive Ally – Miles LeHane',
                  })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid #bae6fd',
                  background: '#f0f9ff',
                  color: '#0284c7',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Eye size={14} /> View Verified Screenshot
              </button>
              <Link
                to="/projects/executive-ally-platform"
                style={{ fontSize: 12.5, fontWeight: 700, color: '#0a1930', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                Case Study <ExternalLink size={13} />
              </Link>
            </div>
          </article>

          {/* CARD 2: WOSLER DIAGNOSTICS (LEAH GROVES & MARCO GALLONE) */}
          <article
            style={{
              background: '#0a1930',
              color: '#ffffff',
              borderRadius: 16,
              padding: 24,
              border: '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: '0 14px 34px rgba(10, 25, 48, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 12,
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <Award size={26} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#ffffff' }}>Wosler Diagnostics (Canada)</div>
                    <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.35 }}>
                      Leah Groves &amp; Marco Gallone · Authorized Signatories
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(56, 189, 248, 0.16)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  2 Official Letters
                </span>
              </div>

              <p style={{ fontSize: 14, lineHeight: 1.65, color: '#e2e8f0', margin: '0 0 12px' }}>
                &ldquo;Shoaib made significant contributions to our healthcare AI systems, particularly our conversational AI and voice calling solutions. His work included AI workflows, appointment automation, backend integrations, and improving the reliability and scalability of systems running in production.&rdquo;
              </p>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#cbd5e1', margin: 0 }}>
                &ldquo;He played an important role in designing and building an AI chatbot from the ground up... By the end of his time with us (Oct 2024 – Sep 2026), he had grown into a dependable and capable team member who I could trust with increasingly complex responsibilities.&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: '/images/reviews/wosler-reference-letter-leah-groves.jpg',
                      title: 'Wosler Diagnostics — Official Reference Letter (Leah Groves)',
                      subtitle: 'Signed Sep 28, 2026 · Wosler Corp, Canada',
                    })
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '7px 11px',
                    borderRadius: 8,
                    border: '1px solid #38bdf8',
                    background: '#0284c7',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <FileCheck2 size={14} /> Reference Letter
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: '/images/reviews/wosler-experience-letter-marco-gallone.jpg',
                      title: 'Wosler Diagnostics — Official Experience Letter (Marco Gallone)',
                      subtitle: 'Signed Sep 28, 2026 · Wosler Corp, Canada',
                    })
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '7px 11px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#f8fafc',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <FileCheck2 size={14} /> Experience Letter
                </button>
              </div>
              <Link
                to="/projects/hilum-healthcare-ai"
                style={{ fontSize: 12.5, fontWeight: 700, color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                Wosler Case Study <ExternalLink size={13} />
              </Link>
            </div>
          </article>

          {/* CARD 3: RICHARD DENTON (RHINO) */}
          <article
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: 24,
              border: '1px solid #cbd5e1',
              boxShadow: '0 10px 30px rgba(10, 25, 48, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src="/images/reviews/avatar-richard-denton.jpg"
                    alt="Richard Denton"
                    style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0a1930' }}>Richard Denton</div>
                    <div style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.35 }}>
                      Head of Talent Acquisition @ Rhino
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    whiteSpace: 'nowrap',
                  }}
                >
                  LinkedIn Verified
                </span>
              </div>

              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#1e293b', margin: 0 }}>
                &ldquo;Shoaib was a wonderful partner. He cared deeply about the details of the project I needed, and was a great communicator. When we worked together he was very invested in the business goals of our project, and iterated quickly as we prioritized new features on our roadmap.&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 20, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    src: '/images/reviews/linkedin-richard-denton.jpg',
                    title: 'Richard Denton — LinkedIn Recommendation',
                    subtitle: 'Head of Talent Acquisition @ Rhino',
                  })
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid #bae6fd',
                  background: '#f0f9ff',
                  color: '#0284c7',
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Eye size={14} /> View Verified Screenshot
              </button>
              <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Jan 2025 · Direct Client</span>
            </div>
          </article>
        </div>

        {/* PART 2: UPWORK 5.0★ VERIFIED CONTRACT REVIEWS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 18,
            marginBottom: 42,
          }}
        >
          {UPWORK_REVIEWS.map((rev) => (
            <article
              key={rev.title}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                padding: 20,
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(10, 25, 48, 0.04)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#14a800" color="#14a800" />
                    ))}
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#0a1930', marginLeft: 4 }}>5.0</span>
                  </div>
                  <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>{rev.period}</span>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0a1930', margin: '0 0 8px', lineHeight: 1.35 }}>
                  {rev.title}
                </h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#334155', margin: '0 0 14px' }}>
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {rev.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 999,
                        background: '#f1f5f9',
                        color: '#334155',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: rev.screenshotSrc,
                      title: rev.title,
                      subtitle: `Upwork Verified 5.0 ★ Review (${rev.period})`,
                    })
                  }
                  style={{
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0a1930',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ZoomIn size={13} /> View Original Upwork Screenshot
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* PART 3: ORIGINAL SCREENSHOTS & OFFICIAL LETTERS ARCHIVE STRIP */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 18,
            padding: '24px',
            border: '1px solid #cbd5e1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0a1930' }}>
                Original Verification Screenshots &amp; Signed Letters
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                Click any screenshot or official letter below to inspect the full-resolution document.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All Proof (${ALL_PROOF_SCREENSHOTS.length})` },
                { id: 'letter', label: 'Official Letters (2)' },
                { id: 'linkedin', label: 'LinkedIn (2)' },
                { id: 'upwork_contract', label: 'Upwork Contracts (5)' },
                { id: 'upwork_card', label: 'Upwork Cards (4)' },
              ].map((tab) => {
                const active = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id as any)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      border: active ? '1px solid #0a1930' : '1px solid #cbd5e1',
                      background: active ? '#0a1930' : '#f8fafc',
                      color: active ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {filteredScreenshots.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setLightbox({
                    src: item.src,
                    title: item.title,
                    subtitle: item.subtitle,
                  })
                }
                style={{
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
              >
                <div
                  style={{
                    height: 150,
                    background: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'top center',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 10.5,
                      fontWeight: 700,
                      background: 'rgba(10, 25, 48, 0.85)',
                      color: '#38bdf8',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0a1930', lineHeight: 1.35, marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.35 }}>
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR ORIGINAL SCREENSHOTS & LETTERS */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 25, 48, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 880,
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                background: '#f8fafc',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0a1930' }}>{lightbox.title}</div>
                {lightbox.subtitle && (
                  <div style={{ fontSize: 12.5, color: '#64748b' }}>{lightbox.subtitle}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close preview"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  width: 34,
                  height: 34,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0a1930',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div
              style={{
                padding: 20,
                overflowY: 'auto',
                background: '#0f172a',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <img
                src={lightbox.src}
                alt={lightbox.title}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
