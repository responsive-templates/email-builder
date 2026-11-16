import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Monitor, Pencil, Smartphone } from 'lucide-react';
import { TemplateCard } from '../components/site/TemplateCard';
import { compileEmailToHtml } from '../email/htmlCompiler';
import type { EmailTemplateMeta } from '../email/types';
import { toAppUrl } from '../seo/metadata';
import { TEMPLATE_CATEGORIES, TEMPLATES } from '../templates';

interface HomePageProps {
  onStartBuilding: () => void;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onNavigate: (path: string) => void;
}

const SPEC_ROWS = [
  {
    spec: 'Markup engine',
    output: 'XHTML 1.0 Transitional role="presentation" tables',
    metric: '100%',
    note: 'Never fragile web flexbox',
  },
  {
    spec: 'CSS delivery',
    output: 'Inline style attributes on every cell, link, and heading',
    metric: '0 ext',
    note: 'Survives Gmail style stripping',
  },
  {
    spec: 'Outlook desktop',
    output: 'Conditional MSO wrapper tables at fixed content width',
    metric: '600px',
    note: 'Word engine safe',
  },
  {
    spec: 'Mobile stacking',
    output: 'Responsive @media query with .stack-column blocks',
    metric: '620px',
    note: '2 & 3 columns stack cleanly',
  },
  {
    spec: 'Project portability',
    output: 'Auto-saved in localStorage plus JSON export and import',
    metric: 'v1 JSON',
    note: 'No account required',
  },
];

const TOOL_INDEX = [
  {
    path: '/html-email-builder/',
    title: 'HTML Email Builder',
    desc: 'Inspect table-based XHTML output and inline CSS structure.',
    tag: 'Code output',
  },
  {
    path: '/drag-and-drop-email-builder/',
    title: 'Drag & Drop Builder',
    desc: 'Three-column workspace with direct inline text editing.',
    tag: 'Visual editor',
  },
  {
    path: '/email-template-builder/',
    title: 'Email Template Builder',
    desc: 'Customize and export portable JSON template blueprints.',
    tag: 'JSON schema',
  },
  {
    path: '/newsletter-builder/',
    title: 'Newsletter Builder',
    desc: 'Multi-column digests, preheader settings, and footers.',
    tag: 'Campaigns',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onStartBuilding,
  onEditTemplate,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [heroViewport, setHeroViewport] = useState<'desktop' | 'mobile'>('desktop');

  const featuredTemplate = TEMPLATES[0];
  const heroPreviewHtml = useMemo(
    () => compileEmailToHtml(featuredTemplate.document),
    [featuredTemplate.document],
  );

  const visibleTemplates =
    selectedCategory === 'all'
      ? TEMPLATES.slice(0, 6)
      : TEMPLATES.filter((t) => t.categorySlug === selectedCategory).slice(0, 6);

  return (
    <div>
      {/* Corridor Hero */}
      <section className="border-b border-rule bg-paper">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Corridor Column */}
          <div className="lg:col-span-5 min-w-0">
            <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink tracking-[-0.03em] leading-[0.98]">
              Free Email Builder — Create Beautiful HTML Emails
            </h1>

            <p className="mt-5 text-lg text-ink-2 leading-relaxed max-w-prose">
              Build responsive emails with drag &amp; drop. Free HTML export. No signup required.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartBuilding}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-sm font-medium cursor-pointer transition-colors"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={toAppUrl('/templates/')}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/templates/');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] border border-ink text-ink hover:bg-sheet font-display text-sm font-medium transition-colors"
              >
                <span>Browse 20 Templates</span>
              </a>
            </div>

            <dl className="mt-9 pt-5 border-t border-rule grid grid-cols-3 gap-4 text-xs">
              <div>
                <dt className="text-muted">Templates</dt>
                <dd className="num text-base font-medium text-ink mt-0.5">20</dd>
              </div>
              <div>
                <dt className="text-muted">Markup</dt>
                <dd className="num text-base font-medium text-ink mt-0.5">XHTML</dd>
              </div>
              <div>
                <dt className="text-muted">Signup</dt>
                <dd className="num text-base font-medium text-ink mt-0.5">None</dd>
              </div>
            </dl>
          </div>

          {/* Right Stage Sheet: Live Compiled Email Preview */}
          <div className="lg:col-span-7 min-w-0">
            <div className="almanac-sheet border-x border-rule">
              <div className="px-4 py-2.5 border-b border-rule flex items-center justify-between gap-3 bg-paper-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-medium text-ink truncate">
                    {featuredTemplate.name}
                  </span>
                  <span className="num text-xs text-muted">
                    {heroViewport === 'mobile' ? '375px' : '600px'}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setHeroViewport('desktop')}
                    aria-label="Desktop preview"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                      heroViewport === 'desktop'
                        ? 'bg-ink text-sheet'
                        : 'text-ink-2 hover:text-ink border border-rule'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroViewport('mobile')}
                    aria-label="Mobile preview"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                      heroViewport === 'mobile'
                        ? 'bg-ink text-sheet'
                        : 'text-ink-2 hover:text-ink border border-rule'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditTemplate(featuredTemplate)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink text-xs font-display font-medium cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3 h-3" aria-hidden="true" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-paper-2 flex justify-center">
                <iframe
                  title="Live compiled email preview"
                  srcDoc={heroPreviewHtml}
                  sandbox=""
                  style={{ width: heroViewport === 'mobile' ? 375 : '100%' }}
                  className="h-[380px] bg-sheet border border-rule transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready-to-Use Templates */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 mb-8 border-b-2 border-rule-2">
          <div>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-ink tracking-[-0.02em]">
              Responsive email templates
            </h2>
            <p className="text-base text-ink-2 mt-1.5">
              Open any blueprint directly in the three-column visual editor.
            </p>
          </div>
          <a
            href={toAppUrl('/templates/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/templates/');
            }}
            className="text-sm font-display font-medium text-ink underline decoration-accent underline-offset-4 hover:decoration-2 inline-flex items-center gap-1.5 shrink-0"
          >
            <span>View all 20 templates</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-ink text-sheet'
                : 'bg-sheet border border-rule text-ink-2 hover:border-ink'
            }`}
          >
            Featured
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-accent text-accent-ink'
                  : 'bg-sheet border border-rule text-ink-2 hover:border-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEditTemplate={onEditTemplate}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* Almanac Specification Sheet */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-10">
        <div className="almanac-sheet border-x border-rule p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b-2 border-ink">
            <div>
              <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink tracking-[-0.02em]">
                Email output specification
              </h2>
              <p className="text-sm text-muted mt-1">
                Every exported file compiles to table-based XHTML tested against desktop and mobile
                mail clients.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartBuilding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-xs font-medium cursor-pointer transition-colors shrink-0"
            >
              <span>Open Editor</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-rule-2 text-xs text-muted font-medium">
                  <th className="py-3 pr-4">Layer</th>
                  <th className="py-3 px-4">Compiled output</th>
                  <th className="py-3 px-4 text-right">Target</th>
                  <th className="py-3 pl-4">Client note</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {SPEC_ROWS.map((row) => (
                  <tr key={row.spec} className="border-t border-rule">
                    <td className="py-3.5 pr-4 font-display font-medium text-ink whitespace-nowrap">
                      {row.spec}
                    </td>
                    <td className="py-3.5 px-4 text-ink-2">{row.output}</td>
                    <td className="py-3.5 px-4 num text-ink font-medium text-right whitespace-nowrap">
                      {row.metric}
                    </td>
                    <td className="py-3.5 pl-4 text-muted">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dedicated Builder Tools Index */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pt-10 pb-6">
        <div className="pb-4 mb-6 border-b border-rule flex items-baseline justify-between">
          <h2 className="font-display font-semibold text-2xl text-ink">Builder workflows</h2>
          <span className="text-xs text-muted num">4 guides</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOL_INDEX.map((item) => (
            <a
              key={item.path}
              href={toAppUrl(item.path)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
              }}
              className="group p-5 bg-sheet border-t-2 border-rule-2 border-x border-b border-rule hover:border-t-accent transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-xs text-muted block mb-1.5">{item.tag}</span>
                <div className="font-display font-semibold text-base text-ink group-hover:underline decoration-accent underline-offset-4">
                  {item.title}
                </div>
                <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-display font-medium text-accent">
                <span>Open</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
