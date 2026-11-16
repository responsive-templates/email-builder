import fs from 'node:fs';
import path from 'node:path';

const pad = (top = 12, right = 28, bottom = 12, left = 28) => ({ top, right, bottom, left });

const baseSettings = (overrides = {}) => ({
  subject: 'Email Subject',
  preheader: 'Preview text for inbox.',
  canvasColor: '#f1f5f9',
  contentBackgroundColor: '#ffffff',
  contentWidth: 600,
  fontFamily: 'Arial, Helvetica, sans-serif',
  textColor: '#1e293b',
  linkColor: '#4f46e5',
  ...overrides,
});

const headerBlock = (id, logoText, opts = {}) => ({
  id: `${id}_hdr`,
  type: 'header',
  props: {
    logoText,
    logoImageUrl: '',
    logoWidth: 140,
    showNav: opts.showNav ?? true,
    navLinks: opts.navLinks ?? [
      { label: 'Website', url: 'https://example.com' },
      { label: 'Docs', url: 'https://example.com/docs' },
    ],
    backgroundColor: opts.backgroundColor ?? '#ffffff',
    textColor: opts.textColor ?? '#0f172a',
    alignment: opts.alignment ?? 'left',
    padding: pad(20, 28, 20, 28),
  },
});

const headingBlock = (id, text, opts = {}) => ({
  id,
  type: 'heading',
  props: {
    text,
    level: opts.level ?? 'h1',
    fontSize: opts.fontSize ?? 28,
    fontWeight: opts.fontWeight ?? '700',
    color: opts.color ?? '#0f172a',
    backgroundColor: opts.backgroundColor ?? 'transparent',
    alignment: opts.alignment ?? 'left',
    lineHeight: 1.25,
    padding: opts.padding ?? pad(16, 28, 8, 28),
  },
});

const textBlock = (id, text, opts = {}) => ({
  id,
  type: 'text',
  props: {
    text,
    fontSize: opts.fontSize ?? 16,
    color: opts.color ?? '#334155',
    backgroundColor: opts.backgroundColor ?? 'transparent',
    alignment: opts.alignment ?? 'left',
    lineHeight: opts.lineHeight ?? 1.6,
    padding: opts.padding ?? pad(8, 28, 16, 28),
  },
});

const imageBlock = (id, src, alt, opts = {}) => ({
  id,
  type: 'image',
  props: {
    src,
    alt,
    href: opts.href ?? 'https://example.com',
    widthPercent: opts.widthPercent ?? 100,
    borderRadius: opts.borderRadius ?? 8,
    alignment: opts.alignment ?? 'center',
    backgroundColor: opts.backgroundColor ?? 'transparent',
    padding: opts.padding ?? pad(8, 28, 16, 28),
  },
});

const buttonBlock = (id, label, opts = {}) => ({
  id,
  type: 'button',
  props: {
    label,
    href: opts.href ?? 'https://example.com',
    backgroundColor: opts.backgroundColor ?? '#4f46e5',
    textColor: opts.textColor ?? '#ffffff',
    containerBackgroundColor: opts.containerBackgroundColor ?? 'transparent',
    fontSize: opts.fontSize ?? 15,
    fontWeight: '700',
    borderRadius: opts.borderRadius ?? 8,
    paddingX: opts.paddingX ?? 28,
    paddingY: opts.paddingY ?? 14,
    alignment: opts.alignment ?? 'center',
    fullWidth: opts.fullWidth ?? false,
    padding: opts.padding ?? pad(12, 28, 20, 28),
  },
});

const dividerBlock = (id, color = '#e2e8f0') => ({
  id,
  type: 'divider',
  props: {
    color,
    thickness: 1,
    widthPercent: 100,
    style: 'solid',
    backgroundColor: 'transparent',
    padding: pad(10, 28, 10, 28),
  },
});

const spacerBlock = (id, height = 16) => ({
  id,
  type: 'spacer',
  props: {
    height,
    backgroundColor: 'transparent',
  },
});

const columnsBlock = (id, columnCount, columns, opts = {}) => ({
  id,
  type: 'columns',
  props: {
    columnCount,
    gap: 16,
    backgroundColor: opts.backgroundColor ?? 'transparent',
    padding: opts.padding ?? pad(8, 20, 12, 20),
    columns,
  },
});

const socialBlock = (id, iconBackgroundColor = '#334155', bg = 'transparent') => ({
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
    iconBackgroundColor,
    backgroundColor: bg,
    alignment: 'center',
    padding: pad(14, 28, 14, 28),
  },
});

const footerBlock = (id, companyName, opts = {}) => ({
  id,
  type: 'footer',
  props: {
    companyName,
    address: opts.address ?? '548 Market St, San Francisco, CA 94104',
    unsubscribeText: opts.unsubscribeText ?? 'Unsubscribe from these emails',
    unsubscribeUrl: '{{unsubscribe_url}}',
    extraText: opts.extraText ?? 'You received this email because you signed up on our website.',
    backgroundColor: opts.backgroundColor ?? '#f8fafc',
    textColor: opts.textColor ?? '#64748b',
    fontSize: 12,
    alignment: 'center',
    padding: pad(22, 28, 24, 28),
  },
});

const templates = [
  // 1. Newsletter (3)
  {
    id: 'tpl_weekly_tech_digest',
    slug: 'weekly-tech-digest',
    name: 'Weekly Tech Digest',
    category: 'Newsletter',
    categorySlug: 'newsletter',
    description: 'Clean multi-section newsletter layout with featured story, 2-column highlights, and CTA.',
    accentColor: '#4f46e5',
    tags: ['newsletter', 'digest', 'editorial', '2-column'],
    document: {
      version: 1,
      name: 'Weekly Tech Digest',
      settings: baseSettings({
        subject: 'Issue #42: AI Agents, Web Performance & Design Systems',
        preheader: 'Top engineering & product reads curated for your week.',
      }),
      blocks: [
        headerBlock('wtd', 'DEVWEEKLY', {
          navLinks: [
            { label: 'Archive', url: 'https://example.com/archive' },
            { label: 'Submit Link', url: 'https://example.com/submit' },
          ],
        }),
        imageBlock(
          'wtd_hero',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          'Weekly Tech Digest Banner',
        ),
        headingBlock('wtd_h1', 'This Week in Modern Web Engineering', { fontSize: 26 }),
        textBlock(
          'wtd_p1',
          'Welcome to Issue #42. We rounded up the most practical benchmarks on edge caching, email-safe CSS layouts, and lightweight TypeScript tooling.',
        ),
        buttonBlock('wtd_btn', 'Read the Full Issue', { alignment: 'left', backgroundColor: '#4f46e5' }),
        dividerBlock('wtd_div'),
        columnsBlock('wtd_cols', 2, [
          [
            headingBlock('wtd_c1h', '01. Faster Builds', { level: 'h3', fontSize: 17, padding: pad(4, 8, 4, 8) }),
            textBlock('wtd_c1p', 'How teams cut CI bundle times by 60% using incremental ESM builds.', {
              fontSize: 14,
              padding: pad(4, 8, 8, 8),
            }),
          ],
          [
            headingBlock('wtd_c2h', '02. Email Accessibility', { level: 'h3', fontSize: 17, padding: pad(4, 8, 4, 8) }),
            textBlock('wtd_c2p', 'Why semantic role="presentation" tables still rule Outlook and Gmail.', {
              fontSize: 14,
              padding: pad(4, 8, 8, 8),
            }),
          ],
        ]),
        socialBlock('wtd_soc', '#4f46e5'),
        footerBlock('wtd_ftr', 'DevWeekly Media'),
      ],
    },
  },
  {
    id: 'tpl_saas_product_changelog',
    slug: 'saas-product-changelog',
    name: 'SaaS Product Changelog',
    category: 'Newsletter',
    categorySlug: 'newsletter',
    description: 'Monthly product update newsletter highlighting new features, improvements, and release notes.',
    accentColor: '#0ea5e9',
    tags: ['changelog', 'saas', 'product-update', 'newsletter'],
    document: {
      version: 1,
      name: 'SaaS Product Changelog',
      settings: baseSettings({
        subject: 'What’s New in FlowDesk — November Release',
        preheader: 'Faster automation rules, dark mode, and 12 new integrations.',
        linkColor: '#0284c7',
      }),
      blocks: [
        headerBlock('spc', 'FLOWDESK', { backgroundColor: '#0f172a', textColor: '#ffffff', showNav: false, alignment: 'center' }),
        headingBlock('spc_h1', 'November Product Updates', { fontSize: 28, alignment: 'center', padding: pad(24, 28, 8, 28) }),
        textBlock('spc_p1', 'We shipped 3 major workflow upgrades this month to help your team save hours every week.', {
          alignment: 'center',
        }),
        imageBlock(
          'spc_img',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          'Analytics dashboard preview',
        ),
        headingBlock('spc_h2', 'Real-Time Analytics & Custom Alerts', { level: 'h2', fontSize: 20 }),
        textBlock('spc_p2', 'Track conversion funnels in real time and trigger Slack or webhook notifications whenever key thresholds are met.'),
        buttonBlock('spc_btn', 'Explore Release Notes', { backgroundColor: '#0284c7' }),
        dividerBlock('spc_div'),
        footerBlock('spc_ftr', 'FlowDesk Inc.'),
      ],
    },
  },
  {
    id: 'tpl_morning_editorial_brief',
    slug: 'morning-editorial-brief',
    name: 'Morning Editorial Brief',
    category: 'Newsletter',
    categorySlug: 'newsletter',
    description: 'Minimalist reader-first newsletter designed for creators, writers, and daily briefings.',
    accentColor: '#0f172a',
    tags: ['editorial', 'minimal', 'creator', 'newsletter'],
    document: {
      version: 1,
      name: 'Morning Editorial Brief',
      settings: baseSettings({
        subject: 'The Morning Brief: 3 Shifts Shaping Remote Work',
        preheader: '5-minute read with zero fluff.',
        canvasColor: '#f8fafc',
      }),
      blocks: [
        headerBlock('meb', 'THE MORNING BRIEF', { alignment: 'center', showNav: false }),
        dividerBlock('meb_d1', '#0f172a'),
        headingBlock('meb_h1', '3 Shifts Shaping Remote Teams in 2026', { fontSize: 26 }),
        textBlock(
          'meb_p1',
          'Good morning! Today we look at async-first documentation, smaller autonomous squads, and why live audio rooms are replacing status meetings.',
        ),
        headingBlock('meb_h2', '1. Written clarity beats calendar density', { level: 'h2', fontSize: 19 }),
        textBlock(
          'meb_p2',
          'Teams that publish crisp weekly memos report 34% fewer ad-hoc syncs and faster onboarding for new hires.',
        ),
        buttonBlock('meb_btn', 'Read Full Essay', { backgroundColor: '#0f172a', alignment: 'left' }),
        socialBlock('meb_soc', '#0f172a'),
        footerBlock('meb_ftr', 'Morning Brief Publishing'),
      ],
    },
  },

  // 2. Welcome Email (3)
  {
    id: 'tpl_saas_onboarding_welcome',
    slug: 'saas-onboarding-welcome',
    name: 'SaaS Onboarding Welcome',
    category: 'Welcome Email',
    categorySlug: 'welcome-email',
    description: 'Warm onboarding welcome email with a 3-step quickstart checklist and primary CTA.',
    accentColor: '#6366f1',
    tags: ['welcome', 'onboarding', 'saas', '3-column'],
    document: {
      version: 1,
      name: 'SaaS Onboarding Welcome',
      settings: baseSettings({
        subject: 'Welcome to Launchpad! Here is how to get started',
        preheader: 'Your workspace is ready — complete 3 quick steps.',
      }),
      blocks: [
        headerBlock('sow', 'LAUNCHPAD', { alignment: 'center', showNav: false, backgroundColor: '#eef2ff', textColor: '#3730a3' }),
        headingBlock('sow_h1', 'Welcome aboard, Alex!', { fontSize: 30, alignment: 'center', padding: pad(24, 28, 8, 28) }),
        textBlock('sow_p1', 'Thanks for creating your Launchpad workspace. Here are three quick steps to ship your first project in under 5 minutes.', {
          alignment: 'center',
        }),
        columnsBlock('sow_cols', 3, [
          [
            headingBlock('sow_c1h', '1. Connect', { level: 'h3', fontSize: 16, alignment: 'center', padding: pad(6, 6, 4, 6) }),
            textBlock('sow_c1p', 'Link your GitHub repo or import data.', { fontSize: 13, alignment: 'center', padding: pad(2, 6, 8, 6) }),
          ],
          [
            headingBlock('sow_c2h', '2. Customize', { level: 'h3', fontSize: 16, alignment: 'center', padding: pad(6, 6, 4, 6) }),
            textBlock('sow_c2p', 'Pick a starter template and brand colors.', { fontSize: 13, alignment: 'center', padding: pad(2, 6, 8, 6) }),
          ],
          [
            headingBlock('sow_c3h', '3. Publish', { level: 'h3', fontSize: 16, alignment: 'center', padding: pad(6, 6, 4, 6) }),
            textBlock('sow_c3p', 'Go live with one click and share.', { fontSize: 13, alignment: 'center', padding: pad(2, 6, 8, 6) }),
          ],
        ]),
        buttonBlock('sow_btn', 'Open Your Workspace', { backgroundColor: '#4f46e5' }),
        footerBlock('sow_ftr', 'Launchpad Technologies'),
      ],
    },
  },
  {
    id: 'tpl_community_member_welcome',
    slug: 'community-member-welcome',
    name: 'Community Member Welcome',
    category: 'Welcome Email',
    categorySlug: 'welcome-email',
    description: 'Friendly community welcome email with hero banner, guidelines, and Discord/Slack invite button.',
    accentColor: '#10b981',
    tags: ['welcome', 'community', 'membership'],
    document: {
      version: 1,
      name: 'Community Member Welcome',
      settings: baseSettings({
        subject: 'You’re in! Welcome to the Makers Collective',
        preheader: 'Introduce yourself and meet 4,000+ builders.',
      }),
      blocks: [
        headerBlock('cmw', 'MAKERS COLLECTIVE', { showNav: false }),
        imageBlock(
          'cmw_img',
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          'Community members collaborating',
        ),
        headingBlock('cmw_h1', 'Glad you joined the community!', { fontSize: 26 }),
        textBlock('cmw_p1', 'Every week we host live AMAs, design critiques, and founder office hours. Start by introducing yourself in #introductions.'),
        buttonBlock('cmw_btn', 'Join Community Chat', { backgroundColor: '#10b981' }),
        socialBlock('cmw_soc', '#10b981'),
        footerBlock('cmw_ftr', 'Makers Collective'),
      ],
    },
  },
  {
    id: 'tpl_creator_newsletter_welcome',
    slug: 'creator-newsletter-welcome',
    name: 'Creator Newsletter Welcome',
    category: 'Welcome Email',
    categorySlug: 'welcome-email',
    description: 'Personal welcome note from a newsletter author with best-of links and reply prompt.',
    accentColor: '#f59e0b',
    tags: ['welcome', 'creator', 'personal'],
    document: {
      version: 1,
      name: 'Creator Newsletter Welcome',
      settings: baseSettings({
        subject: 'Welcome! Plus my 3 most popular guides',
        preheader: 'Hit reply anytime — I read every email.',
      }),
      blocks: [
        headerBlock('cnw', 'SUNDAY NOTES', { alignment: 'center', showNav: false }),
        headingBlock('cnw_h1', 'Hey there, thanks for subscribing!', { fontSize: 26 }),
        textBlock(
          'cnw_p1',
          'Every Sunday I share one actionable teardown on product growth, pricing, and clear writing. While you wait for the next issue, here is our most-read guide.',
        ),
        buttonBlock('cnw_btn', 'Read the Starter Guide', { backgroundColor: '#d97706', alignment: 'left' }),
        dividerBlock('cnw_div'),
        footerBlock('cnw_ftr', 'Sunday Notes Newsletter'),
      ],
    },
  },

  // 3. Promotional Email (3)
  {
    id: 'tpl_summer_collection_launch',
    slug: 'summer-collection-launch',
    name: 'Summer Collection Launch',
    category: 'Promotional Email',
    categorySlug: 'promotional-email',
    description: 'Visual-first promotional email with hero product photography, 2-column showcase, and shop CTA.',
    accentColor: '#ec4899',
    tags: ['promo', 'launch', 'fashion', 'retail'],
    document: {
      version: 1,
      name: 'Summer Collection Launch',
      settings: baseSettings({
        subject: 'Just Dropped: The Linen Summer Collection',
        preheader: 'Lightweight essentials crafted for warm days.',
      }),
      blocks: [
        headerBlock('scl', 'SOLSTICE', { alignment: 'center', showNav: false }),
        imageBlock(
          'scl_hero',
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
          'Summer collection showcase',
        ),
        headingBlock('scl_h1', 'Effortless Summer Essentials', { fontSize: 28, alignment: 'center' }),
        textBlock('scl_p1', 'Breathable organic linen and sun-washed tones designed for travel and everyday comfort.', {
          alignment: 'center',
        }),
        buttonBlock('scl_btn', 'Shop New Arrivals', { backgroundColor: '#db2777' }),
        socialBlock('scl_soc', '#db2777'),
        footerBlock('scl_ftr', 'Solstice Apparel Co.'),
      ],
    },
  },
  {
    id: 'tpl_flash_48_hour_offer',
    slug: 'flash-48-hour-offer',
    name: '48-Hour Flash Sale',
    category: 'Promotional Email',
    categorySlug: 'promotional-email',
    description: 'High-converting urgency promo email with bold discount banner, coupon code, and CTA.',
    accentColor: '#ef4444',
    tags: ['promo', 'flash-sale', 'discount'],
    document: {
      version: 1,
      name: '48-Hour Flash Sale',
      settings: baseSettings({
        subject: '48 Hours Only: Take 30% Off Everything',
        preheader: 'Use code FLASH30 at checkout before midnight.',
      }),
      blocks: [
        headerBlock('fho', 'FLASH SALE — ENDS IN 48 HOURS', {
          backgroundColor: '#dc2626',
          textColor: '#ffffff',
          alignment: 'center',
          showNav: false,
        }),
        headingBlock('fho_h1', '30% Off Sitewide', { fontSize: 36, alignment: 'center', padding: pad(28, 28, 8, 28) }),
        textBlock('fho_p1', 'Upgrade your workspace gear this weekend. Enter code FLASH30 at checkout for instant savings.', {
          alignment: 'center',
        }),
        buttonBlock('fho_btn', 'Claim 30% Off Now', { backgroundColor: '#dc2626', fullWidth: false }),
        dividerBlock('fho_div'),
        footerBlock('fho_ftr', 'GearCraft Store'),
      ],
    },
  },
  {
    id: 'tpl_vip_early_access',
    slug: 'vip-early-access',
    name: 'VIP Early Access Invite',
    category: 'Promotional Email',
    categorySlug: 'promotional-email',
    description: 'Exclusive VIP early-access promotional email with dark luxury header and private link.',
    accentColor: '#7c3aed',
    tags: ['promo', 'vip', 'early-access'],
    document: {
      version: 1,
      name: 'VIP Early Access Invite',
      settings: baseSettings({
        subject: 'Your Private VIP Early Access Starts Now',
        preheader: 'Shop 24 hours before the public release.',
      }),
      blocks: [
        headerBlock('vea', 'ATELIER VIP', { backgroundColor: '#1e1b4b', textColor: '#ffffff', alignment: 'center', showNav: false }),
        headingBlock('vea_h1', 'You’re on the Early Access List', { fontSize: 28, alignment: 'center', padding: pad(24, 28, 8, 28) }),
        textBlock('vea_p1', 'As a VIP member, you get 24-hour priority access to our limited-edition release before quantities sell out.', {
          alignment: 'center',
        }),
        buttonBlock('vea_btn', 'Unlock Private Store', { backgroundColor: '#7c3aed' }),
        footerBlock('vea_ftr', 'Atelier Studio'),
      ],
    },
  },

  // 4. Black Friday / Sale (3)
  {
    id: 'tpl_black_friday_mega_sale',
    slug: 'black-friday-mega-sale',
    name: 'Black Friday Mega Sale',
    category: 'Black Friday / Sale',
    categorySlug: 'black-friday-email',
    description: 'Bold high-contrast Black Friday email template with 50% off hero and 2-column deal cards.',
    accentColor: '#18181b',
    tags: ['black-friday', 'sale', 'discount', 'dark'],
    document: {
      version: 1,
      name: 'Black Friday Mega Sale',
      settings: baseSettings({
        subject: 'BLACK FRIDAY: Up to 50% Off Annual Plans',
        preheader: 'Our biggest sale of the year ends Monday.',
        canvasColor: '#09090b',
        contentBackgroundColor: '#18181b',
        textColor: '#f4f4f5',
      }),
      blocks: [
        headerBlock('bfm', 'BLACK FRIDAY', { backgroundColor: '#000000', textColor: '#facc15', alignment: 'center', showNav: false }),
        headingBlock('bfm_h1', '50% OFF EVERYTHING', {
          fontSize: 36,
          fontWeight: '800',
          color: '#ffffff',
          alignment: 'center',
          padding: pad(28, 28, 8, 28),
        }),
        textBlock('bfm_p1', 'Lock in half-price Pro plans and hardware bundles for the entire year. Offer expires Monday at 11:59 PM.', {
          color: '#d4d4d8',
          alignment: 'center',
        }),
        buttonBlock('bfm_btn', 'Shop Black Friday Deals', {
          backgroundColor: '#facc15',
          textColor: '#09090b',
          borderRadius: 6,
        }),
        columnsBlock('bfm_cols', 2, [
          [
            headingBlock('bfm_c1h', 'Pro Annual — 50% Off', { level: 'h3', fontSize: 17, color: '#ffffff', padding: pad(8, 8, 4, 8) }),
            textBlock('bfm_c1p', 'Unlimited exports, team seats, and priority support.', { color: '#a1a1aa', fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
          [
            headingBlock('bfm_c2h', 'Starter Bundle — 40% Off', { level: 'h3', fontSize: 17, color: '#ffffff', padding: pad(8, 8, 4, 8) }),
            textBlock('bfm_c2p', 'Everything you need to launch fast this holiday.', { color: '#a1a1aa', fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
        ]),
        footerBlock('bfm_ftr', 'StudioPro Inc.', { backgroundColor: '#09090b', textColor: '#71717a' }),
      ],
    },
  },
  {
    id: 'tpl_cyber_monday_tech_deals',
    slug: 'cyber-monday-tech-deals',
    name: 'Cyber Monday Tech Deals',
    category: 'Black Friday / Sale',
    categorySlug: 'black-friday-email',
    description: 'Electric Cyber Monday template built for SaaS, electronics, and digital product bundles.',
    accentColor: '#2563eb',
    tags: ['cyber-monday', 'black-friday', 'tech', 'sale'],
    document: {
      version: 1,
      name: 'Cyber Monday Tech Deals',
      settings: baseSettings({
        subject: 'Cyber Monday: Final Hours for 40% Off',
        preheader: 'Last chance to grab our lowest prices of the year.',
      }),
      blocks: [
        headerBlock('cmt', 'CYBER MONDAY', { backgroundColor: '#1d4ed8', textColor: '#ffffff', alignment: 'center', showNav: false }),
        headingBlock('cmt_h1', 'Final Hours: Save 40% Today', { fontSize: 30, alignment: 'center', padding: pad(24, 28, 8, 28) }),
        textBlock('cmt_p1', 'Don’t miss your last chance to upgrade your toolkit at our lowest annual rate.', { alignment: 'center' }),
        buttonBlock('cmt_btn', 'Grab the Cyber Monday Deal', { backgroundColor: '#2563eb' }),
        socialBlock('cmt_soc', '#2563eb'),
        footerBlock('cmt_ftr', 'CloudSuite'),
      ],
    },
  },
  {
    id: 'tpl_holiday_clearance_event',
    slug: 'holiday-clearance-event',
    name: 'Holiday Clearance Event',
    category: 'Black Friday / Sale',
    categorySlug: 'black-friday-email',
    description: 'Clean seasonal clearance email with featured image and tiered discount callout.',
    accentColor: '#b91c1c',
    tags: ['holiday', 'clearance', 'sale'],
    document: {
      version: 1,
      name: 'Holiday Clearance Event',
      settings: baseSettings({
        subject: 'End-of-Season Clearance: Extra 25% Off Sale',
        preheader: 'Limited stock remaining on bestsellers.',
      }),
      blocks: [
        headerBlock('hce', 'NORTHERN GOODS', { alignment: 'center', showNav: false }),
        imageBlock(
          'hce_img',
          'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
          'Holiday sale banner',
        ),
        headingBlock('hce_h1', 'Extra 25% Off Clearance', { fontSize: 28, alignment: 'center' }),
        textBlock('hce_p1', 'Quantities are limited. Enjoy free shipping on all orders over \$75 through Sunday.', { alignment: 'center' }),
        buttonBlock('hce_btn', 'Shop Clearance', { backgroundColor: '#b91c1c' }),
        footerBlock('hce_ftr', 'Northern Goods Co.'),
      ],
    },
  },

  // 5. Ecommerce (3)
  {
    id: 'tpl_order_confirmation_receipt',
    slug: 'order-confirmation-receipt',
    name: 'Order Confirmation & Receipt',
    category: 'Ecommerce',
    categorySlug: 'ecommerce',
    description: 'Clear ecommerce order confirmation with order number, shipping summary, and tracking button.',
    accentColor: '#059669',
    tags: ['ecommerce', 'order', 'receipt'],
    document: {
      version: 1,
      name: 'Order Confirmation & Receipt',
      settings: baseSettings({
        subject: 'Order #48291 Confirmed — Thank you!',
        preheader: 'We are preparing your items for shipment.',
      }),
      blocks: [
        headerBlock('ocr', 'MONO STORE', { showNav: false }),
        headingBlock('ocr_h1', 'Thanks for your order, Jordan!', { fontSize: 26 }),
        textBlock('ocr_p1', 'Order #48291 is confirmed and being packed at our warehouse. You will receive a tracking link as soon as it ships.'),
        dividerBlock('ocr_d1'),
        columnsBlock('ocr_cols', 2, [
          [
            headingBlock('ocr_c1h', 'Order Summary', { level: 'h3', fontSize: 16, padding: pad(4, 8, 4, 8) }),
            textBlock('ocr_c1p', '1x Minimalist Desk Lamp — \$89.00\nShipping — Free\nTotal — \$89.00', { fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
          [
            headingBlock('ocr_c2h', 'Shipping Address', { level: 'h3', fontSize: 16, padding: pad(4, 8, 4, 8) }),
            textBlock('ocr_c2p', 'Jordan Lee\n742 Evergreen Terrace\nPortland, OR 97205', { fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
        ]),
        buttonBlock('ocr_btn', 'View Order Status', { backgroundColor: '#059669' }),
        footerBlock('ocr_ftr', 'Mono Store LLC'),
      ],
    },
  },
  {
    id: 'tpl_abandoned_cart_reminder',
    slug: 'abandoned-cart-reminder',
    name: 'Abandoned Cart Reminder',
    category: 'Ecommerce',
    categorySlug: 'ecommerce',
    description: 'High-recovery abandoned cart email with product photo, 10% incentive, and return-to-cart CTA.',
    accentColor: '#ea580c',
    tags: ['ecommerce', 'abandoned-cart', 'recovery'],
    document: {
      version: 1,
      name: 'Abandoned Cart Reminder',
      settings: baseSettings({
        subject: 'You left something in your cart (+ 10% off)',
        preheader: 'Complete your order before your items sell out.',
      }),
      blocks: [
        headerBlock('acr', 'CRAFTED HOME', { alignment: 'center', showNav: false }),
        imageBlock(
          'acr_img',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
          'Product in cart',
        ),
        headingBlock('acr_h1', 'Still thinking it over?', { fontSize: 26, alignment: 'center' }),
        textBlock('acr_p1', 'Your cart is saved and waiting. Use code WELCOME10 at checkout to take 10% off your order today.', {
          alignment: 'center',
        }),
        buttonBlock('acr_btn', 'Return to Your Cart', { backgroundColor: '#ea580c' }),
        footerBlock('acr_ftr', 'Crafted Home Co.'),
      ],
    },
  },
  {
    id: 'tpl_back_in_stock_alert',
    slug: 'back-in-stock-alert',
    name: 'Back in Stock Notification',
    category: 'Ecommerce',
    categorySlug: 'ecommerce',
    description: 'Clean restock alert email notifying subscribers their waitlisted item is available.',
    accentColor: '#0f766e',
    tags: ['ecommerce', 'restock', 'alert'],
    document: {
      version: 1,
      name: 'Back in Stock Notification',
      settings: baseSettings({
        subject: 'Back in Stock: The Everyday Carry Backpack',
        preheader: 'Limited restock available now.',
      }),
      blocks: [
        headerBlock('bis', 'NOMAD GEAR', { alignment: 'center', showNav: false }),
        headingBlock('bis_h1', 'It’s Finally Back in Stock', { fontSize: 28, alignment: 'center', padding: pad(20, 28, 8, 28) }),
        textBlock('bis_p1', 'The Everyday Carry Backpack in Matte Black is available again. Order yours before this batch sells out.', {
          alignment: 'center',
        }),
        buttonBlock('bis_btn', 'Buy Now', { backgroundColor: '#0f766e' }),
        footerBlock('bis_ftr', 'Nomad Gear'),
      ],
    },
  },

  // 6. Transactional Email (3)
  {
    id: 'tpl_password_reset_request',
    slug: 'password-reset-request',
    name: 'Password Reset Request',
    category: 'Transactional Email',
    categorySlug: 'transactional-email',
    description: 'Clean, trustworthy password reset email with single high-contrast CTA and security notice.',
    accentColor: '#334155',
    tags: ['transactional', 'security', 'password-reset'],
    document: {
      version: 1,
      name: 'Password Reset Request',
      settings: baseSettings({
        subject: 'Reset your password for CloudApp',
        preheader: 'This link expires in 30 minutes.',
      }),
      blocks: [
        headerBlock('prr', 'CLOUDAPP', { showNav: false }),
        headingBlock('prr_h1', 'Reset Your Password', { fontSize: 24 }),
        textBlock('prr_p1', 'We received a request to reset the password for your CloudApp account. Click the button below to choose a new password.'),
        buttonBlock('prr_btn', 'Reset Password', { backgroundColor: '#0f172a', alignment: 'left' }),
        textBlock('prr_p2', 'If you did not request a password reset, you can safely ignore this email. This link expires in 30 minutes.', {
          fontSize: 13,
          color: '#64748b',
        }),
        footerBlock('prr_ftr', 'CloudApp Security'),
      ],
    },
  },
  {
    id: 'tpl_monthly_invoice_receipt',
    slug: 'monthly-invoice-receipt',
    name: 'Monthly Invoice & Receipt',
    category: 'Transactional Email',
    categorySlug: 'transactional-email',
    description: 'Structured SaaS billing receipt with invoice number, amount paid, and download PDF CTA.',
    accentColor: '#4f46e5',
    tags: ['transactional', 'invoice', 'billing'],
    document: {
      version: 1,
      name: 'Monthly Invoice & Receipt',
      settings: baseSettings({
        subject: 'Your November Invoice (#INV-2026-11)',
        preheader: 'Payment of \$29.00 received — thank you.',
      }),
      blocks: [
        headerBlock('mir', 'METRICFLOW', { showNav: false }),
        headingBlock('mir_h1', 'Payment Receipt', { fontSize: 24 }),
        textBlock('mir_p1', 'Thank you for your payment. Below is a summary of your monthly subscription invoice.'),
        dividerBlock('mir_d1'),
        textBlock('mir_p2', 'Invoice: #INV-2026-11\nPlan: Pro Monthly\nAmount Paid: \$29.00 USD\nStatus: Paid', { fontSize: 14 }),
        buttonBlock('mir_btn', 'Download PDF Invoice', { backgroundColor: '#4f46e5', alignment: 'left' }),
        footerBlock('mir_ftr', 'MetricFlow Billing'),
      ],
    },
  },
  {
    id: 'tpl_verify_email_address',
    slug: 'verify-email-address',
    name: 'Verify Your Email Address',
    category: 'Transactional Email',
    categorySlug: 'transactional-email',
    description: 'Minimalist account verification email with clear confirmation button.',
    accentColor: '#2563eb',
    tags: ['transactional', 'verification', 'auth'],
    document: {
      version: 1,
      name: 'Verify Your Email Address',
      settings: baseSettings({
        subject: 'Confirm your email address',
        preheader: 'One click to activate your account.',
      }),
      blocks: [
        headerBlock('vea2', 'PULSEAUTH', { alignment: 'center', showNav: false }),
        headingBlock('vea2_h1', 'Confirm Your Email Address', { fontSize: 24, alignment: 'center' }),
        textBlock('vea2_p1', 'Tap the button below to verify your email address and activate your new account.', { alignment: 'center' }),
        buttonBlock('vea2_btn', 'Verify Email', { backgroundColor: '#2563eb' }),
        footerBlock('vea2_ftr', 'PulseAuth Inc.'),
      ],
    },
  },

  // 7. Event Invitation (2)
  {
    id: 'tpl_live_product_webinar',
    slug: 'live-product-webinar',
    name: 'Live Product Webinar Invite',
    category: 'Event Invitation',
    categorySlug: 'event-invitation',
    description: 'Event invitation email with date/time details, speaker highlights, and Save Your Seat CTA.',
    accentColor: '#7c3aed',
    tags: ['event', 'webinar', 'invitation'],
    document: {
      version: 1,
      name: 'Live Product Webinar Invite',
      settings: baseSettings({
        subject: 'Live Workshop: Building High-Converting Email Flows',
        preheader: 'Thursday at 11:00 AM EST — free registration.',
      }),
      blocks: [
        headerBlock('lpw', 'GROWTH LABS', { backgroundColor: '#4c1d95', textColor: '#ffffff', alignment: 'center', showNav: false }),
        imageBlock(
          'lpw_img',
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
          'Live webinar event banner',
        ),
        headingBlock('lpw_h1', 'Live Workshop: Email Design That Converts', { fontSize: 26 }),
        textBlock('lpw_p1', 'Join our product design lead this Thursday at 11:00 AM EST for a 45-minute live teardown of responsive email layouts.'),
        buttonBlock('lpw_btn', 'Reserve Your Free Seat', { backgroundColor: '#7c3aed', alignment: 'left' }),
        socialBlock('lpw_soc', '#7c3aed'),
        footerBlock('lpw_ftr', 'Growth Labs Events'),
      ],
    },
  },
  {
    id: 'tpl_annual_tech_summit',
    slug: 'annual-tech-summit',
    name: 'Annual Tech Summit Keynote',
    category: 'Event Invitation',
    categorySlug: 'event-invitation',
    description: 'Conference invitation with keynote announcement, 2-column track overview, and RSVP button.',
    accentColor: '#0284c7',
    tags: ['event', 'conference', 'summit', 'invitation'],
    document: {
      version: 1,
      name: 'Annual Tech Summit Keynote',
      settings: baseSettings({
        subject: 'You’re Invited: FutureStack Summit 2026',
        preheader: '2 days of engineering talks in Austin & online.',
      }),
      blocks: [
        headerBlock('ats', 'FUTURESTACK 2026', { backgroundColor: '#0c4a6e', textColor: '#ffffff', alignment: 'center', showNav: false }),
        headingBlock('ats_h1', 'Join 2,000+ Builders in Austin', { fontSize: 28, alignment: 'center', padding: pad(24, 28, 8, 28) }),
        textBlock('ats_p1', 'Two days of practical engineering talks, live workshops, and networking — plus free livestream access.', {
          alignment: 'center',
        }),
        columnsBlock('ats_cols', 2, [
          [
            headingBlock('ats_c1h', 'Day 1: Architecture', { level: 'h3', fontSize: 16, padding: pad(6, 8, 4, 8) }),
            textBlock('ats_c1p', 'Edge rendering, distributed queues, and zero-downtime deploys.', { fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
          [
            headingBlock('ats_c2h', 'Day 2: AI & UX', { level: 'h3', fontSize: 16, padding: pad(6, 8, 4, 8) }),
            textBlock('ats_c2p', 'Fast interfaces, evaluation pipelines, and developer tooling.', { fontSize: 14, padding: pad(4, 8, 8, 8) }),
          ],
        ]),
        buttonBlock('ats_btn', 'Register for Free', { backgroundColor: '#0284c7' }),
        footerBlock('ats_ftr', 'FutureStack Conference'),
      ],
    },
  },
];

const outPath = path.resolve(process.cwd(), 'src/templates/templates.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(templates, null, 2));
console.log(`Generated ${templates.length} templates at ${outPath}`);
