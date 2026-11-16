import type {
  BlockType,
  EmailBlock,
  EmailDocument,
  EmailSettings,
  LeafBlock,
} from './types';

let idCounter = 0;

export function generateId(prefix = 'blk'): string {
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}_${Date.now().toString(36)}_${idCounter}_${rand}`;
}

export const DEFAULT_EMAIL_SETTINGS: EmailSettings = {
  subject: 'Your Email Subject',
  preheader: 'Preview text shown in the inbox next to your subject line.',
  canvasColor: '#f1f5f9',
  contentBackgroundColor: '#ffffff',
  contentWidth: 600,
  fontFamily: 'Arial, Helvetica, sans-serif',
  textColor: '#1e293b',
  linkColor: '#4f46e5',
};

export function createLeafBlock(type: Exclude<BlockType, 'columns'>): LeafBlock {
  const id = generateId(type);
  switch (type) {
    case 'header':
      return {
        id,
        type: 'header',
        props: {
          logoText: 'ACME STUDIO',
          logoImageUrl: '',
          logoWidth: 140,
          showNav: true,
          navLinks: [
            { label: 'Features', url: 'https://example.com/features' },
            { label: 'Pricing', url: 'https://example.com/pricing' },
            { label: 'Blog', url: 'https://example.com/blog' },
          ],
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          alignment: 'left',
          padding: { top: 20, right: 28, bottom: 20, left: 28 },
        },
      };
    case 'heading':
      return {
        id,
        type: 'heading',
        props: {
          text: 'Write a compelling headline here',
          level: 'h1',
          fontSize: 28,
          fontWeight: '700',
          color: '#0f172a',
          backgroundColor: 'transparent',
          alignment: 'left',
          lineHeight: 1.25,
          padding: { top: 16, right: 28, bottom: 8, left: 28 },
        },
      };
    case 'text':
      return {
        id,
        type: 'text',
        props: {
          text: 'Share your message clearly. Keep paragraphs short, scannable, and focused on one key action for your readers.',
          fontSize: 16,
          color: '#334155',
          backgroundColor: 'transparent',
          alignment: 'left',
          lineHeight: 1.6,
          padding: { top: 8, right: 28, bottom: 16, left: 28 },
        },
      };
    case 'image':
      return {
        id,
        type: 'image',
        props: {
          src: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80',
          alt: 'Featured email visual',
          href: 'https://example.com',
          widthPercent: 100,
          borderRadius: 8,
          alignment: 'center',
          backgroundColor: 'transparent',
          padding: { top: 12, right: 28, bottom: 12, left: 28 },
        },
      };
    case 'button':
      return {
        id,
        type: 'button',
        props: {
          label: 'Get Started Free',
          href: 'https://example.com',
          backgroundColor: '#4f46e5',
          textColor: '#ffffff',
          containerBackgroundColor: 'transparent',
          fontSize: 15,
          fontWeight: '700',
          borderRadius: 8,
          paddingX: 28,
          paddingY: 14,
          alignment: 'center',
          fullWidth: false,
          padding: { top: 14, right: 28, bottom: 18, left: 28 },
        },
      };
    case 'divider':
      return {
        id,
        type: 'divider',
        props: {
          color: '#e2e8f0',
          thickness: 1,
          widthPercent: 100,
          style: 'solid',
          backgroundColor: 'transparent',
          padding: { top: 12, right: 28, bottom: 12, left: 28 },
        },
      };
    case 'spacer':
      return {
        id,
        type: 'spacer',
        props: {
          height: 24,
          backgroundColor: 'transparent',
        },
      };
    case 'social':
      return {
        id,
        type: 'social',
        props: {
          links: [
            { platform: 'twitter', url: 'https://twitter.com', label: 'X / Twitter' },
            { platform: 'linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
            { platform: 'instagram', url: 'https://instagram.com', label: 'Instagram' },
            { platform: 'website', url: 'https://example.com', label: 'Website' },
          ],
          iconStyle: 'rounded',
          iconColor: '#ffffff',
          iconBackgroundColor: '#334155',
          backgroundColor: 'transparent',
          alignment: 'center',
          padding: { top: 16, right: 28, bottom: 16, left: 28 },
        },
      };
    case 'footer':
      return {
        id,
        type: 'footer',
        props: {
          companyName: 'Acme Studio Inc.',
          address: '548 Market St, San Francisco, CA 94104',
          unsubscribeText: 'Unsubscribe from these emails',
          unsubscribeUrl: '{{unsubscribe_url}}',
          extraText: 'You received this email because you subscribed on our website.',
          backgroundColor: '#f8fafc',
          textColor: '#64748b',
          fontSize: 12,
          alignment: 'center',
          padding: { top: 24, right: 28, bottom: 24, left: 28 },
        },
      };
  }
}

export function createBlock(type: BlockType, columnCount: 2 | 3 = 2): EmailBlock {
  if (type === 'columns') {
    const columns: LeafBlock[][] = Array.from({ length: columnCount }, (_, idx) => {
      const heading = createLeafBlock('heading') as Extract<LeafBlock, { type: 'heading' }>;
      const text = createLeafBlock('text') as Extract<LeafBlock, { type: 'text' }>;
      return [
        {
          ...heading,
          props: {
            ...heading.props,
            text: `Feature ${idx + 1}`,
            level: 'h3',
            fontSize: 18,
            padding: { top: 8, right: 12, bottom: 4, left: 12 },
          },
        },
        {
          ...text,
          props: {
            ...text.props,
            text: 'Describe this highlight concisely for mobile and desktop readers.',
            fontSize: 14,
            padding: { top: 4, right: 12, bottom: 8, left: 12 },
          },
        },
      ];
    });
    return {
      id: generateId('columns'),
      type: 'columns',
      props: {
        columnCount,
        gap: 16,
        backgroundColor: 'transparent',
        padding: { top: 12, right: 20, bottom: 12, left: 20 },
        columns,
      },
    };
  }
  return createLeafBlock(type);
}

export function cloneBlock(block: EmailBlock): EmailBlock {
  const copy = JSON.parse(JSON.stringify(block)) as EmailBlock;
  copy.id = generateId(copy.type);
  if (copy.type === 'columns') {
    copy.props.columns = copy.props.columns.map((col) =>
      col.map((child) => ({
        ...child,
        id: generateId(child.type),
      })),
    );
  }
  return copy;
}

export function createBlankDocument(name = 'Untitled Email'): EmailDocument {
  return {
    version: 1,
    name,
    settings: { ...DEFAULT_EMAIL_SETTINGS },
    blocks: [
      createLeafBlock('header'),
      createLeafBlock('heading'),
      createLeafBlock('text'),
      createLeafBlock('button'),
      createLeafBlock('footer'),
    ],
  };
}
