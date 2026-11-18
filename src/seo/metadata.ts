export const SITE_ORIGIN = 'https://responsive-templates.github.io';
export const BASE_PATH = (import.meta.env.BASE_URL || '/email-builder/').replace(/\/+$/, '');

export function toAppUrl(routePath: string): string {
  const normalized = routePath.startsWith('/') ? routePath : `/${routePath}`;
  return `${BASE_PATH}${normalized}`;
}

export function stripBasePath(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const stripped = pathname.slice(BASE_PATH.length);
    return stripped.startsWith('/') ? stripped : `/${stripped}`;
  }
  return pathname || '/';
}

export interface SeoPageConfig {
  path: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  badge: string;
  primaryKeyword: string;
  highlights: Array<{ title: string; body: string }>;
  faq: Array<{ q: string; a: string }>;
  categoryFilterSlug?: string;
}

export const SEO_LANDING_PAGES: Record<string, SeoPageConfig> = {
  '/html-email-builder/': {
    path: '/html-email-builder/',
    title: 'Free HTML Email Builder: Table-Based Responsive HTML Export',
    description:
      'Build email-client-safe HTML emails with table layouts, inline CSS, and MSO Outlook support. Free HTML email builder with instant code export.',
    h1: 'Free HTML Email Builder: Clean Table-Based Code',
    subtitle:
      'Design visually and export HTML with inline CSS, MSO conditional comments, and responsive mobile stacking.',
    badge: 'HTML Email Builder',
    primaryKeyword: 'html email builder',
    highlights: [
      {
        title: 'Table-Based Email Markup',
        body: 'Every section compiles to role="presentation" tables with explicit cellpadding, cellspacing, and inline CSS instead of web flexbox.',
      },
      {
        title: 'Outlook and Gmail Compatible',
        body: 'Includes MSO conditional wrapper tables for Outlook Desktop and @media rules for Apple Mail, iOS, and Gmail.',
      },
      {
        title: 'One-Click Copy or Download',
        body: 'Inspect the compiled HTML source, copy it to your clipboard, or download a standalone .html file for any email service.',
      },
    ],
    faq: [
      {
        q: 'Why does the HTML email builder use tables instead of CSS Grid?',
        a: 'Desktop email clients like Microsoft Outlook use Word’s rendering engine, which ignores CSS Grid and Flexbox. Table layouts keep spacing and alignment consistent across clients.',
      },
      {
        q: 'Can I import the exported HTML into Mailchimp, SendGrid, or Postmark?',
        a: 'Yes. The exported HTML is self-contained with inline styles and works in any ESP or custom SMTP pipeline.',
      },
    ],
  },
  '/drag-and-drop-email-builder/': {
    path: '/drag-and-drop-email-builder/',
    title: 'Drag and Drop Email Builder: Visual No-Code Email Editor',
    description:
      'Create responsive emails with a 3-column drag and drop email builder. Edit text inline, switch desktop and mobile views, and export HTML free.',
    h1: 'Drag and Drop Email Builder: No Code Required',
    subtitle:
      'Drag blocks onto the canvas, edit copy directly in place, and preview desktop and mobile layouts side by side.',
    badge: 'Drag & Drop Editor',
    primaryKeyword: 'drag and drop email builder',
    highlights: [
      {
        title: '3-Column Visual Workspace',
        body: 'Pick blocks from the left palette, arrange them on the center canvas, and adjust typography, colors, and padding on the right.',
      },
      {
        title: 'Direct Inline Text Editing',
        body: 'Click any heading, paragraph, or button inside the email preview to rewrite copy directly on the canvas.',
      },
      {
        title: 'Undo, Redo, and Auto-Save',
        body: 'Step back or forward through 50 edits while your draft saves automatically to browser localStorage.',
      },
    ],
    faq: [
      {
        q: 'Do I need to create an account to use the drag and drop editor?',
        a: 'No. Click Start Building and begin designing right away. Your work saves automatically in your browser.',
      },
      {
        q: 'Can I reorder and duplicate blocks?',
        a: 'Yes. Drag any block to a new position or use the block toolbar to move up, move down, duplicate, or delete.',
      },
    ],
  },
  '/email-template-builder/': {
    path: '/email-template-builder/',
    title: 'Email Template Builder: 20 Free Responsive Email Templates',
    description:
      'Start from 20 customizable JSON email templates for welcome flows, promos, ecommerce, and transactional emails. Export HTML or JSON free.',
    h1: 'Email Template Builder: Reusable JSON and HTML Templates',
    subtitle:
      'Customize 20 responsive starter templates, save editable JSON blueprints, and export clean HTML directly in your browser.',
    badge: 'Email Template Builder',
    primaryKeyword: 'email template builder',
    highlights: [
      {
        title: '20 Responsive Starter Templates',
        body: 'Includes welcome emails, newsletters, Black Friday promos, order receipts, password resets, and webinar invitations.',
      },
      {
        title: 'Portable JSON Project Files',
        body: 'Export your design as a JSON file to share with teammates or re-import later to continue editing.',
      },
      {
        title: 'Global Brand Styling',
        body: 'Update canvas background, content width, font family, and button colors across your template from one panel.',
      },
    ],
    faq: [
      {
        q: 'Are all email templates free for commercial use?',
        a: 'Yes. All templates are free to customize, export as HTML, and send in commercial or personal campaigns.',
      },
      {
        q: 'How do I save a template to edit later?',
        a: 'Your active draft auto-saves in your browser, and you can also click Export JSON to save a backup file.',
      },
    ],
  },
  '/newsletter-builder/': {
    path: '/newsletter-builder/',
    title: 'Free Newsletter Builder: Design Responsive Email Newsletters',
    description:
      'Build weekly digests, product updates, and creator newsletters with a free newsletter builder. Drag and drop columns and export HTML.',
    h1: 'Free Newsletter Builder for Readable Digests',
    subtitle:
      'Build readable newsletters with multi-column highlights, preheader text, and mobile-responsive HTML export.',
    badge: 'Newsletter Builder',
    primaryKeyword: 'newsletter builder',
    categoryFilterSlug: 'newsletter',
    highlights: [
      {
        title: 'Multi-Column Digest Layouts',
        body: 'Drop 2-column or 3-column sections to organize articles, product updates, and links.',
      },
      {
        title: 'Inbox Preheader Settings',
        body: 'Set your subject line and hidden preheader text in Email Settings to control how your email appears in Gmail and Apple Mail.',
      },
      {
        title: 'Social and Footer Blocks',
        body: 'Add social icon rows and footer blocks with your company address and unsubscribe link.',
      },
    ],
    faq: [
      {
        q: 'Do newsletter columns stack on mobile phones?',
        a: 'Yes. The compiled HTML includes @media queries that stack multi-column rows on screens under 620px.',
      },
      {
        q: 'Can I preview how my newsletter looks on mobile before exporting?',
        a: 'Yes. Toggle between Desktop (600px) and Mobile (375px) views in the editor and preview modal.',
      },
    ],
  },
};
