import { FormEvent, useState } from 'react';
import { ArrowUpRight, Calendar, CheckCircle2, Send } from 'lucide-react';
import { HeroScene } from '../components/EditorialScenes';
import { RevealText } from '../components/RevealText';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [topic, setTopic] = useState('Voice AI / Agentic System');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ calendlyUrl: string } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          role,
          topic,
          preferredTime,
          message,
          source: 'contact_form',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send inquiry.');
      setSubmitted({ calendlyUrl: data.calendlyUrl || PORTFOLIO_PROFILE.calendlyUrl });
      setName('');
      setEmail('');
      setCompany('');
      setRole('');
      setPreferredTime('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit inquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="ea-contact ea-approved-contact">
      <section className="ea-page-hero ea-scene-hero">
        <div className="container ea-page-hero-grid">
          <div>
            <span className="eyebrow">Contact &amp; Inquiry</span>
            <div className="ea-scene-rule" aria-hidden="true" />
            <h1>
              <RevealText text="Start a conversation or book a 30-minute discovery call." />
            </h1>
            <p>
              Submit the project inquiry form below. A copy of your submission and follow-up details
              will be sent automatically to both your inbox and Shoaib&apos;s email.
            </p>
            <a
              href={PORTFOLIO_PROFILE.calendlyUrl}
              target="_blank"
              rel="noreferrer"
              className="ea-button ea-button-blue"
            >
              Book directly on Calendly
              <ArrowUpRight size={19} />
            </a>
          </div>
          <HeroScene
            variant="about"
            src="/images/shoaib-hero-workspace.jpg"
            alt="Shoaib Tashrif — Contact"
            label="Shoaib Tashrif"
            note="Response within 24 hours · Global Remote"
          />
        </div>
      </section>

      <section className="section-space ea-approved-section">
        <div className="container">
          <div className="ea-split">
            <div className="ea-section-heading">
              <h2>
                <RevealText text="Send a Project Inquiry" />
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>
                Prefer email? Reach out directly at{' '}
                <a href={`mailto:${PORTFOLIO_PROFILE.email}`} className="ea-text-link">
                  {PORTFOLIO_PROFILE.email}
                </a>
                .
              </p>
            </div>

            <div className="ea-approved-copy">
              {submitted && (
                <div
                  style={{
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 22,
                    color: '#065F46',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 6 }}>
                    <CheckCircle2 size={18} />
                    Inquiry Sent &amp; Copy Delivered!
                  </div>
                  <p style={{ fontSize: 14, margin: '0 0 12px', color: '#065F46' }}>
                    Check your inbox for a copy of your form submission and follow-up instructions.
                  </p>
                  <a href={submitted.calendlyUrl} target="_blank" rel="noreferrer" className="ea-button ea-button-blue">
                    <Calendar size={16} />
                    Book 30-Min Call on Calendly
                  </a>
                </div>
              )}

              {error && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 10,
                    padding: '12px 14px',
                    marginBottom: 18,
                    color: '#991B1B',
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <label style={labelStyle}>
                    Full Name *
                    <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Email Address *
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" style={inputStyle} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <label style={labelStyle}>
                    Company / Organization
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" style={inputStyle} />
                  </label>
                  <label style={labelStyle}>
                    Your Role
                    <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Founder, CTO, Product Lead..." style={inputStyle} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                  <label style={labelStyle}>
                    Inquiry Topic
                    <select value={topic} onChange={(e) => setTopic(e.target.value)} style={inputStyle}>
                      <option value="Voice AI / Agentic System">Voice AI / Agentic System</option>
                      <option value="Full Stack Web & Backend">Full Stack Web &amp; Backend</option>
                      <option value="RAG & Knowledge Assistant">RAG &amp; Knowledge Assistant</option>
                      <option value="CRM & Business Automation">CRM &amp; Business Automation</option>
                      <option value="Full-Time / Contract Opportunity">Full-Time / Contract Opportunity</option>
                    </select>
                  </label>
                  <label style={labelStyle}>
                    Preferred Call Time
                    <input value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} placeholder="e.g. Weekdays 3 PM EST" style={inputStyle} />
                  </label>
                </div>

                <label style={labelStyle}>
                  Project Details / Message *
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your workflow, goals, or role..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </label>

                <button type="submit" disabled={submitting} className="ea-button ea-button-blue" style={{ justifyContent: 'center' }}>
                  <Send size={16} />
                  {submitting ? 'Sending Inquiry...' : 'Submit Inquiry & Receive Copy'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontSize: 13,
  fontWeight: 700,
  color: '#0a1930',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #cad5e1',
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#0a1930',
  background: '#ffffff',
  outline: 'none',
};
