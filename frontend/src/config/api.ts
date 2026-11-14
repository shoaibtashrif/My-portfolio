const DEFAULT_PROD_BACKEND = 'https://shoaib.159.195.16.164.nip.io';

export function getApiBaseUrl(): string {
  const configured = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  if (configured && configured.trim()) {
    return configured.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')) {
    return DEFAULT_PROD_BACKEND;
  }
  return '';
}

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${cleanPath}`;
}

export function voiceWsUrl(): string {
  const base = getApiBaseUrl();
  if (base) {
    return `${base.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:')}/api/v1/voice`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/v1/voice`;
}
