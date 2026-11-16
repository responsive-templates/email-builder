import templatesData from './templates.json';
import type { EmailTemplateMeta } from '../email/types';

export const TEMPLATES: EmailTemplateMeta[] = templatesData as EmailTemplateMeta[];

export interface TemplateCategoryInfo {
  name: EmailTemplateMeta['category'];
  slug: string;
  title: string;
  description: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategoryInfo[] = [
  {
    name: 'Newsletter',
    slug: 'newsletter',
    title: 'Free Newsletter Email Templates',
    description:
      'Responsive newsletter templates for weekly digests, product changelogs, and editorial briefings. Customize and export HTML free.',
  },
  {
    name: 'Welcome Email',
    slug: 'welcome-email',
    title: 'Free Welcome Email Templates',
    description:
      'High-converting onboarding and welcome email templates for SaaS, communities, and creators. Edit with drag & drop and export HTML.',
  },
  {
    name: 'Promotional Email',
    slug: 'promotional-email',
    title: 'Free Promotional Email Templates',
    description:
      'Eye-catching promotional email templates for product launches, flash sales, and VIP offers. Mobile-ready table HTML output.',
  },
  {
    name: 'Black Friday / Sale',
    slug: 'black-friday-email',
    title: 'Free Black Friday & Sale Email Templates',
    description:
      'High-contrast Black Friday, Cyber Monday, and holiday clearance email templates built for maximum click-through rates.',
  },
  {
    name: 'Ecommerce',
    slug: 'ecommerce',
    title: 'Free Ecommerce Email Templates',
    description:
      'Order confirmations, abandoned cart reminders, and back-in-stock alerts with clean responsive layouts.',
  },
  {
    name: 'Transactional Email',
    slug: 'transactional-email',
    title: 'Free Transactional Email Templates',
    description:
      'Reliable password reset, invoice receipt, and account verification email templates compatible with all major email clients.',
  },
  {
    name: 'Event Invitation',
    slug: 'event-invitation',
    title: 'Free Event Invitation Email Templates',
    description:
      'Webinar, conference, and keynote invitation templates with clear event details and RSVP buttons.',
  },
];

export function getTemplateBySlug(slug: string): EmailTemplateMeta | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplatesByCategorySlug(categorySlug: string): EmailTemplateMeta[] {
  return TEMPLATES.filter((t) => t.categorySlug === categorySlug);
}

export function getCategoryBySlug(categorySlug: string): TemplateCategoryInfo | undefined {
  return TEMPLATE_CATEGORIES.find((c) => c.slug === categorySlug);
}
