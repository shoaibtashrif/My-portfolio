import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Layers,
  Maximize2,
  Mic,
  PhoneCall,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CinematicSection } from '../components/CinematicSection';
import { HeroScene } from '../components/EditorialScenes';
import { RevealText } from '../components/RevealText';
import { PORTFOLIO_PROFILE, PROJECTS } from '../data/portfolioData';

const COACH_CALL_SCRIPT = [
  {
    speaker: 'caller' as const,
    name: 'Caller (Live Video)',
    text: 'Hey Sergeant! I completed my 6 AM workout and shipped the backend API module before noon.',
    score: 91,
    streak: '14 Days',
  },
  {
    speaker: 'coach' as const,
    name: 'Sergeant AI Coach',
    text: 'Outstanding discipline, soldier! Morning workout locked in and API shipped on schedule. Your accountability score just hit 94%!',
    score: 94,
    streak: '15 Days',
  },
  {
    speaker: 'caller' as const,
    name: 'Caller (Live Video)',
    text: 'What is my top priority targetbefore our 8 PM accountability check-in call?',
    score: 94,
    streak: '15 Days',
  },
  {
    speaker: 'coach' as const,
    name: 'Sergeant AI Coach',
    text: 'Complete 90 minutes of deep focus on the DICOM pipeline with zero phone distractions. I will call you at 20:00 sharp to verify!',
    score: 98,
    streak: '15 Days · On Fire',
  },
];

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const project = PROJECTS.find((p) => p.slug === slug || p.id === slug);

  // Interactive states for animations & visual lightbox
  const [activePipelineIdx, setActivePipelineIdx] = useState(0);
  const [callTurnIdx, setCallTurnIdx] = useState(1);
  const [callAudioOn, setCallAudioOn] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; caption: string } | null>(
    null
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLightboxImg(null);
    setCallAudioOn(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [slug]);

  // Animate the 4-stage architecture pipeline pulse
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePipelineIdx((prev) => (prev + 1) % 4);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  // Animate the live video call dialogue turns for Sergeant AI Coach
  useEffect(() => {
    if (project?.slug !== 'sergeant-ai-coach') return;
    const timer = window.setInterval(() => {
      setCallTurnIdx((prev) => {
        const next = (prev + 1) % COACH_CALL_SCRIPT.length;
        if (callAudioOn && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(COACH_CALL_SCRIPT[next].text);
          u.rate = 1.06;
          u.pitch = COACH_CALL_SCRIPT[next].speaker === 'coach' ? 0.92 : 1.05;
          window.speechSynthesis.speak(u);
        }
        return next;
      });
    }, 4200);
    return () => window.clearInterval(timer);
  }, [project?.slug, callAudioOn]);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const otherProjects = PROJECTS.filter((p) => p.slug !== project.slug);
  const currentTurn = COACH_CALL_SCRIPT[callTurnIdx];

  return (
    <main className="ea-individuals ea-approved-organizations portfolio-project-detail">
      {/* Animation keyframes */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.85; }
          50% { transform: scale(1.08); opacity: 0.35; }
          100% { transform: scale(0.95); opacity: 0.85; }
        }
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.025); }
        }
        @keyframes mouthTalk {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1.15); }
        }
        @keyframes eqBar {
          0%, 100% { height: 6px; }
          50% { height: 26px; }
        }
      `}</style>

      {/* HERO SCENE — IDENTICAL TO SCOTT'S WORKING HERO */}
      <section className="ea-page-hero ea-scene-hero">
        <div className="container ea-page-hero-grid">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Link
                to="/projects"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 13px',
                  borderRadius: 999,
                  background: 'rgba(0, 127, 190, 0.14)',
                  border: '1px solid rgba(0, 127, 190, 0.35)',
                  color: '#007fbe',
                  fontWeight: 700,
                  fontSize: 12.5,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} /> All Projects
              </Link>
              <span className="eyebrow" style={{ margin: 0 }}>
                {project.clientLabel}
              </span>
            </div>

            <div className="ea-scene-rule" aria-hidden="true" />
            <h1>
              <RevealText text={project.shortTitle} />
            </h1>
            <p>{project.summary}</p>

            {/* 4 Key Metrics Visual Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: 10,
                marginTop: 20,
                marginBottom: 24,
              }}
            >
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#0a1930',
                    border: '1px solid rgba(56, 189, 248, 0.28)',
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8' }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2, fontWeight: 600 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ea-button ea-button-blue"
                >
                  Visit Live Website ({project.externalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')})
                  <ExternalLink size={17} />
                </a>
              )}
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-navy"
              >
                Book 30-Min Architecture Call
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

          <HeroScene
            variant="individuals"
            src={project.image}
            alt={project.title}
            label={project.role}
            note={project.status}
          />
        </div>
      </section>

      {/* INTERACTIVE ANIMATED SYSTEM PIPELINE (ON EVERY PROJECT PAGE) */}
      <section
        className="portfolio-system-band"
        style={{
          background: '#071224',
          padding: '52px 0',
          borderTop: '1px solid rgba(56, 189, 248, 0.2)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          color: '#ffffff',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 28,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Activity size={15} /> LIVE SYSTEM ARCHITECTURE FLOW
              </span>
              <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.55rem, 2.6vw, 2.2rem)', marginTop: 6 }}>
                How {project.shortTitle} Operates in Real Time
              </h2>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.stack.slice(0, 6).map((tech) => (
                <span
                  key={tech}
                  style={{
                    padding: '5px 11px',
                    borderRadius: 999,
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#e0f2fe',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {project.pipelineSteps.map((step, idx) => {
              const isActive = idx === activePipelineIdx;
              return (
                <div
                  key={step.step}
                  onClick={() => setActivePipelineIdx(idx)}
                  style={{
                    cursor: 'pointer',
                    padding: '22px 20px',
                    borderRadius: 16,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0, 127, 190, 0.38) 0%, rgba(15, 35, 66, 0.95) 100%)'
                      : 'rgba(13, 28, 52, 0.85)',
                    border: isActive
                      ? '2px solid #38bdf8'
                      : '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: isActive ? '0 14px 34px rgba(0, 127, 190, 0.35)' : 'none',
                    transform: isActive ? 'translateY(-4px)' : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: isActive ? '#38bdf8' : 'rgba(56, 189, 248, 0.15)',
                        color: isActive ? '#071224' : '#7dd3fc',
                        fontWeight: 800,
                        fontSize: 12,
                      }}
                    >
                      STEP {step.step}
                    </span>
                    <ArrowRight
                      size={16}
                      color={isActive ? '#38bdf8' : '#64748b'}
                      style={{
                        transform: isActive ? 'translateX(4px)' : 'none',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.5 }}>
                    {step.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPECIAL INTERACTIVE ANIME / CHARACTER AI VIDEO CALL STAGE (FOR SERGEANT AI COACH) */}
      {project.slug === 'sergeant-ai-coach' && (
        <section
          style={{
            background: 'linear-gradient(180deg, #061020 0%, #0b1d38 100%)',
            padding: '64px 0',
            color: '#ffffff',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '5px 13px',
                    borderRadius: 999,
                    background: 'rgba(34, 197, 94, 0.18)',
                    border: '1px solid rgba(34, 197, 94, 0.45)',
                    color: '#4ade80',
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  <Video size={15} /> ● LIVE ANIMATED AI CHARACTER VIDEO CALL SIMULATION
                </span>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', margin: 0 }}>
                  Live Video Call: Person Speaking with Animated Sergeant AI Coach
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = !callAudioOn;
                  setCallAudioOn(next);
                  if (!next && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  } else if (next && 'speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance(currentTurn.text);
                    u.rate = 1.05;
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="ea-button ea-button-blue"
                style={{ cursor: 'pointer' }}
              >
                {callAudioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                {callAudioOn ? 'Voice Audio: ON' : 'Unmute Live Call Voice'}
              </button>
            </div>

            {/* Interactive Split-Screen Video Call Stage */}
            <div
              style={{
                borderRadius: 24,
                background: '#050d1a',
                border: '2px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 28px 70px rgba(0, 0, 0, 0.55)',
                padding: 24,
              }}
            >
              {/* Top Call HUD Bar */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  paddingBottom: 16,
                  marginBottom: 20,
                  borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 12px #22c55e',
                    }}
                  />
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc' }}>
                    BETTER YOU · ACCOUNTABILITY VIDEO CALL (ENCRYPTED WEBRTC)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13 }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                    Streak: {currentTurn.streak}
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 999,
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      fontWeight: 800,
                    }}
                  >
                    Accountability Score: {currentTurn.score}%
                  </span>
                </div>
              </div>

              {/* Two Video Feeds Side-by-Side: Animated AI Coach Character + Person Caller */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                  gap: 22,
                  alignItems: 'stretch',
                }}
              >
                {/* LEFT FEED: ANIMATED SERGEANT AI CHARACTER */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 18,
                    background:
                      'radial-gradient(circle at 50% 38%, rgba(0, 127, 190, 0.42) 0%, #071428 72%)',
                    border:
                      currentTurn.speaker === 'coach'
                        ? '3px solid #38bdf8'
                        : '1px solid rgba(148, 163, 184, 0.25)',
                    boxShadow:
                      currentTurn.speaker === 'coach'
                        ? '0 0 36px rgba(56, 189, 248, 0.45)'
                        : 'none',
                    padding: '28px 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: 370,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      padding: '5px 12px',
                      borderRadius: 999,
                      background: 'rgba(7, 18, 36, 0.85)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#38bdf8',
                    }}
                  >
                    🤖 Animated Sergeant AI Coach
                  </div>

                  {currentTurn.speaker === 'coach' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        padding: '5px 11px',
                        borderRadius: 999,
                        background: '#007fbe',
                        color: '#ffffff',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      ● SPEAKING LIVE
                    </div>
                  )}

                  {/* Animated Character Avatar with Glowing Pulse Rings & Lip-Sync Indicator */}
                  <div
                    style={{
                      position: 'relative',
                      marginTop: 22,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {currentTurn.speaker === 'coach' && (
                      <div
                        style={{
                          position: 'absolute',
                          width: 220,
                          height: 220,
                          borderRadius: '50%',
                          border: '2px solid rgba(56, 189, 248, 0.6)',
                          animation: 'pulseRing 1.4s infinite ease-in-out',
                        }}
                      />
                    )}
                    <div
                      style={{
                        width: 190,
                        height: 190,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '4px solid #38bdf8',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
                        animation: 'avatarFloat 2.6s infinite ease-in-out',
                        position: 'relative',
                        background: '#0a1930',
                      }}
                    >
                      <img
                        src="/images/sergeant-avatar.png"
                        alt="Animated Sergeant AI Coach"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {/* Animated Mouth/Voice Wave Overlay when Coach speaks */}
                      {currentTurn.speaker === 'coach' && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 14,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '4px 12px',
                            borderRadius: 999,
                            background: 'rgba(7, 18, 36, 0.85)',
                            border: '1px solid #38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          {[0, 1, 2, 3, 4, 5].map((b) => (
                            <span
                              key={b}
                              style={{
                                width: 3,
                                height: 14,
                                background: '#38bdf8',
                                borderRadius: 2,
                                display: 'inline-block',
                                animation: `eqBar ${0.45 + b * 0.08}s infinite ease-in-out`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Equalizer + Caption */}
                  <div
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(10, 25, 48, 0.92)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', marginBottom: 4 }}>
                      SERGEANT AI LIVE AUDIO STREAM
                    </div>
                    <div style={{ fontSize: 13.5, color: '#f8fafc', lineHeight: 1.5 }}>
                      {currentTurn.speaker === 'coach'
                        ? `"${currentTurn.text}"`
                        : 'Listening to caller & analyzing daily goal completion...'}
                    </div>
                  </div>
                </div>

                {/* RIGHT FEED: CALLER ON LIVE VIDEO CALL */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 18,
                    background: '#071428',
                    border:
                      currentTurn.speaker === 'caller'
                        ? '3px solid #22c55e'
                        : '1px solid rgba(148, 163, 184, 0.25)',
                    boxShadow:
                      currentTurn.speaker === 'caller'
                        ? '0 0 36px rgba(34, 197, 94, 0.35)'
                        : 'none',
                    overflow: 'hidden',
                    minHeight: 370,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <img
                    src="/images/shoaib-cafe-coding.jpg"
                    alt="Caller on Live Accountability Video Call"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.88)',
                    }}
                  />

                  {/* Top Overlay */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      padding: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        padding: '5px 12px',
                        borderRadius: 999,
                        background: 'rgba(7, 18, 36, 0.85)',
                        border: '1px solid rgba(34, 197, 94, 0.45)',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#4ade80',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Mic size={13} /> Caller Webcam · HD Live
                    </span>

                    {currentTurn.speaker === 'caller' && (
                      <span
                        style={{
                          padding: '5px 11px',
                          borderRadius: 999,
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        ● CALLER SPEAKING
                      </span>
                    )}
                  </div>

                  {/* Bottom Live Caller Speech Bubble */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      margin: 16,
                      padding: '12px 16px',
                      borderRadius: 12,
                      background: 'rgba(7, 18, 36, 0.9)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#4ade80', marginBottom: 4 }}>
                      USER LIVE MICROPHONE TRANSCRIPT
                    </div>
                    <div style={{ fontSize: 13.5, color: '#f8fafc', lineHeight: 1.5 }}>
                      {currentTurn.speaker === 'caller'
                        ? `"${currentTurn.text}"`
                        : 'Watching Sergeant AI Coach respond in real time...'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recorded Video Call Demo MP4 Player Below */}
              {project.videoUrl && (
                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 20,
                    borderTop: '1px solid rgba(148, 163, 184, 0.16)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                    gap: 20,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
                      RECORDED ANIMATION CLIP
                    </div>
                    <h3 style={{ color: '#ffffff', fontSize: 19, marginTop: 4, marginBottom: 8 }}>
                      Animated Video Call Session Preview
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      Click any dialogue step below or watch the continuous video loop showing real-time
                      lip-sync, waveform telemetry, and accountability tracking.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                      {COACH_CALL_SCRIPT.map((turn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCallTurnIdx(idx)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            border:
                              callTurnIdx === idx
                                ? '1px solid #38bdf8'
                                : '1px solid rgba(148,163,184,0.25)',
                            background:
                              callTurnIdx === idx ? '#007fbe' : 'rgba(255,255,255,0.05)',
                            color: '#ffffff',
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Turn 0{idx + 1}: {turn.speaker === 'coach' ? 'Sergeant AI' : 'Caller'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      borderRadius: 14,
                      overflow: 'hidden',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      background: '#040a14',
                    }}
                  >
                    <video
                      src={project.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* REAL WEBSITE & PRODUCT VISUALS GALLERY (SCOTT'S PHOTO PATHS LAYOUT) */}
      <section className="ea-photo-paths">
        <div className="container">
          <div
            className="ea-paths-intro"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <span className="eyebrow">Real Platform Visuals &amp; Screens</span>
              <h2 style={{ marginTop: 6, color: '#0a1930', fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)' }}>
                <RevealText text={`Inside ${project.shortTitle}`} />
              </h2>
            </div>
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                Open Live Site <ExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="ea-photo-paths-grid">
            {project.gallery.map((vis, idx) => (
              <article
                key={vis.title}
                onClick={() => setLightboxImg(vis)}
                className={`ea-photo-path ${
                  idx % 2 === 0 ? 'ea-path-individuals' : 'ea-path-organizations'
                }`}
                style={{ cursor: 'zoom-in' }}
              >
                <div className="ea-path-image" style={{ background: '#071224' }}>
                  <img
                    src={vis.src}
                    alt={vis.title}
                    width="1536"
                    height="1024"
                   
                    style={{ objectFit: 'contain', background: '#071224' }}
                  />
                  <span>{vis.badge}</span>
                </div>
                <div className="ea-path-copy">
                  <div>
                    <h2>{vis.title}</h2>
                    <p>{vis.caption}</p>
                  </div>
                  <span className="ea-circle-arrow" aria-label="Expand visual">
                    <Maximize2 size={18} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONCISE 4-CARD ENGINEERING MODULES (VISUAL & SCANNABLE, NO WALL OF TEXT) */}
      <section
        className="portfolio-modules"
        style={{
          background: '#eef6fb',
          padding: '64px 0',
          color: '#0a1930',
        }}
      >
        <div className="container">
          <div style={{ marginBottom: 32 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: '#38bdf8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Cpu size={15} /> KEY ENGINEERED MODULES
            </span>
            <h2 style={{ color: '#0a1930', fontSize: 'clamp(1.65rem, 2.8vw, 2.3rem)', marginTop: 6 }}>
              What I Built for {project.shortTitle}
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 18,
            }}
          >
            {project.keyFeatures.map((feat, idx) => (
              <div
                key={feat.title}
                style={{
                  padding: 24,
                  borderRadius: 16,
                  background: '#ffffff',
                  border: '1px solid #d6e4ee',
                  borderTop: '3px solid #38bdf8',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 800,
                    fontSize: 11.5,
                    marginBottom: 12,
                  }}
                >
                  MODULE 0{idx + 1}
                </div>
                <h3 style={{ color: '#0a1930', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                  {feat.title}
                </h3>
                <p style={{ color: '#536174', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Short 3-Bullet Delivered Checklist */}
          <div
            style={{
              marginTop: 24,
              padding: '20px 24px',
              borderRadius: 16,
              background: '#ffffff',
              border: '1px solid #d6e4ee',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 14,
            }}
          >
            {project.solution.map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 13.5,
                  color: '#33465c',
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2 size={17} color="#38bdf8" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CINEMATIC SECTION — SHOAIB WORKING ON THIS PROJECT */}
      <CinematicSection
        section={{
          title: `Engineering ${project.shortTitle}`,
          body: [project.problem, ...project.overview],
        }}
        src={project.workImage}
        alt={`Shoaib Tashrif — ${project.shortTitle}`}
      />

      {/* OFFICIAL WOSLER DIAGNOSTICS LETTERS ON THE WOSLER / HILUM PROJECT PAGE */}
      {project.slug === 'hilum-healthcare-ai' && (
        <section
          className="section-space ea-approved-section"
          style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}
        >
          <div className="container">
            <div style={{ marginBottom: 28 }}>
              <span className="eyebrow">Official Wosler Diagnostics Endorsement</span>
              <h2 style={{ marginTop: 8 }}>
                <RevealText text="Reference & Experience Letters from Wosler Leadership." />
              </h2>
              <p style={{ color: '#475569', maxWidth: 720, marginTop: 8, marginBottom: 0 }}>
                Official letters issued by Wosler Diagnostics (Canada) verifying Shoaib Tashrif&apos;s tenure as AI Software Engineer (October 2024 – September 2026) across healthcare voice AI, appointment automation, backend architecture, and production engineering. Click either letter to inspect in full resolution.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {[
                {
                  src: '/images/reviews/wosler-reference-letter-leah-groves.jpg',
                  badge: 'Official Reference Letter',
                  title: 'Reference Letter — Leah Groves',
                  role: 'Authorized Signatory · Wosler Corp (leah.groves@wosler.ca)',
                  quote:
                    'Shoaib made significant contributions to our healthcare AI systems, particularly our conversational AI and voice calling solutions. His work included AI workflows, appointment automation, backend integrations, and improving the reliability and scalability of systems running in production.',
                },
                {
                  src: '/images/reviews/wosler-experience-letter-marco-gallone.jpg',
                  badge: 'Official Experience Letter',
                  title: 'Experience Letter — Marco Gallone',
                  role: 'Authorized Signatory · Wosler Corp (marco@wosler.ca)',
                  quote:
                    'This letter confirms that Shoaib Tashrif worked with Wosler Corp as an AI Software Engineer from October 2024 to September 2026... contributing to conversational AI and voice-calling workflows, appointment automation, backend systems, and production engineering.',
                },
              ].map((doc) => (
                <article
                  key={doc.title}
                  onClick={() =>
                    setLightboxImg({
                      src: doc.src,
                      title: doc.title,
                      caption: doc.role,
                    })
                  }
                  style={{
                    background: '#ffffff',
                    borderRadius: 16,
                    border: '1px solid #cbd5e1',
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px rgba(10, 25, 48, 0.07)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      background: '#0f172a',
                      padding: 16,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      maxHeight: 420,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={doc.src}
                      alt={doc.title}
                      style={{
                        width: '100%',
                        maxWidth: 420,
                        height: 'auto',
                        borderRadius: 8,
                        objectFit: 'contain',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 14,
                        left: 14,
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        background: '#0284c7',
                        color: '#ffffff',
                      }}
                    >
                      {doc.badge}
                    </span>
                  </div>
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 800, color: '#0a1930' }}>{doc.title}</div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#0284c7' }}>{doc.role}</div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#334155', margin: '4px 0 12px' }}>
                      &ldquo;{doc.quote}&rdquo;
                    </p>
                    <span
                      style={{
                        marginTop: 'auto',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: '#0a1930',
                      }}
                    >
                      <Maximize2 size={14} /> Click to inspect full signed letter
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SCOTT MILES LINKEDIN ENDORSEMENT ON EXECUTIVE ALLY PROJECT PAGE */}
      {project.slug === 'executive-ally-platform' && (
        <section
          className="section-space ea-approved-section"
          style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}
        >
          <div className="container">
            <div style={{ marginBottom: 24 }}>
              <span className="eyebrow">Client Recommendation</span>
              <h2 style={{ marginTop: 8 }}>
                <RevealText text="Endorsed by Scott Miles, CMF — Founder of Executive Ally." />
              </h2>
            </div>
            <div
              onClick={() =>
                setLightboxImg({
                  src: '/images/reviews/linkedin-scott-miles.jpg',
                  title: 'Scott Miles, CMF — LinkedIn Recommendation',
                  caption: 'Founder, Executive Ally – Miles LeHane',
                })
              }
              style={{
                background: '#ffffff',
                borderRadius: 16,
                border: '1px solid #cbd5e1',
                padding: 24,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 12px 32px rgba(10, 25, 48, 0.06)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <img
                    src="/images/reviews/avatar-scott-miles.jpg"
                    alt="Scott Miles, CMF"
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: '#0a1930' }}>Scott Miles, CMF</div>
                    <div style={{ fontSize: 13, color: '#475569' }}>
                      Executive career transition coach &amp; outplacement · Executive Ally – Miles LeHane
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#1e293b', margin: '0 0 12px' }}>
                  &ldquo;I hired Shoaib to build the website and client platform for Executive Ally – Miles LeHane, and he delivered far more than a website. He built the full system behind it, which includes payments, e-signatures, booking, automated email, and an admin panel I can run the business from, and he handled our migration and launch without missing a beat.&rdquo;
                </p>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#1e293b', margin: 0 }}>
                  &ldquo;If you need a developer you can trust with something that matters, Shoaib is that person.&rdquo;
                </p>
              </div>
              <img
                src="/images/reviews/linkedin-scott-miles.jpg"
                alt="Scott Miles LinkedIn Recommendation"
                style={{ width: '100%', borderRadius: 12, border: '1px solid #e2e8f0' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* OTHER PROJECTS VISUAL GRID */}
      <section className="ea-photo-paths">
        <div className="container">
          <div
            className="ea-paths-intro"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span className="eyebrow">Explore More Case Studies</span>
            <Link to="/projects" className="ea-button ea-button-navy">
              <Layers size={16} /> View All {PROJECTS.length} Projects
            </Link>
          </div>

          <div className="ea-photo-paths-grid">
            {otherProjects.slice(0, 4).map((item, idx) => (
              <article
                key={item.slug}
                onClick={() => navigate(`/projects/${item.slug}`)}
                className={`ea-photo-path ${
                  idx % 2 === 0 ? 'ea-path-individuals' : 'ea-path-organizations'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className="ea-path-image" style={{ background: '#071224' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    width="1536"
                    height="1024"
                   
                    style={{ objectFit: 'cover' }}
                  />
                  <span>{item.clientLabel}</span>
                </div>
                <div className="ea-path-copy">
                  <div>
                    <h2>{item.shortTitle}</h2>
                    <p>{item.summary}</p>
                    <Link
                      to={`/projects/${item.slug}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open Project Visuals &rarr;
                    </Link>
                  </div>
                  <Link
                    to={`/projects/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ea-circle-arrow"
                    aria-label={item.shortTitle}
                  >
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SCOTT'S WORKING CTA SECTION */}
      <section className="ea-cta">
        <div className="container ea-cta-inner">
          <div>
            <h2>
              <RevealText text="Book a short discovery call" />
            </h2>
          </div>
          <div className="ea-cta-action">
            <p>
              Want to build a similar AI, voice, medical, or automation platform? Let&apos;s map out
              the architecture together.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="ea-button ea-button-blue"
              >
                <PhoneCall size={17} /> Book 30-Min Call on Calendly
              </a>
              <Link to="/contact" className="ea-button ea-button-navy">
                <Sparkles size={17} /> Send Project Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-SCREEN VISUAL LIGHTBOX MODAL */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 10, 22, 0.92)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 1120,
              width: '100%',
              background: '#0a1930',
              borderRadius: 20,
              border: '1px solid rgba(56, 189, 248, 0.35)',
              overflow: 'hidden',
              boxShadow: '0 28px 80px rgba(0,0,0,0.65)',
            }}
          >
            <div
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                color: '#ffffff',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{lightboxImg.title}</div>
                <div style={{ fontSize: 12.5, color: '#94a3b8' }}>{lightboxImg.caption}</div>
              </div>
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(148,163,184,0.25)',
                  color: '#ffffff',
                  borderRadius: 10,
                  padding: 8,
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 16, background: '#050d1a', textAlign: 'center' }}>
              <img
                src={lightboxImg.src}
                alt={lightboxImg.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '76vh',
                  objectFit: 'contain',
                  borderRadius: 10,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
