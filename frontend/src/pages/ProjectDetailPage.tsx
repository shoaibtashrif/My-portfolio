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
  const [coachReactionOverride, setCoachReactionOverride] = useState<string | null>(null);
  const [socialScrollPaused, setSocialScrollPaused] = useState(false);
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
        @keyframes animeHumanSpeak {
          0%, 100% { transform: scale(1.01) translateY(0px) rotate(0deg); }
          25% { transform: scale(1.028) translateY(-4px) rotate(-0.4deg); }
          50% { transform: scale(1.02) translateY(-2px) rotate(0.4deg); }
          75% { transform: scale(1.032) translateY(-5px) rotate(-0.2deg); }
        }
        @keyframes animeHumanListenNod {
          0%, 100% { transform: scale(1.01) translateY(0px); }
          35% { transform: scale(1.018) translateY(5px); }
          70% { transform: scale(1.015) translateY(-3px); }
        }
        @keyframes mouthTalk {
          0%, 100% { transform: scaleY(0.35); }
          50% { transform: scaleY(1.15); }
        }
        @keyframes eqBar {
          0%, 100% { height: 6px; }
          50% { height: 26px; }
        }
        @keyframes phoneFeedScroll {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
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
                  <Video size={15} /> ● INTERACTIVE 3D ANIME AI VIDEO CALL (HUMAN-LIKE REACTIONS)
                </span>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', margin: 0 }}>
                  Face-to-Face Video Call with Interactive AI Anime Coach
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: 15, marginTop: 8, marginBottom: 0, maxWidth: 760 }}>
                  Just like talking to a real person on FaceTime or Zoom — you speak face-to-face on webcam while the
                  expressive AI Anime Sergeant maintains eye contact, nods while listening, reacts with human-like facial
                  expressions, and speaks back with real-time lip-sync.
                </p>
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

            {/* Interactive FaceTime / Zoom Style Full-Screen Anime Video Call Stage */}
            <div
              style={{
                borderRadius: 24,
                background: '#050d1a',
                border: '2px solid rgba(56, 189, 248, 0.45)',
                boxShadow: '0 28px 70px rgba(0, 0, 0, 0.65)',
                padding: 22,
              }}
            >
              {/* Top Call HUD Bar + Human Reaction Selector */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  paddingBottom: 16,
                  marginBottom: 18,
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
                  <span style={{ fontWeight: 800, fontSize: 13.5, color: '#f8fafc', letterSpacing: '0.03em' }}>
                    SERGEANT AI ANIME COACH · LIVE WEBRTC FACE-TO-FACE CALL
                  </span>
                </div>

                {/* Human-Like Reaction Triggers */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 700, marginRight: 4 }}>
                    AI Human Reaction:
                  </span>
                  {[
                    { id: 'encouraging', label: '😊 Warm & Encouraging' },
                    { id: 'listening', label: '👂 Active Listening & Nodding' },
                    { id: 'tactical', label: '🤔 Tactical Thinking' },
                    { id: 'celebrating', label: '🔥 Fired Up Salute (96% Streak)' },
                  ].map((react) => {
                    const activeReaction =
                      coachReactionOverride ||
                      (currentTurn.speaker === 'caller'
                        ? 'listening'
                        : callTurnIdx === 3
                          ? 'celebrating'
                          : callTurnIdx === 1
                            ? 'tactical'
                            : 'encouraging');
                    const isSelected = activeReaction === react.id;
                    return (
                      <button
                        key={react.id}
                        type="button"
                        onClick={() => setCoachReactionOverride(react.id)}
                        style={{
                          padding: '5px 11px',
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 800,
                          cursor: 'pointer',
                          border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(148,163,184,0.25)',
                          background: isSelected ? '#007fbe' : 'rgba(15, 23, 42, 0.8)',
                          color: '#ffffff',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {react.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MAIN FULL-SCREEN ANIME VIDEO CALL VIEWPORT WITH PIP CALLER WEBCAM */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border:
                    currentTurn.speaker === 'coach'
                      ? '3px solid #38bdf8'
                      : '2px solid rgba(34, 197, 94, 0.65)',
                  boxShadow:
                    currentTurn.speaker === 'coach'
                      ? '0 0 42px rgba(56, 189, 248, 0.35)'
                      : '0 0 36px rgba(34, 197, 94, 0.25)',
                  background: '#071428',
                  minHeight: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Full-Screen 3D Anime Coach Video Stream with Human Breathing / Nodding Motion */}
                <img
                  src="/images/sergeant-anime-videocall.jpg"
                  alt="Interactive AI Anime Sergeant Coach in Live Face-to-Face Video Call"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    animation:
                      currentTurn.speaker === 'coach'
                        ? 'animeHumanSpeak 2.8s infinite ease-in-out'
                        : 'animeHumanListenNod 3.2s infinite ease-in-out',
                    filter:
                      (coachReactionOverride || (currentTurn.speaker === 'caller' ? 'listening' : 'encouraging')) ===
                      'celebrating'
                        ? 'saturate(1.22) contrast(1.06) brightness(1.05)'
                        : 'contrast(1.03)',
                    transition: 'filter 0.4s ease',
                  }}
                />

                {/* Subtle Vignette Gradient for HUD Readability */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(4,10,22,0.72) 0%, rgba(4,10,22,0.08) 32%, rgba(4,10,22,0.18) 62%, rgba(4,10,22,0.92) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* TOP OVERLAY: Anime Coach Identity + Live Emotion Telemetry */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '18px 20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        padding: '6px 14px',
                        borderRadius: 999,
                        background: 'rgba(7, 18, 36, 0.88)',
                        border: '1px solid rgba(56, 189, 248, 0.55)',
                        fontSize: 12.5,
                        fontWeight: 800,
                        color: '#38bdf8',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      🎌 Sergeant AI Anime Coach · 60fps Neural Lip-Sync
                    </span>
                    <span
                      style={{
                        padding: '6px 13px',
                        borderRadius: 999,
                        background:
                          currentTurn.speaker === 'coach'
                            ? 'rgba(0, 127, 190, 0.92)'
                            : 'rgba(22, 163, 74, 0.9)',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {currentTurn.speaker === 'coach'
                        ? '● AI ANIME SPEAKING TO YOU'
                        : '👂 NODDING & LISTENING TO YOUR MIC'}
                    </span>
                  </div>

                  {/* Emotion & Eye-Contact Pill */}
                  <div
                    style={{
                      padding: '6px 14px',
                      borderRadius: 999,
                      background: 'rgba(7, 18, 36, 0.88)',
                      border: '1px solid rgba(74, 222, 128, 0.45)',
                      color: '#4ade80',
                      fontSize: 12,
                      fontWeight: 800,
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Eye Contact: Locked · Streak: {currentTurn.streak} ({currentTurn.score}%)
                  </div>
                </div>

                {/* BOTTOM AREA: Live Subtitle + Voice Waveform + Picture-in-Picture (PiP) User Webcam */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '18px 20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 18,
                    alignItems: 'end',
                  }}
                >
                  {/* Left: Live Face-to-Face Dialogue Subtitles & Equalizer */}
                  <div
                    style={{
                      padding: '16px 20px',
                      borderRadius: 16,
                      background: 'rgba(7, 18, 36, 0.88)',
                      border:
                        currentTurn.speaker === 'coach'
                          ? '1px solid rgba(56, 189, 248, 0.55)'
                          : '1px solid rgba(34, 197, 94, 0.55)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: currentTurn.speaker === 'coach' ? '#38bdf8' : '#4ade80',
                        }}
                      >
                        {currentTurn.speaker === 'coach'
                          ? '🎌 SERGEANT AI ANIME COACH (SPEAKING LIVE)'
                          : '🎙️ YOU (CALLER WEBCAM MICROPHONE)'}
                      </span>

                      {/* Animated Voice Equalizer Bars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 18 }}>
                        {[0, 1, 2, 3, 4, 5, 6].map((b) => (
                          <span
                            key={b}
                            style={{
                              width: 3,
                              height: 14,
                              background: currentTurn.speaker === 'coach' ? '#38bdf8' : '#4ade80',
                              borderRadius: 2,
                              display: 'inline-block',
                              animation: `eqBar ${0.42 + b * 0.07}s infinite ease-in-out`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div style={{ fontSize: 15.5, fontWeight: 600, color: '#ffffff', lineHeight: 1.55 }}>
                      &ldquo;{currentTurn.text}&rdquo;
                    </div>

                    {/* FaceTime / Zoom Call Controls Bar */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: '1px solid rgba(148, 163, 184, 0.18)',
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'rgba(34, 197, 94, 0.18)',
                          color: '#4ade80',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        🎥 HD Camera On
                      </span>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'rgba(56, 189, 248, 0.18)',
                          color: '#38bdf8',
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        ⚡ Expression Engine: Human-Like Anime v2
                      </span>
                      <span style={{ fontSize: 11.5, color: '#94a3b8', marginLeft: 'auto' }}>
                        Click any turn below to test conversation
                      </span>
                    </div>
                  </div>

                  {/* Right: Picture-in-Picture (PiP) Caller Webcam Window (Like Real Video Calling) */}
                  <div
                    style={{
                      width: 195,
                      height: 142,
                      borderRadius: 16,
                      overflow: 'hidden',
                      position: 'relative',
                      border:
                        currentTurn.speaker === 'caller'
                          ? '3px solid #22c55e'
                          : '2px solid rgba(255, 255, 255, 0.35)',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                      background: '#0a1930',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src="/images/shoaib-cafe-coding.jpg"
                      alt="You (Caller Picture-in-Picture Webcam)"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        padding: '3px 8px',
                        borderRadius: 999,
                        background: 'rgba(7, 18, 36, 0.85)',
                        color: '#4ade80',
                        fontSize: 10,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Mic size={10} /> You (Webcam)
                    </div>
                    {currentTurn.speaker === 'caller' && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: '#16a34a',
                          color: '#ffffff',
                          fontSize: 9.5,
                          fontWeight: 800,
                        }}
                      >
                        ● SPEAKING
                      </div>
                    )}
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
                      INTERACTIVE DIALOGUE TURNS & RECORDED DEMO
                    </div>
                    <h3 style={{ color: '#ffffff', fontSize: 19, marginTop: 4, marginBottom: 8 }}>
                      Test Live Anime Video Call Turns & Reactions
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                      Click any dialogue turn below to watch the AI Anime Coach switch between active listening,
                      nodding, tactical analysis, and speaking with real-time voice synthesis.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                      {COACH_CALL_SCRIPT.map((turn, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCoachReactionOverride(null);
                            setCallTurnIdx(idx);
                          }}
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
                          Turn 0{idx + 1}: {turn.speaker === 'coach' ? '🎌 Anime Coach' : '🎙️ You'}
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

      {/* LIVE SCROLLING MOBILE APPS SHOWCASE (INSTAGRAM, YOUTUBE, TIKTOK, FACEBOOK INSIDE PHONE BODIES) */}
      {project.slug === 'social-media-automation' && (
        <section
          style={{
            background: 'linear-gradient(180deg, #040b16 0%, #091931 100%)',
            padding: '68px 0',
            borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#ffffff',
          }}
        >
          <div className="container">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 16,
                marginBottom: 32,
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: 'rgba(56, 189, 248, 0.16)',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    color: '#38bdf8',
                    fontSize: 12,
                    fontWeight: 800,
                    marginBottom: 10,
                  }}
                >
                  📱 LIVE MULTI-PLATFORM MOBILE FEEDS (AUTO-SCROLLING INSIDE PHONE BODIES)
                </span>
                <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.75rem, 3vw, 2.45rem)', margin: 0 }}>
                  Instagram, YouTube, TikTok &amp; Facebook Scrolling Live on Mobile
                </h2>
                <p style={{ color: '#cbd5e1', fontSize: 15, marginTop: 8, marginBottom: 0, maxWidth: 780 }}>
                  Watch how our autonomous AI content engine publishes viral Reels, Shorts, TikToks, and Facebook video
                  posts that continuously scroll inside real mobile app interfaces with live engagement telemetry.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSocialScrollPaused((prev) => !prev)}
                className="ea-button ea-button-blue"
                style={{ cursor: 'pointer' }}
              >
                {socialScrollPaused ? '▶ Resume Mobile App Scrolling' : '⏸ Pause Mobile Feeds'}
              </button>
            </div>

            {/* 4 REALISTIC IPHONE 16 PRO MOBILE BODIES WITH SCROLLING APP FEEDS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
                gap: 24,
                alignItems: 'stretch',
              }}
            >
              {[
                {
                  platform: 'Instagram',
                  handle: '@shoaib.ai.studio',
                  badgeBg: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)',
                  headerBg: '#121212',
                  accent: '#e1306c',
                  speed: '16s',
                  stories: ['AI Reels', 'n8n Bot', 'Viral', 'Clients'],
                  posts: [
                    {
                      tag: 'INSTAGRAM REEL · AUTO-PUBLISHED',
                      title: 'Autonomous AI Agent builds & schedules 30 Reels in 4 mins ⚡',
                      stats: '❤️ 14.8K Likes · 💬 642 Comments · 🚀 98.4% Reach',
                      img: '/images/social-automation.png',
                    },
                    {
                      tag: 'CAROUSEL POST · AI GENERATED',
                      title: 'How LangGraph + ElevenLabs automates faceless Instagram channels',
                      stats: '❤️ 9.2K Likes · 💬 318 Comments · 🔖 2.1K Saves',
                      img: '/images/ai-tech-hero-visual.png',
                    },
                    {
                      tag: 'INSTAGRAM STORY + REEL SYNC',
                      title: 'Zero-touch captioning, trending audio & auto-DM lead funnel',
                      stats: '❤️ 19.4K Likes · 💬 890 Comments · 📈 +310% Growth',
                      img: '/images/social-phones-showcase.jpg',
                    },
                  ],
                  navIcons: ['🏠', '🔍', '➕', '🎬', '👤'],
                },
                {
                  platform: 'YouTube',
                  handle: 'Shoaib AI Automation · 120K',
                  badgeBg: 'linear-gradient(135deg, #ff0000, #b30000)',
                  headerBg: '#0f0f0f',
                  accent: '#ff0000',
                  speed: '19s',
                  stories: ['All', 'Shorts', 'AI Agents', 'Podcasts'],
                  posts: [
                    {
                      tag: 'YOUTUBE SHORT · 4K 60FPS',
                      title: 'Full Multi-Platform AI Pipeline: Prompt → Voiceover → YouTube Short',
                      stats: '👁️ 248K Views · 👍 18K Likes · 🔔 +1,420 Subs',
                      img: '/images/social-phones-showcase.jpg',
                    },
                    {
                      tag: 'LONG-FORM + SHORTS CLIPPER',
                      title: 'Building an Autonomous 24/7 YouTube Channel with Python & FFmpeg',
                      stats: '👁️ 112K Views · 👍 9.4K Likes · 💬 740 Comments',
                      img: '/images/architecture-pipeline-visual.png',
                    },
                    {
                      tag: 'YOUTUBE ANALYTICS · API',
                      title: 'Auto-A/B Thumbnail & Title Optimizer triggered via YouTube Data API v3',
                      stats: '👁️ 84K Views · 👍 6.9K Likes · 📈 CTR 11.8%',
                      img: '/images/social-automation.png',
                    },
                  ],
                  navIcons: ['🏠', '⚡ Shorts', '➕', '📺 Subs', '📚 You'],
                },
                {
                  platform: 'TikTok',
                  handle: '@aiautomation.engine',
                  badgeBg: 'linear-gradient(135deg, #00f2fe, #fe0979)',
                  headerBg: '#090909',
                  accent: '#00f2fe',
                  speed: '14s',
                  stories: ['Following', 'For You', 'AI Viral', 'Live'],
                  posts: [
                    {
                      tag: 'FOR YOU PAGE · TRENDING SOUND',
                      title: 'POV: Your AI Agent posts 4x/day on TikTok while you sleep 🤖🔥',
                      stats: '❤️ 62.5K · 💬 1,940 · 🔁 8,410 Shares',
                      img: '/images/ai-tech-hero-visual.png',
                    },
                    {
                      tag: 'TIKTOK SERIES · AUTO-CAPTIONED',
                      title: 'Word-by-word kinetic subtitles + neural clone voice rendered in 12s',
                      stats: '❤️ 41.2K · 💬 980 · 🔖 11.3K Bookmarks',
                      img: '/images/social-phones-showcase.jpg',
                    },
                    {
                      tag: 'VIRAL HOOK GENERATOR',
                      title: 'GPT-4o analyzes top 1% TikTok hooks & renders custom B-roll',
                      stats: '❤️ 88.9K · 💬 3,120 · 🚀 1.1M Plays',
                      img: '/images/social-automation.png',
                    },
                  ],
                  navIcons: ['🏠 Home', '🧭 Friends', '➕', '📥 Inbox', '👤 Profile'],
                },
                {
                  platform: 'Facebook',
                  handle: 'AI Growth Page · Verified',
                  badgeBg: 'linear-gradient(135deg, #1877f2, #0c5dc7)',
                  headerBg: '#18191a',
                  accent: '#1877f2',
                  speed: '18s',
                  stories: ['Reels', 'Stories', 'Groups', 'Watch'],
                  posts: [
                    {
                      tag: 'FACEBOOK WATCH & REELS',
                      title: 'Cross-posted HD Reel + Automated Comment Responder & Messenger Bot',
                      stats: '👍❤️ 12.4K Reactions · 💬 530 Comments · ↗️ 1.8K Shares',
                      img: '/images/social-automation.png',
                    },
                    {
                      tag: 'META GRAPH API AUTOMATION',
                      title: 'Instant lead capture from Facebook comments straight into CRM',
                      stats: '👍🔥 8.7K Reactions · 💬 412 Comments · ↗️ 920 Shares',
                      img: '/images/social-phones-showcase.jpg',
                    },
                    {
                      tag: 'MULTI-PAGE SCHEDULER',
                      title: 'Simultaneous publishing across 15+ client Facebook & Instagram pages',
                      stats: '👍❤️ 21.3K Reactions · 💬 1.1K Comments · 📈 99.98% Uptime',
                      img: '/images/architecture-pipeline-visual.png',
                    },
                  ],
                  navIcons: ['🏠', '🎬 Watch', '🏪', '🔔', '☰'],
                },
              ].map((phone) => (
                <div
                  key={phone.platform}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  {/* Platform Top Pill */}
                  <div
                    style={{
                      marginBottom: 12,
                      padding: '6px 16px',
                      borderRadius: 999,
                      background: phone.badgeBg,
                      color: '#ffffff',
                      fontSize: 12.5,
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                    }}
                  >
                    {phone.platform} · Live Mobile Feed
                  </div>

                  {/* Realistic iPhone 16 Pro Titanium Bezel Body */}
                  <div
                    style={{
                      width: '100%',
                      maxWidth: 285,
                      height: 540,
                      borderRadius: 42,
                      padding: 11,
                      background: 'linear-gradient(145deg, #334155 0%, #0f172a 50%, #1e293b 100%)',
                      boxShadow: '0 26px 60px rgba(0, 0, 0, 0.65), inset 0 0 0 2px rgba(255,255,255,0.18)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Inner OLED Screen */}
                    <div
                      style={{
                        flex: 1,
                        borderRadius: 32,
                        background: phone.headerBg,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {/* iOS Status Bar + Dynamic Island */}
                      <div
                        style={{
                          padding: '8px 16px 6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: 10.5,
                          fontWeight: 800,
                          color: '#f8fafc',
                          background: phone.headerBg,
                          zIndex: 3,
                        }}
                      >
                        <span>9:41</span>
                        <span
                          style={{
                            width: 68,
                            height: 16,
                            borderRadius: 999,
                            background: '#000000',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        />
                        <span>5G 🔋</span>
                      </div>

                      {/* App Header + Stories / Category Pills */}
                      <div
                        style={{
                          padding: '6px 12px 8px',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          background: phone.headerBg,
                          zIndex: 3,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 6,
                          }}
                        >
                          <span style={{ fontWeight: 900, fontSize: 13.5, color: '#ffffff' }}>
                            {phone.platform}
                          </span>
                          <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>
                            {phone.handle}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: 6, overflow: 'hidden' }}>
                          {phone.stories.map((st, i) => (
                            <span
                              key={st}
                              style={{
                                padding: '3px 8px',
                                borderRadius: 999,
                                fontSize: 9.5,
                                fontWeight: 700,
                                background: i === 0 ? phone.badgeBg : 'rgba(255,255,255,0.08)',
                                color: '#ffffff',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Vertically Auto-Scrolling App Feed Track (Duplicated for Seamless Infinite Loop) */}
                      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            padding: 10,
                            animation: `phoneFeedScroll ${phone.speed} linear infinite`,
                            animationPlayState: socialScrollPaused ? 'paused' : 'running',
                          }}
                        >
                          {[...phone.posts, ...phone.posts].map((post, pIdx) => (
                            <div
                              key={`${phone.platform}-${pIdx}`}
                              style={{
                                borderRadius: 14,
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                overflow: 'hidden',
                              }}
                            >
                              <div style={{ position: 'relative', height: 132, overflow: 'hidden' }}>
                                <img
                                  src={post.img}
                                  alt={post.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                     display: 'block',
                                  }}
                                />
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: 7,
                                    left: 7,
                                    padding: '2px 7px',
                                    borderRadius: 6,
                                    background: 'rgba(0, 0, 0, 0.78)',
                                    color: '#ffffff',
                                    fontSize: 8.5,
                                    fontWeight: 800,
                                    letterSpacing: '0.04em',
                                  }}
                                >
                                  {post.tag}
                                </span>
                                <span
                                  style={{
                                    position: 'absolute',
                                    bottom: 7,
                                    right: 7,
                                    padding: '2px 7px',
                                    borderRadius: 6,
                                    background: phone.badgeBg,
                                    color: '#ffffff',
                                    fontSize: 8.5,
                                    fontWeight: 800,
                                  }}
                                >
                                  ● LIVE
                                </span>
                              </div>
                              <div style={{ padding: '9px 10px' }}>
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#f8fafc',
                                    lineHeight: 1.35,
                                    marginBottom: 5,
                                  }}
                                >
                                  {post.title}
                                </div>
                                <div style={{ fontSize: 9.5, color: '#94a3b8', fontWeight: 700 }}>
                                  {post.stats}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Native Mobile App Navigation Bar */}
                      <div
                        style={{
                          padding: '8px 10px 10px',
                          background: phone.headerBg,
                          borderTop: '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          color: '#cbd5e1',
                          zIndex: 3,
                        }}
                      >
                        {phone.navIcons.map((ic, idx) => (
                          <span key={idx} style={{ opacity: idx === 0 ? 1 : 0.72 }}>
                            {ic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* High-Res Multi-Phone Studio Render Banner Below */}
            <div
              onClick={() =>
                setLightboxImg({
                  src: '/images/social-phones-showcase.jpg',
                  title: 'Instagram, YouTube, TikTok & Facebook Live Mobile App Feeds',
                  caption:
                    'Multi-platform mobile showcase displaying Instagram Reels, YouTube Shorts, TikTok For You feed, and Facebook Watch running inside smartphone bodies.',
                })
              }
              style={{
                marginTop: 32,
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                background: '#071428',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                alignItems: 'center',
              }}
            >
              <img
                src="/images/social-phones-showcase.jpg"
                alt="Instagram, YouTube, TikTok and Facebook Mobile Phones Showcase"
                style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '24px 28px' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: '#38bdf8',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  4-PLATFORM SYNCHRONIZED PUBLISHING ENGINE
                </span>
                <h3 style={{ color: '#ffffff', fontSize: 22, marginTop: 6, marginBottom: 10 }}>
                  One AI Prompt → 4 Native Vertical Video Feeds
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: 14.5, lineHeight: 1.65, margin: 0 }}>
                  Every video is automatically formatted to 9:16 vertical aspect ratio, loudness-normalized, captions
                  burned in, and published natively to Instagram Reels, YouTube Shorts, TikTok, and Facebook Reels.
                  Click to inspect full resolution.
                </p>
              </div>
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

      {/* OFFICIAL VSI EXPERIENCE CERTIFICATE ON VALYRIAN SYSTEMS PROJECT PAGE */}
      {project.slug === 'valyrian-systems' && (
        <section
          style={{
            padding: '64px 0',
            background: 'linear-gradient(180deg, #f8fafc 0%, #eef6ff 100%)',
            borderTop: '1px solid rgba(0, 127, 190, 0.16)',
            borderBottom: '1px solid rgba(0, 127, 190, 0.16)',
          }}
        >
          <div className="container">
            <div style={{ maxWidth: 820, marginBottom: 28 }}>
              <span className="eyebrow">Official Valyrian Systems Inc. (VSI) Verification</span>
              <div className="ea-scene-rule" aria-hidden="true" />
              <h2>Official Experience Certificate (Dec 2021 – Jan 2025)</h2>
              <p style={{ color: '#475569', fontSize: 15.5, lineHeight: 1.65 }}>
                Official company certification signed by Ch. Muhammad Asim (Manager HR, Valyrian Systems Incorporation,
                Ref: VSI-I/HR/G-180) verifying Shoaib Tashrif&apos;s tenure on the Frontend Development, Protocol
                Decoding, and DevOps Team for Valyrian&apos;s proprietary Network Management System (NMS).
              </p>
            </div>

            <div
              onClick={() =>
                setLightboxImg({
                  src: '/images/reviews/vsi-experience-letter.jpg',
                  title: 'Valyrian Systems Incorporation (VSI) — Official Experience Certificate',
                  caption:
                    'Signed by Ch. Muhammad Asim (Manager HR, VSI, Ref: VSI-I/HR/G-180) verifying Shoaib Tashrif’s work from December 01, 2021 through January 31, 2025.',
                })
              }
              style={{
                background: '#ffffff',
                borderRadius: 20,
                padding: 28,
                border: '1px solid rgba(0, 127, 190, 0.25)',
                boxShadow: '0 18px 44px rgba(10, 22, 48, 0.08)',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 28,
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '5px 12px',
                    borderRadius: 999,
                    background: 'rgba(0, 127, 190, 0.12)',
                    color: '#007fbe',
                    fontSize: 11.5,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  📄 OFFICIAL EXPERIENCE LETTER · REF: VSI-I/HR/G-180
                </span>
                <h3 style={{ fontSize: 22, color: '#0f172a', margin: '0 0 10px' }}>
                  3+ Years on VSI Proprietary Network Management System
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: '#334155', marginBottom: 16 }}>
                  &ldquo;This is to certify that Shoaib Tashrif has served as a Jr. Member Technical Staff in this
                  organization from December 01, 2021 through January 31, 2025. During this period, he assisted with
                  the Frontend Development, Protocol Decoding and DevOps Team for Valyrian&apos;s proprietary Network
                  Management System.&rdquo;
                </p>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: 13.5,
                    color: '#1e293b',
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  Signed by: Ch. Muhammad Asim — Manager (HR), Valyrian Systems Incorporation (Islamabad)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#007fbe' }}>
                    🔍 Click certificate to inspect full-screen
                  </span>
                  <Link
                    to="/reviews"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', textDecoration: 'underline' }}
                  >
                    See all 14 Client Reviews &amp; Letters →
                  </Link>
                </div>
              </div>

              <div
                style={{
                  borderRadius: 14,
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  maxHeight: 460,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/images/reviews/vsi-experience-letter.jpg"
                  alt="Valyrian Systems Incorporation Official Experience Certificate"
                  style={{ width: '100%', height: 'auto', maxHeight: 450, objectFit: 'contain', display: 'block' }}
                />
              </div>
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
