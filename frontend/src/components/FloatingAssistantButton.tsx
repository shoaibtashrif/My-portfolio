import { Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function FloatingAssistantButton() {
  const { pathname } = useLocation();
  if (pathname === '/assistant') return null;

  return (
    <Link
      to="/assistant"
      title="Talk to Shoaib's AI Assistant"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 18px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: 14,
        boxShadow: '0 12px 32px rgba(2, 132, 199, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <Bot size={19} />
      <span>Ask Shoaib&apos;s AI</span>
    </Link>
  );
}

