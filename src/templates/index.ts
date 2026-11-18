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
      'Onboarding and welcome email templates for SaaS, communities, and creators. Edit with drag and drop and export HTML.',
  },
  {
    name: 'Promotional Email',
    slug: 'promotional-email',
    title: 'Free Promotional Email Templates',
    description:
      'Promotional email templates for product launches, flash sales, and VIP offers with mobile-ready table HTML output.',
  },
  {
    name: 'Black Friday / Sale',
    slug: 'black-friday-email',
    title: 'Free Black Friday and Sale Email Templates',
    description:
      'High-contrast Black Friday, Cyber Monday, and holiday clearance email templates ready to edit and export.',
  },
  {
    name: 'Ecommerce',
    slug: 'ecommerce',
    title: 'Free Ecommerce Email Templates',
    description:
      'Order confirmations, abandoned cart reminders, and back-in-stock alerts with responsive table layouts.',
  },
  {
    name: 'Transactional Email',
    slug: 'transactional-email',
    title: 'Free Transactional Email Templates',
    description:
      'Password reset, invoice receipt, and account verification email templates compatible with major email clients.',
  },
  {
    name: 'Event Invitation',
    slug: 'event-invitation',
    title: 'Free Event Invitation Email Templates',
    description:
      'Webinar, conference, and keynote invitation templates with event details and RSVP buttons.',
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
