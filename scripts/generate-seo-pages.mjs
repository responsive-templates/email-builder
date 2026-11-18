import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const BASE_URL = 'https://responsive-templates.github.io/email-builder';
const TEMPLATES_PATH = path.resolve(process.cwd(), 'src/templates/templates.json');

const templates = JSON.parse(fs.readFileSync(TEMPLATES_PATH, 'utf8'));

const baseHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');

const staticRoutes = [
  {
    route: '/',
    title: 'Free Email Builder — Create Beautiful HTML Emails',
    description:
      'Build responsive emails with drag & drop. Free HTML export, 20+ responsive email templates, and instant table-based HTML output. No signup required.',
    h1: 'Free Email Builder — Create Beautiful HTML Emails',
    body: 'Build responsive emails with drag & drop. Free HTML export. No signup required.',
    indexable: true,
  },
  {
    route: '/editor/',
    title: 'Visual Email Editor — Free Email Builder',
    description:
      'Drag and drop visual HTML email editor with live desktop & mobile preview and instant table-based HTML export.',
    h1: 'Visual Email Editor',
    body: 'Create and export responsive HTML emails directly in your browser.',
    indexable: false,
  },
  {
    route: '/html-email-builder/',
    title: 'Free HTML Email Builder: Table-Based Responsive HTML Export',
    description:
      'Build email-client-safe HTML emails with table layouts, inline CSS, and MSO Outlook support. Free HTML email builder with instant code export.',
    h1: 'Free HTML Email Builder: Clean Table-Based Code',
    body: 'Design visually and export HTML with inline CSS, MSO conditional comments, and responsive mobile stacking.',
    indexable: true,
  },
  {
    route: '/drag-and-drop-email-builder/',
    title: 'Drag and Drop Email Builder: Visual No-Code Email Editor',
    description:
      'Create responsive emails with a 3-column drag and drop email builder. Edit text inline, switch desktop and mobile views, and export HTML free.',
    h1: 'Drag and Drop Email Builder: No Code Required',
    body: 'Drag blocks onto the canvas, edit copy directly in place, and preview desktop and mobile layouts side by side.',
    indexable: true,
  },
  {
    route: '/email-template-builder/',
    title: 'Email Template Builder: 20 Free Responsive Email Templates',
    description:
      'Start from 20 customizable JSON email templates for welcome flows, promos, ecommerce, and transactional emails. Export HTML or JSON free.',
    h1: 'Email Template Builder: Reusable JSON and HTML Templates',
    body: 'Customize 20 responsive starter templates, save editable JSON blueprints, and export clean HTML directly in your browser.',
    indexable: true,
  },
  {
    route: '/newsletter-builder/',
    title: 'Free Newsletter Builder: Design Responsive Email Newsletters',
    description:
      'Build weekly digests, product updates, and creator newsletters with a free newsletter builder. Drag and drop columns and export HTML.',
    h1: 'Free Newsletter Builder for Readable Digests',
    body: 'Build readable newsletters with multi-column highlights, preheader text, and mobile-responsive HTML export.',
    indexable: true,
  },
  {
    route: '/templates/',
    title: 'Free Responsive Email Templates (20+ Designs)',
    description:
      'Browse 20+ free responsive HTML email templates for newsletters, welcome emails, promos, Black Friday, ecommerce, and transactional emails.',
    h1: 'Free Responsive Email Templates',
    body: 'Choose from 20 mobile-ready HTML email templates across 7 categories.',
    indexable: true,
  },
  {
    route: '/templates/newsletter/',
    title: 'Free Newsletter Email Templates',
    description:
      'Responsive newsletter templates for weekly digests, product changelogs, and editorial briefings. Customize and export HTML free.',
    h1: 'Free Newsletter Email Templates',
    body: 'Responsive newsletter templates ready to customize in our drag & drop email builder.',
    indexable: true,
  },
  {
    route: '/templates/welcome-email/',
    title: 'Free Welcome Email Templates',
    description:
      'Onboarding and welcome email templates for SaaS, communities, and creators. Edit with drag and drop and export HTML.',
    h1: 'Free Welcome Email Templates',
    body: 'Warm onboarding and welcome email templates with responsive table-based HTML export.',
    indexable: true,
  },
  {
    route: '/templates/promotional-email/',
    title: 'Free Promotional Email Templates',
    description:
      'Promotional email templates for product launches, flash sales, and VIP offers with mobile-ready table HTML output.',
    h1: 'Free Promotional Email Templates',
    body: 'Promotional email templates built for product launches, flash offers, and high click-through rates.',
    indexable: true,
  },
  {
    route: '/templates/black-friday-email/',
    title: 'Free Black Friday and Sale Email Templates',
    description:
      'High-contrast Black Friday, Cyber Monday, and holiday clearance email templates ready to edit and export.',
    h1: 'Free Black Friday and Sale Email Templates',
    body: 'Bold Black Friday, Cyber Monday, and clearance email templates ready to edit and export.',
    indexable: true,
  },
  {
    route: '/templates/ecommerce/',
    title: 'Free Ecommerce Email Templates',
    description:
      'Order confirmations, abandoned cart reminders, and back-in-stock alerts with clean responsive layouts.',
    h1: 'Free Ecommerce Email Templates',
    body: 'Ecommerce email templates for order confirmations, abandoned carts, and restock alerts.',
    indexable: true,
  },
  {
    route: '/templates/transactional-email/',
    title: 'Free Transactional Email Templates',
    description:
      'Reliable password reset, invoice receipt, and account verification email templates compatible with all major email clients.',
    h1: 'Free Transactional Email Templates',
    body: 'Transactional email templates for password resets, billing receipts, and account verification.',
    indexable: true,
  },
  {
    route: '/templates/event-invitation/',
    title: 'Free Event Invitation Email Templates',
    description:
      'Webinar, conference, and keynote invitation templates with clear event details and RSVP buttons.',
    h1: 'Free Event Invitation Email Templates',
    body: 'Event and webinar invitation email templates ready for instant HTML export.',
    indexable: true,
  },
];

for (const tpl of templates) {
  staticRoutes.push({
    route: `/templates/${tpl.slug}/`,
    title: `${tpl.name} — Free Responsive Email Template`,
    description: tpl.description,
    h1: tpl.name,
    body: `${tpl.description} Category: ${tpl.category}. Edit this template free in our visual email builder.`,
    indexable: true,
  });
}

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtmlForRoute(entry) {
  const canonicalUrl = `${BASE_URL}${entry.route}`;
  let html = baseHtml;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeAttr(entry.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${escapeAttr(entry.description)}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${escapeAttr(entry.title)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${escapeAttr(entry.description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/,
    `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`,
  );

  const noscriptBlock = `<noscript><main style="max-width:800px;margin:40px auto;font-family:sans-serif;padding:0 16px;"><h1>${escapeAttr(entry.h1)}</h1><p>${escapeAttr(entry.body)}</p></main></noscript>`;
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscriptBlock}`);

  return html;
}

for (const entry of staticRoutes) {
  const html = buildHtmlForRoute(entry);
  const relPath = entry.route === '/' ? 'index.html' : path.join(entry.route.slice(1), 'index.html');
  const outFile = path.join(DIST_DIR, relPath);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
}

// 404 fallback
fs.copyFileSync(path.join(DIST_DIR, 'index.html'), path.join(DIST_DIR, '404.html'));

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemapUrls = staticRoutes
  .filter((r) => r.indexable)
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r.route === '/' ? '1.0' : r.route.split('/').length <= 3 ? '0.9' : '0.8'}</priority>
  </url>`,
  )
  .join('\n');

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>
`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

// robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt);

console.log(`Generated ${staticRoutes.length} static SEO pages, sitemap.xml, and robots.txt in dist/`);
