export type BlockType =
  | 'header'
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'columns'
  | 'divider'
  | 'spacer'
  | 'social'
  | 'footer';

export type Alignment = 'left' | 'center' | 'right';

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface EmailSettings {
  subject: string;
  preheader: string;
  canvasColor: string;
  contentBackgroundColor: string;
  contentWidth: number;
  fontFamily: string;
  textColor: string;
  linkColor: string;
}

export interface HeaderBlockProps {
  logoText: string;
  logoImageUrl: string;
  logoWidth: number;
  showNav: boolean;
  navLinks: Array<{ label: string; url: string }>;
  backgroundColor: string;
  textColor: string;
  alignment: Alignment;
  padding: Padding;
}

export interface HeadingBlockProps {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  fontSize: number;
  fontWeight: '600' | '700' | '800';
  color: string;
  backgroundColor: string;
  alignment: Alignment;
  lineHeight: number;
  padding: Padding;
}

export interface TextBlockProps {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  alignment: Alignment;
  lineHeight: number;
  padding: Padding;
}

export interface ImageBlockProps {
  src: string;
  alt: string;
  href: string;
  widthPercent: number;
  borderRadius: number;
  alignment: Alignment;
  backgroundColor: string;
  padding: Padding;
}

export interface ButtonBlockProps {
  label: string;
  href: string;
  backgroundColor: string;
  textColor: string;
  containerBackgroundColor: string;
  fontSize: number;
  fontWeight: '600' | '700';
  borderRadius: number;
  paddingX: number;
  paddingY: number;
  alignment: Alignment;
  fullWidth: boolean;
  padding: Padding;
}

export interface DividerBlockProps {
  color: string;
  thickness: number;
  widthPercent: number;
  style: 'solid' | 'dashed' | 'dotted';
  backgroundColor: string;
  padding: Padding;
}

export interface SpacerBlockProps {
  height: number;
  backgroundColor: string;
}

export type SocialPlatform =
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'github'
  | 'website';

export interface SocialLinkItem {
  platform: SocialPlatform;
  url: string;
  label: string;
}

export interface SocialBlockProps {
  links: SocialLinkItem[];
  iconStyle: 'rounded' | 'circle' | 'outline';
  iconColor: string;
  iconBackgroundColor: string;
  backgroundColor: string;
  alignment: Alignment;
  padding: Padding;
}

export interface FooterBlockProps {
  companyName: string;
  address: string;
  unsubscribeText: string;
  unsubscribeUrl: string;
  extraText: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  alignment: Alignment;
  padding: Padding;
}

export type LeafBlock =
  | { id: string; type: 'header'; props: HeaderBlockProps }
  | { id: string; type: 'heading'; props: HeadingBlockProps }
  | { id: string; type: 'text'; props: TextBlockProps }
  | { id: string; type: 'image'; props: ImageBlockProps }
  | { id: string; type: 'button'; props: ButtonBlockProps }
  | { id: string; type: 'divider'; props: DividerBlockProps }
  | { id: string; type: 'spacer'; props: SpacerBlockProps }
  | { id: string; type: 'social'; props: SocialBlockProps }
  | { id: string; type: 'footer'; props: FooterBlockProps };

export interface ColumnsBlockProps {
  columnCount: 2 | 3;
  gap: number;
  backgroundColor: string;
  padding: Padding;
  columns: LeafBlock[][];
}

export type EmailBlock =
  | LeafBlock
  | { id: string; type: 'columns'; props: ColumnsBlockProps };

export interface EmailDocument {
  version: 1;
  name: string;
  settings: EmailSettings;
  blocks: EmailBlock[];
}

export interface EmailTemplateMeta {
  id: string;
  slug: string;
  name: string;
  category:
    | 'Newsletter'
    | 'Welcome Email'
    | 'Promotional Email'
    | 'Black Friday / Sale'
    | 'Ecommerce'
    | 'Transactional Email'
    | 'Event Invitation';
  categorySlug: string;
  description: string;
  accentColor: string;
  tags: string[];
  document: EmailDocument;
}
