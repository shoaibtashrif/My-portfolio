import { useEffect } from 'react';
import { PORTFOLIO_PROFILE, PROJECTS } from '../data/portfolioData';
import { trackPageView } from '../utils/analytics';

export const SITE_ORIGIN = PORTFOLIO_PROFILE.links.portfolio.replace(/\/+$/, '');
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/shoaib-hero-workspace.jpg`;

interface RouteSeoMeta {
  title: string;
  description: string;
  canonicalPath: string;
  image: string;
  ogType: 'website' | 'profile' | 'article';
}

const STATIC_ROUTE_META: Record<string, Omit<RouteSeoMeta, 'canonicalPath'>> = {
  '/': {
    title: 'Shoaib Tashrif — Full Stack AI Software Engineer',
    description:
      'Shoaib Tashrif is a Full Stack AI Software Engineer building production AI voice agents, LangGraph multi-agent workflows, RAG assistants, DICOM medical AI, and full-stack software.',
    image: DEFAULT_IMAGE,
    ogType: 'profile',
  },
  '/expertise': {
    title: 'Expertise & AI Architecture | Shoaib Tashrif',
    description:
      'Real-time voice AI, LangGraph agentic systems, RAG knowledge retrieval, business automation, and scalable TypeScript/Python engineering by Shoaib Tashrif.',
    image: `${SITE_ORIGIN}/images/engineering-stack.jpg`,
    ogType: 'website',
  },
  '/projects': {
    title: 'AI & Full-Stack Projects | Shoaib Tashrif',
    description:
      'Production case studies by Shoaib Tashrif: Hilum Healthcare & DICOM AI, H2O Water CRM, Sergeant AI Coach, Valyrian Systems cybersecurity, and Executive Ally.',
    image: `${SITE_ORIGIN}/images/hero-ai-architecture.jpg`,
    ogType: 'website',
  },
  '/reviews': {
    title: 'Client Reviews & Upwork Track Record | Shoaib Tashrif',
    description:
      'Verified 5-star Upwork reviews, Top Rated track record, and 100% Job Success across international AI and full-stack software engagements.',
    image: DEFAULT_IMAGE,
    ogType: 'website',
  },
  '/about': {
    title: 'About Shoaib Tashrif — Full Stack AI Software Engineer',
    description:
      '4+ years building production AI systems, voice pipelines, healthcare & cybersecurity platforms for clients in the US, Canada, UK, and Australia.',
    image: `${SITE_ORIGIN}/images/shoaib-whiteboard-architecture.jpg`,
    ogType: 'profile',
  },
  '/contact': {
    title: 'Contact Shoaib Tashrif | Book a Discovery Call',
    description:
      'Discuss an AI agent, voice pipeline, automation, or full-stack software build with Shoaib Tashrif via Calendly or direct email.',
    image: DEFAULT_IMAGE,
    ogType: 'website',
  },
};

export function resolveRouteSeo(pathname: string): RouteSeoMeta {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (normalized.startsWith('/projects/')) {
    const slug = normalized.slice('/projects/'.length);
    const project = PROJECTS.find((p) => p.slug === slug);
    if (project) {
      const imgPath = project.image?.startsWith('http')
        ? project.image
        : `${SITE_ORIGIN}${project.image?.startsWith('/') ? '' : '/'}${project.image || 'images/shoaib-hero-workspace.jpg'}`;
      return {
        title: `${project.shortTitle} | Shoaib Tashrif`,
        description: project.summary,
        canonicalPath: `/projects/${project.slug}`,
        image: imgPath,
        ogType: 'article',
      };
    }
  }

  const matched = STATIC_ROUTE_META[normalized] || STATIC_ROUTE_META['/'];
  return {
    ...matched,
    canonicalPath: STATIC_ROUTE_META[normalized] ? normalized : '/',
  };
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function usePortfolioSeo(pathname: string): void {
  useEffect(() => {
    const seo = resolveRouteSeo(pathname);
    const canonicalUrl = `${SITE_ORIGIN}${seo.canonicalPath}`;

    document.title = seo.title;
    setMetaTag('name', 'description', seo.description);
    setMetaTag('name', 'robots', 'index, follow');

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    setMetaTag('property', 'og:type', seo.ogType);
    setMetaTag('property', 'og:site_name', PORTFOLIO_PROFILE.name);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:title', seo.title);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:image', seo.image);
    setMetaTag('property', 'og:image:alt', seo.title);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('name', 'twitter:title', seo.title);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'twitter:image', seo.image);

    trackPageView(pathname, seo.title);
  }, [pathname]);
}
