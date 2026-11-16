import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EXPERTISE_AREAS, PORTFOLIO_PROFILE, PROJECTS } from './src/data/portfolioData';

const SITE_ORIGIN = PORTFOLIO_PROFILE.links.portfolio.replace(/\/+$/, '');

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function portfolioSeoBuildPlugin(): Plugin {
  return {
    name: 'portfolio-seo-build-plugin',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const indexPath = resolve(distDir, 'index.html');
      if (!existsSync(indexPath)) return;

      const baseHtml = readFileSync(indexPath, 'utf8');
      const today = new Date().toISOString().slice(0, 10);

      writeFileSync(
        resolve(distDir, 'robots.txt'),
        ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ''].join('\n'),
        'utf8',
      );

      interface StaticRouteSpec {
        path: string;
        priority: string;
        changefreq: string;
        title: string;
        desc: string;
        image: string;
        ogType: 'website' | 'profile' | 'article';
        bodyHtml: string;
      }

      const routes: StaticRouteSpec[] = [
        {
          path: '/',
          priority: '1.0',
          changefreq: 'weekly',
          title: 'Shoaib Tashrif — Full Stack AI Software Engineer',
          desc: 'Shoaib Tashrif is a Full Stack AI Software Engineer building production AI voice agents, LangGraph multi-agent workflows, RAG assistants, DICOM medical AI, and full-stack software.',
          image: `${SITE_ORIGIN}/images/shoaib-hero-workspace.jpg`,
          ogType: 'profile',
          bodyHtml: `<main><h1>${escapeHtml(PORTFOLIO_PROFILE.name)} — ${escapeHtml(PORTFOLIO_PROFILE.title)}</h1><p>${escapeHtml(PORTFOLIO_PROFILE.detailedSummary)}</p><ul>${PROJECTS.map((p) => `<li><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></li>`).join('')}</ul></main>`,
        },
        {
          path: '/expertise',
          priority: '0.9',
          changefreq: 'monthly',
          title: 'Expertise & AI Architecture | Shoaib Tashrif',
          desc: 'Real-time voice AI, LangGraph agentic systems, RAG knowledge retrieval, business automation, and scalable TypeScript/Python engineering by Shoaib Tashrif.',
          image: `${SITE_ORIGIN}/images/engineering-stack.jpg`,
          ogType: 'website',
          bodyHtml: `<main><h1>AI Engineering &amp; Full-Stack Expertise — Shoaib Tashrif</h1>${EXPERTISE_AREAS.map((area) => `<section><h2>${escapeHtml(area.title)}</h2><p>${escapeHtml(area.summary)}</p></section>`).join('')}</main>`,
        },
        {
          path: '/projects',
          priority: '0.9',
          changefreq: 'weekly',
          title: 'AI & Full-Stack Projects | Shoaib Tashrif',
          desc: 'Production case studies by Shoaib Tashrif: Hilum Healthcare & DICOM AI, H2O Water CRM, Sergeant AI Coach, Valyrian Systems cybersecurity, and Executive Ally.',
          image: `${SITE_ORIGIN}/images/hero-ai-architecture.jpg`,
          ogType: 'website',
          bodyHtml: `<main><h1>Production AI &amp; Software Case Studies — Shoaib Tashrif</h1>${PROJECTS.map((p) => `<article><h2><a href="/projects/${escapeHtml(p.slug)}">${escapeHtml(p.title)}</a></h2><p>${escapeHtml(p.summary)}</p></article>`).join('')}</main>`,
        },
        {
          path: '/reviews',
          priority: '0.8',
          changefreq: 'monthly',
          title: 'Client Reviews & Upwork Track Record | Shoaib Tashrif',
          desc: 'Verified 5-star Upwork reviews, Top Rated track record, and 100% Job Success across international AI and full-stack software engagements.',
          image: `${SITE_ORIGIN}/images/shoaib-hero-workspace.jpg`,
          ogType: 'website',
          bodyHtml: `<main><h1>Client Reviews &amp; Verified Track Record — Shoaib Tashrif</h1><p>Top Rated Full Stack AI Software Engineer with 100% Job Success across international clients in the US, Canada, UK, and Australia.</p></main>`,
        },
        {
          path: '/about',
          priority: '0.8',
          changefreq: 'monthly',
          title: 'About Shoaib Tashrif — Full Stack AI Software Engineer',
          desc: '4+ years building production AI systems, voice pipelines, healthcare & cybersecurity platforms for clients in the US, Canada, UK, and Australia.',
          image: `${SITE_ORIGIN}/images/shoaib-whiteboard-architecture.jpg`,
          ogType: 'profile',
          bodyHtml: `<main><h1>About ${escapeHtml(PORTFOLIO_PROFILE.name)}</h1><p>${escapeHtml(PORTFOLIO_PROFILE.detailedSummary)}</p></main>`,
        },
        {
          path: '/contact',
          priority: '0.8',
          changefreq: 'monthly',
          title: 'Contact Shoaib Tashrif | Book a Discovery Call',
          desc: 'Discuss an AI agent, voice pipeline, automation, or full-stack software build with Shoaib Tashrif via Calendly or direct email.',
          image: `${SITE_ORIGIN}/images/shoaib-hero-workspace.jpg`,
          ogType: 'website',
          bodyHtml: `<main><h1>Contact ${escapeHtml(PORTFOLIO_PROFILE.name)}</h1><p>Book a 30-minute discovery call or email ${escapeHtml(PORTFOLIO_PROFILE.email)}.</p></main>`,
        },
        ...PROJECTS.map((p) => {
          const imgPath = p.image?.startsWith('http')
            ? p.image
            : `${SITE_ORIGIN}${p.image?.startsWith('/') ? '' : '/'}${p.image || 'images/shoaib-hero-workspace.jpg'}`;
          return {
            path: `/projects/${p.slug}`,
            priority: '0.8',
            changefreq: 'monthly',
            title: `${p.shortTitle} | Shoaib Tashrif`,
            desc: p.summary,
            image: imgPath,
            ogType: 'article' as const,
            bodyHtml: `<main><h1>${escapeHtml(p.title)}</h1><p>${escapeHtml(p.summary)}</p>${p.overview.map((para) => `<p>${escapeHtml(para)}</p>`).join('')}<h2>Technical Stack</h2><p>${escapeHtml(p.stack.join(', '))}</p></main>`,
          };
        }),
      ];

      const sitemapUrls = routes.map(
        (r) =>
          `  <url>\n    <loc>${SITE_ORIGIN}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
      );
      writeFileSync(
        resolve(distDir, 'sitemap.xml'),
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...sitemapUrls,
          '</urlset>',
          '',
        ].join('\n'),
        'utf8',
      );

      for (const r of routes) {
        const canonical = `${SITE_ORIGIN}${r.path}`;
        const safeTitle = escapeHtml(r.title);
        const safeDesc = escapeHtml(r.desc);
        const safeImg = escapeHtml(r.image);
        const html = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${safeTitle}</title>`)
          .replace(/<meta\s[^>]*?name="description"[^>]*?>/, () => `<meta name="description" content="${safeDesc}" />`)
          .replace(/<link\s[^>]*?rel="canonical"[^>]*?>/, () => `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta\s[^>]*?property="og:type"[^>]*?>/, () => `<meta property="og:type" content="${r.ogType}" />`)
          .replace(/<meta\s[^>]*?property="og:url"[^>]*?>/, () => `<meta property="og:url" content="${canonical}" />`)
          .replace(/<meta\s[^>]*?property="og:title"[^>]*?>/, () => `<meta property="og:title" content="${safeTitle}" />`)
          .replace(/<meta\s[^>]*?property="og:description"[^>]*?>/, () => `<meta property="og:description" content="${safeDesc}" />`)
          .replace(/<meta\s[^>]*?property="og:image"[^>]*?>/, () => `<meta property="og:image" content="${safeImg}" />`)
          .replace(/<meta\s[^>]*?property="og:image:alt"[^>]*?>/, () => `<meta property="og:image:alt" content="${safeTitle}" />`)
          .replace(/<meta\s[^>]*?name="twitter:url"[^>]*?>/, () => `<meta name="twitter:url" content="${canonical}" />`)
          .replace(/<meta\s[^>]*?name="twitter:title"[^>]*?>/, () => `<meta name="twitter:title" content="${safeTitle}" />`)
          .replace(/<meta\s[^>]*?name="twitter:description"[^>]*?>/, () => `<meta name="twitter:description" content="${safeDesc}" />`)
          .replace(/<meta\s[^>]*?name="twitter:image"[^>]*?>/, () => `<meta name="twitter:image" content="${safeImg}" />`)
          .replace(/<div id="root"><\/div>/, () => `<div id="root">${r.bodyHtml}</div>`);

        if (r.path === '/') {
          writeFileSync(indexPath, html, 'utf8');
        } else {
          const targetDir = resolve(distDir, r.path.replace(/^\/+/, ''));
          mkdirSync(targetDir, { recursive: true });
          writeFileSync(resolve(targetDir, 'index.html'), html, 'utf8');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), portfolioSeoBuildPlugin()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
});

