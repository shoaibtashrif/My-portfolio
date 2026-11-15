import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Star,
  X,
  ZoomIn,
} from 'lucide-react';
import { RevealText } from '../components/RevealText';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';

interface DetailedProofItem {
  id: string;
  category: 'letter' | 'linkedin' | 'upwork_contract' | 'upwork_card';
  badge: string;
  title: string;
  client: string;
  roleOrContract: string;
  date: string;
  src: string;
  quote: string;
  explanation: string;
  deliverables: string[];
  projectSlug?: string;
  projectLabel?: string;
}

const DETAILED_PROOF_ITEMS: DetailedProofItem[] = [
  {
    id: 'wosler-ref-leah',
    category: 'letter',
    badge: 'Official Reference Letter · Canada',
    title: 'Wosler Diagnostics — Official Reference Letter',
    client: 'Leah Groves',
    roleOrContract: 'Authorized Signatory · Wosler Corp (leah.groves@wosler.ca)',
    date: 'September 28, 2026 (Tenure: Oct 2024 – Sep 2026)',
    src: '/images/reviews/wosler-reference-letter-leah-groves.jpg',
    quote:
      'Shoaib made significant contributions to our healthcare AI systems, particularly our conversational AI and voice calling solutions. His work included AI workflows, appointment automation, backend integrations, and improving the reliability and scalability of systems running in production. He played an important role in designing and building an AI chatbot from the ground up.',
    explanation:
      'Issued by Wosler Corp (Canada) after two full years of engineering across the Hilum healthcare ecosystem (Hilum Admin 24/7 AI voice reception, Hilum Kiosk, and SonoSystem DICOM diagnostic AI). Highlights Shoaib’s ownership from AI development to backend architecture and production reliability.',
    deliverables: [
      '24/7 Conversational Voice AI & Patient Appointment Automation',
      'End-to-End Healthcare AI Chatbot Designed from the Ground Up',
      'FastAPI Backend Architecture, EMR/RIS Integrations & Cloud Deployment',
    ],
    projectSlug: 'hilum-healthcare-ai',
    projectLabel: 'View Hilum / Wosler Case Study',
  },
  {
    id: 'wosler-exp-marco',
    category: 'letter',
    badge: 'Official Experience Letter · Canada',
    title: 'Wosler Diagnostics — Official Experience Certificate',
    client: 'Marco Gallone',
    roleOrContract: 'Authorized Signatory · Wosler Corp (marco@wosler.ca)',
    date: 'September 28, 2026 (Tenure: Oct 2024 – Sep 2026)',
    src: '/images/reviews/wosler-experience-letter-marco-gallone.jpg',
    quote:
      'This letter confirms that Shoaib Tashrif worked with Wosler Corp as an AI Software Engineer from October 2024 to September 2026. During this period, Shoaib contributed to Wosler’s AI and healthcare technology projects. His work included AI development, conversational AI and voice-calling workflows, appointment automation, backend systems and integrations, production deployment, and improving system reliability and scalability.',
    explanation:
      'Official corporate employment and engineering verification from Wosler Diagnostics confirming full-stack AI software engineering responsibilities across production medical and voice systems in Canada.',
    deliverables: [
      'AI Software Engineer (Oct 2024 – Sep 2026)',
      'Voice-Calling Workflows & Medical Appointment Automation',
      'System Design, Resource Management & Production Engineering',
    ],
    projectSlug: 'hilum-healthcare-ai',
    projectLabel: 'View Hilum / Wosler Case Study',
  },
  {
    id: 'vsi-exp-asim',
    category: 'letter',
    badge: 'Official Experience Letter · VSI',
    title: 'Valyrian Systems Incorporation (VSI) — Experience Certificate',
    client: 'Ch. Muhammad Asim',
    roleOrContract: 'Manager (HR) · Valyrian Systems Incorporation (Ref: VSI-I/HR/G-180)',
    date: 'March 13, 2025 (Tenure: Dec 01, 2021 – Jan 31, 2025)',
    src: '/images/reviews/vsi-experience-letter.jpg',
    quote:
      'This is to certify that Shoaib Tashrif has served as a Jr. Member Technical Staff in this organization from December 01, 2021 through January 31, 2025. During this period, he assisted with the Frontend Development, Protocol Decoding and DevOps Team for Valyrian’s proprietary Network Management System.',
    explanation:
      'Over 3 years of core systems and cybersecurity engineering at Valyrian Systems Incorporation, contributing to their carrier-grade Deep Packet Inspection (DPI), protocol decoding, Web Management System frontend, and DevOps infrastructure.',
    deliverables: [
      'Proprietary Network Management System (NMS) Frontend Engineering',
      'Deep Packet Inspection (DPI) & Network Protocol Decoding',
      'DevOps Automation & High-Throughput Telemetry Dashboards',
    ],
    projectSlug: 'valyrian-systems',
    projectLabel: 'View Valyrian Systems (VSI) Case Study',
  },
  {
    id: 'linkedin-scott',
    category: 'linkedin',
    badge: 'LinkedIn Verified · USA',
    title: 'Scott Miles, CMF — Executive Ally (Miles LeHane)',
    client: 'Scott Miles, CMF',
    roleOrContract: 'Executive Career Transition Coach & Outplacement · Founder of Executive Ally',
    date: 'November 7, 2026 · Direct Client on LinkedIn',
    src: '/images/reviews/linkedin-scott-miles.jpg',
    quote:
      'I hired Shoaib to build the website and client platform for Executive Ally – Miles LeHane, and he delivered far more than a website. He built the full system behind it, which includes payments, e-signatures, booking, automated email, and an admin panel I can run the business from, and he handled our migration and launch without missing a beat. If you need a developer you can trust with something that matters, Shoaib is that person.',
    explanation:
      'Full-stack production platform built for a US executive coaching firm founded in 1978: custom React/TypeScript frontend, Node/Express/PostgreSQL backend, Stripe checkout, Documenso e-signatures, Google Calendar 2-way sync, Resend lifecycle email engine, GA4 analytics, and a complete Executive Admin Portal.',
    deliverables: [
      'Private Client Onboarding Portal with E-Signatures & Stripe Payments',
      '2-Way Google Calendar Availability Studio & Microsoft Teams Booking',
      'Custom Executive Admin Dashboard, Insights CMS & Automated Lifecycle Emails',
    ],
    projectSlug: 'executive-ally-platform',
    projectLabel: 'View Executive Ally Case Study',
  },
  {
    id: 'linkedin-richard',
    category: 'linkedin',
    badge: 'LinkedIn Verified · USA',
    title: 'Richard Denton — Head of Talent Acquisition @ Rhino',
    client: 'Richard Denton',
    roleOrContract: 'Head of Talent Acquisition @ Rhino',
    date: 'January 18, 2025 · Direct Client on LinkedIn',
    src: '/images/reviews/linkedin-richard-denton.jpg',
    quote:
      'Shoaib was a wonderful partner. He cared deeply about the details of the project I needed, and was a great communicator. When we worked together he was very invested in the business goals of our project, and iterated quickly as we prioritized new features on our roadmap.',
    explanation:
      'Public LinkedIn recommendation highlighting product ownership, rapid iteration on roadmap features, business-goal alignment, and proactive engineering communication.',
    deliverables: [
      'Rapid Roadmap Iteration & Feature Delivery',
      'Business-Goal Aligned AI & Software Architecture',
      'Direct Executive Communication & End-to-End Ownership',
    ],
  },
  {
    id: 'upwork-voice-local',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★ · Retainer',
    title: 'AI Voice Agent / Chatbot Developer for Local Businesses',
    client: 'Verified Upwork Agency Partner',
    roleOrContract: '5.0 ★ Active Contract (Jan 12, 2026 – Present)',
    date: 'February 18, 2026',
    src: '/images/reviews/upwork-voice-agent-local-biz.jpg',
    quote:
      'Shoaib has been amazing to work with! His work is top-notch and he is incredibly responsive! So much so that we have invited him to join us on other projects! We look forward to continuing a long, prosperous working relationship with Shoaib!',
    explanation:
      'Built production inbound/outbound AI voice agents and omnichannel chatbots for local service businesses, resulting in an immediate expansion into multiple ongoing client projects.',
    deliverables: [
      'Low-Latency AI Phone & Web Voice Agents',
      'Multi-Tenant Local Business Booking & Lead Capture',
      'Expanded into Multi-Project Long-Term Partnership',
    ],
    projectSlug: 'nextstep-multi-agent',
    projectLabel: 'View Multi-Agent Platform Case Study',
  },
  {
    id: 'upwork-elevenlabs',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★ · Voice AI',
    title: 'AI Voice UX + ElevenLabs Workflow – Helpdesk Intake System',
    client: 'Verified Upwork Enterprise Client',
    roleOrContract: '5.0 ★ Contract · Endorsed: Clear Communicator, Detail Oriented, Accountable',
    date: 'April 7, 2026 – May 15, 2026',
    src: '/images/reviews/upwork-voice-ux-elevenlabs.jpg',
    quote: 'Outstanding work! Thank you for your support!',
    explanation:
      'Engineered a real-time ElevenLabs conversational voice UX and automated helpdesk intake workflow that triages incoming support calls, extracts structured ticket data, and syncs directly with the helpdesk backend.',
    deliverables: [
      'ElevenLabs Streaming Voice UX & Custom Prosody Tuning',
      'Automated Helpdesk Ticket Intake & Triage Pipeline',
      'Endorsed for Clear Communication, Detail Orientation & Accountability',
    ],
  },
  {
    id: 'upwork-custom-llm',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★ · LLM Deployment',
    title: 'AI Developer for Custom LLM Deployment & API Integration',
    client: 'Verified Upwork Client',
    roleOrContract: '5.0 ★ Contract · Endorsed: Committed to Quality, Solution Oriented',
    date: 'March 9, 2025 – March 10, 2025',
    src: '/images/reviews/upwork-custom-llm-deployment.jpg',
    quote:
      'Shoaib was active and showcased deep expertise in deploying LLM and API integration. He quickly identified the best approach and provided valuable suggestions to enhance LLM response.',
    explanation:
      'Urgent production LLM deployment and API integration where Shoaib diagnosed latency/accuracy bottlenecks, architected the optimal inference setup, and improved response quality.',
    deliverables: [
      'Custom LLM Production Deployment & API Gateway Integration',
      'Prompt & Context Window Optimization for Higher Response Accuracy',
      'Endorsed for Solution-Oriented Architecture & Quality',
    ],
  },
  {
    id: 'upwork-chatbot-refine',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★ · NLP & RAG',
    title: 'AI Chatbot Enhancement & LLM Response Accuracy Refinement',
    client: 'Verified Upwork Client',
    roleOrContract: '5.0 ★ Contract · Endorsed: Committed to Quality, Clear Communicator',
    date: 'February 12, 2025 – February 13, 2025',
    src: '/images/reviews/upwork-chatbot-refinement.jpg',
    quote:
      'Shoaib did an excellent job refining our AI chatbot responses and pouring more accuracy. His expertise in NLP and LLM is impressive, and he delivered what I wanted with clear communication and a helping nature. I recommend him for AI chatbots.',
    explanation:
      'Refined an existing production AI assistant by eliminating hallucinations, tightening retrieval grounding, and tuning NLP system instructions for domain-accurate answers.',
    deliverables: [
      'RAG Grounding & Hallucination Elimination',
      'NLP System Prompt & Conversation Flow Tuning',
      '5.0 ★ Client Endorsement for AI Chatbots',
    ],
  },
  {
    id: 'upwork-chatbot-contract',
    category: 'upwork_contract',
    badge: 'Upwork 5.0 ★ · Fixed Price',
    title: 'Chatbot Development AI — Full Deliverable Contract',
    client: 'Verified Upwork Client',
    roleOrContract: '5.0 ★ Fixed-Price Contract (Two 5.0 ★ Milestones)',
    date: 'November 9, 2026',
    src: '/images/reviews/upwork-chatbot-dev-contract.jpg',
    quote:
      'Very well qualified and responsive. — Fantastic help, highly responsive and qualified.',
    explanation:
      'Delivered complete AI chatbot milestones on a fixed-price contract, earning dual 5.0★ ratings across both contract milestones.',
    deliverables: [
      'Complete AI Chatbot Architecture & Frontend Widget',
      'Backend API & Knowledge Base Integration',
      'Dual 5.0 ★ Milestone Reviews',
    ],
  },
  {
    id: 'upwork-card-crm',
    category: 'upwork_card',
    badge: 'Upwork 5.0 ★ · CRM AI',
    title: 'AI Chatbot + CRM Integration & Flow Optimization',
    client: 'Verified Upwork Client',
    roleOrContract: 'Upwork Official 5.0 ★ Completion Share Card',
    date: 'Verified Upwork Contract',
    src: '/images/reviews/upwork-card-crm-chatbot.jpg',
    quote:
      'Shoaib worked great, he was always attentive, easily learned new tools and integrated an AI chatbot to our CRM, and improved the flow.',
    explanation:
      'Connected an intelligent conversational AI agent directly into the client’s CRM pipeline, automating lead qualification, contact syncing, and follow-up triggers.',
    deliverables: [
      '2-Way CRM Webhook & Lead Pipeline Integration',
      'Conversational Qualification Flow Redesign',
      'Rapid Adaptation to Client’s Custom Tool Stack',
    ],
    projectSlug: 'baboo-travel-ai',
    projectLabel: 'View CRM & Voice AI Case Study',
  },
  {
    id: 'upwork-card-voice',
    category: 'upwork_card',
    badge: 'Upwork 5.0 ★ · Share Card',
    title: 'AI Voice UX + ElevenLabs Workflow Completion Card',
    client: 'Verified Upwork Client',
    roleOrContract: 'Upwork Official 5.0 ★ Completion Share Card',
    date: 'May 2026',
    src: '/images/reviews/upwork-card-voice-ux.jpg',
    quote: 'Outstanding work! Thank you for your support!',
    explanation:
      'Official Upwork 5.0★ completion share card for the AI Voice UX + ElevenLabs Helpdesk Intake System contract.',
    deliverables: ['5.0 ★ Verified Completion', 'ElevenLabs Voice AI', 'Helpdesk Automation'],
  },
  {
    id: 'upwork-card-llm',
    category: 'upwork_card',
    badge: 'Upwork 5.0 ★ · Share Card',
    title: 'NLP & LLM Chatbot Accuracy Completion Card',
    client: 'Verified Upwork Client',
    roleOrContract: 'Upwork Official 5.0 ★ Completion Share Card',
    date: 'February 2025',
    src: '/images/reviews/upwork-card-llm-accuracy.jpg',
    quote:
      'Shoaib did an excellent job refining our AI chatbot responses and pouring more accuracy. His expertise in NLP and LLM is impressive, and he delivered what I wanted...',
    explanation:
      'Official Upwork 5.0★ completion share card for the NLP & LLM Chatbot Enhancement contract.',
    deliverables: ['5.0 ★ Verified Completion', 'NLP & LLM Accuracy', 'Production Chatbot'],
  },
  {
    id: 'upwork-card-chatdev',
    category: 'upwork_card',
    badge: 'Upwork 5.0 ★ · Share Card',
    title: 'Chatbot Development AI Completion Card',
    client: 'Verified Upwork Client',
    roleOrContract: 'Upwork Official 5.0 ★ Completion Share Card',
    date: 'November 2026',
    src: '/images/reviews/upwork-card-chatbot-dev.jpg',
    quote: 'Very well qualified and responsive.',
    explanation:
      'Official Upwork 5.0★ completion share card for the Chatbot Development AI contract.',
    deliverables: ['5.0 ★ Verified Completion', 'Chatbot Development AI', 'Fast Turnaround'],
  },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<'all' | 'letter' | 'linkedin' | 'upwork_contract' | 'upwork_card'>('all');
  const [lightbox, setLightbox] = useState<DetailedProofItem | null>(null);

  const items =
    filter === 'all'
      ? DETAILED_PROOF_ITEMS
      : DETAILED_PROOF_ITEMS.filter((item) => item.category === filter);

  return (
    <main className="ea-individuals ea-approved-organizations">
      <style>{`
        @keyframes reviewCardEntrance {
          0% { opacity: 0; transform: translateY(22px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatBadgePulse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .ea-review-showcase-card {
          animation: reviewCardEntrance 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ea-review-showcase-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 22px 48px rgba(10, 25, 48, 0.12) !important;
          border-color: #0284c7 !important;
        }
        .ea-review-img-wrap img {
          transition: transform 0.35s ease;
        }
        .ea-review-showcase-card:hover .ea-review-img-wrap img {
          transform: scale(1.03);
        }
      `}</style>

      {/* HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #071224 0%, #0a1930 60%, #0c2340 100%)',
          color: '#ffffff',
          padding: '72px 0 64px',
          borderBottom: '1px solid rgba(56, 189, 248, 0.22)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(56, 189, 248, 0.16)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  fontSize: 12.5,
                  fontWeight: 800,
                  animation: 'floatBadgePulse 3s infinite ease-in-out',
                }}
              >
                <ShieldCheck size={15} /> 100% VERIFIED CLIENT PROOF ARCHIVE
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(20, 168, 0, 0.2)',
                  border: '1px solid rgba(74, 222, 128, 0.4)',
                  color: '#4ade80',
                  fontSize: 12.5,
                  fontWeight: 800,
                }}
              >
                <Star size={14} fill="#4ade80" color="#4ade80" /> 5.0 ★ Upwork Rating · 100% Job Success
              </span>
            </div>

            <h1 style={{ color: '#ffffff', fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)', lineHeight: 1.1, margin: '0 0 18px' }}>
              <RevealText text="Trusted by founders, executives, and engineering leaders worldwide." />
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: 17, lineHeight: 1.65, margin: '0 0 28px' }}>
              Explore all 14 official company reference letters, signed experience certificates, LinkedIn executive endorsements, and 5.0★ Upwork contract reviews—each paired with its original verification screenshot and full engineering context.
            </p>

            {/* 4 Key Proof Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: 14,
              }}
            >
              {[
                { num: '3', label: 'Official Company Letters', sub: 'Wosler Corp (Canada) & VSI' },
                { num: '2', label: 'LinkedIn Endorsements', sub: 'Executive Ally & Rhino' },
                { num: '5.0 ★', label: 'Upwork Contract Rating', sub: '100% Job Success Score' },
                { num: '14', label: 'Verified Screenshots', sub: 'Click any proof to inspect' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 14,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                  }}
                >
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#38bdf8', lineHeight: 1.1 }}>{stat.num}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ffffff', marginTop: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FILTER BAR + DETAILED ANIMATED CARDS */}
      <section className="section-space" style={{ background: '#f8fafc' }}>
        <div className="container">
          {/* Interactive Category Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
              marginBottom: 32,
              padding: '16px 20px',
              background: '#ffffff',
              borderRadius: 16,
              border: '1px solid #cbd5e1',
              boxShadow: '0 6px 20px rgba(10, 25, 48, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: '#0a1930', fontSize: 15 }}>
              <Award size={19} color="#0284c7" />
              <span>Filter Verified Proof ({items.length} showing)</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { id: 'all', label: 'All Proof (14)' },
                { id: 'letter', label: 'Official Company Letters (3)' },
                { id: 'linkedin', label: 'LinkedIn Executive Reviews (2)' },
                { id: 'upwork_contract', label: 'Upwork 5.0★ Contracts (5)' },
                { id: 'upwork_card', label: 'Upwork Share Cards (4)' },
              ].map((t) => {
                const active = filter === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilter(t.id as any)}
                    style={{
                      padding: '8px 15px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: 700,
                      border: active ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      background: active ? '#0284c7' : '#f8fafc',
                      color: active ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Screenshot + Story Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {items.map((item, idx) => (
              <article
                key={item.id}
                className="ea-review-showcase-card"
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  background: '#ffffff',
                  borderRadius: 20,
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 10px 30px rgba(10, 25, 48, 0.06)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                }}
              >
                {/* Left / Top: Actual Screenshot Preview */}
                <div
                  className="ea-review-img-wrap"
                  onClick={() => setLightbox(item)}
                  style={{
                    background: '#0a1930',
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    minHeight: 300,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      zIndex: 2,
                      padding: '5px 12px',
                      borderRadius: 999,
                      background: 'rgba(7, 18, 36, 0.9)',
                      border: '1px solid rgba(56, 189, 248, 0.45)',
                      color: '#38bdf8',
                      fontSize: 11.5,
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>

                  <img
                    src={item.src}
                    alt={item.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 380,
                      width: 'auto',
                      height: 'auto',
                      borderRadius: 10,
                      objectFit: 'contain',
                      boxShadow: '0 14px 36px rgba(0, 0, 0, 0.45)',
                    }}
                  />

                  <span
                    style={{
                      marginTop: 14,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 12px',
                      borderRadius: 999,
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#e2e8f0',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <ZoomIn size={14} /> Click image to open full-resolution document
                  </span>
                </div>

                {/* Right / Bottom: Detailed Explanation, Quote & Deliverables */}
                <div
                  style={{
                    padding: '28px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {item.roleOrContract}
                      </span>
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.date}</span>
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0a1930', margin: '0 0 14px', lineHeight: 1.3 }}>
                      {item.title}
                    </h2>

                    {/* Highlighted Client Quote Box */}
                    <blockquote
                      style={{
                        margin: '0 0 16px',
                        padding: '14px 18px',
                        borderRadius: 12,
                        background: '#f0f9ff',
                        borderLeft: '4px solid #0284c7',
                        fontSize: 14.5,
                        lineHeight: 1.65,
                        color: '#0f172a',
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>

                    {/* Engineering Context Explanation */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                        Project Context &amp; Engineering Impact
                      </div>
                      <p style={{ fontSize: 14, lineHeight: 1.65, color: '#334155', margin: 0 }}>
                        {item.explanation}
                      </p>
                    </div>

                    {/* Key Verified Deliverables */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                      {item.deliverables.map((del) => (
                        <div key={del} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: '#1e293b', fontWeight: 600 }}>
                          <CheckCircle2 size={15} color="#0284c7" style={{ flexShrink: 0 }} />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={() => setLightbox(item)}
                      className="ea-button ea-button-navy"
                      style={{ padding: '9px 16px', fontSize: 13, cursor: 'pointer' }}
                    >
                      <FileCheck2 size={15} /> Inspect Original Proof
                    </button>

                    {item.projectSlug && (
                      <Link
                        to={`/projects/${item.projectSlug}`}
                        className="ea-button ea-button-blue"
                        style={{ padding: '9px 16px', fontSize: 13 }}
                      >
                        {item.projectLabel || 'View Related Case Study'} <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="ea-cta">
        <div className="container ea-cta-inner">
          <div>
            <h2>
              <RevealText text="Ready to build your next AI or full-stack system?" />
            </h2>
          </div>
          <div className="ea-cta-action">
            <p>
              Join founders and engineering leaders across Canada, the USA, the UK, and Australia who trust Shoaib with production-critical software.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                Book 30-Min Discovery Call <ArrowUpRight size={18} />
              </a>
              <Link to="/contact" className="ea-button ea-button-navy">
                <Sparkles size={17} /> Send Project Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(10, 25, 48, 0.88)',
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
              maxWidth: 920,
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
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
                <div style={{ fontWeight: 800, fontSize: 16, color: '#0a1930' }}>{lightbox.title}</div>
                <div style={{ fontSize: 12.5, color: '#64748b' }}>
                  {lightbox.client} · {lightbox.roleOrContract}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 8,
                  width: 36,
                  height: 36,
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
                style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
