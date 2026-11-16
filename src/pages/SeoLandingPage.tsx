import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Code2 } from 'lucide-react';
import { TemplateCard } from '../components/site/TemplateCard';
import { compileEmailToHtml } from '../email/htmlCompiler';
import type { EmailTemplateMeta } from '../email/types';
import { type SeoPageConfig, toAppUrl } from '../seo/metadata';
import { TEMPLATES } from '../templates';

interface SeoLandingPageProps {
  config: SeoPageConfig;
  onStartBuilding: () => void;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onNavigate: (path: string) => void;
}

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({
  config,
  onStartBuilding,
  onEditTemplate,
  onNavigate,
}) => {
  const templates = useMemo(() => {
    if (config.categoryFilterSlug) {
      return TEMPLATES.filter((t) => t.categorySlug === config.categoryFilterSlug);
    }
    return TEMPLATES.slice(0, 3);
  }, [config.categoryFilterSlug]);

  const sampleHtml = useMemo(
    () => compileEmailToHtml(TEMPLATES[0].document).slice(0, 1100) + '\n  <!-- ... -->',
    [],
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-paper border-b border-rule py-14 sm:py-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl">
            <span className="block text-xs text-muted mb-3">{config.badge}</span>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl text-ink tracking-[-0.03em] leading-[1.02]">
              {config.h1}
            </h1>
            <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-prose">
              {config.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStartBuilding}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-sm font-medium cursor-pointer transition-colors"
              >
                <span>Launch Visual Editor</span>
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
                <span>Explore Templates</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights on Almanac Sheet */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 py-14">
        <div className="almanac-sheet border-x border-rule divide-y divide-rule md:divide-y-0 md:grid md:grid-cols-3 md:divide-x">
          {config.highlights.map((item, idx) => (
            <div key={item.title} className="p-6 sm:p-8">
              <span className="num text-xs text-muted block mb-2">0{idx + 1}</span>
              <h2 className="font-display font-semibold text-xl text-ink mb-2">{item.title}</h2>
              <p className="text-sm text-ink-2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code Preview on /html-email-builder/ */}
      {config.path === '/html-email-builder/' && (
        <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-14">
          <div className="bg-ink text-sheet border-t-2 border-accent p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-display font-medium text-paper">
                <Code2 className="w-4 h-4 text-accent" aria-hidden="true" />
                <span>Live table-based HTML output example</span>
              </span>
              <button
                type="button"
                onClick={onStartBuilding}
                className="text-xs font-display font-medium text-accent-ink bg-accent hover:bg-accent-2 px-3 py-1.5 rounded-[2px] cursor-pointer transition-colors"
              >
                Open in Editor
              </button>
            </div>
            <pre className="text-xs font-mono text-paper overflow-x-auto leading-relaxed">
              <code>{sampleHtml}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Templates Showcase */}
      <section className="max-w-[1380px] mx-auto px-4 sm:px-8 pb-14">
        <div className="flex items-baseline justify-between pb-4 mb-8 border-b-2 border-rule-2">
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink">
            {config.categoryFilterSlug ? 'Newsletter templates' : 'Ready-to-edit templates'}
          </h2>
          <a
            href={toAppUrl('/templates/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/templates/');
            }}
            className="text-sm font-display font-medium text-ink underline decoration-accent underline-offset-4 inline-flex items-center gap-1"
          >
            <span>View all templates</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEditTemplate={onEditTemplate}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 pb-16">
        <h2 className="font-display font-semibold text-2xl text-ink pb-4 mb-6 border-b-2 border-rule-2">
          Frequently asked questions
        </h2>
        <div className="almanac-sheet border-x border-rule divide-y divide-rule">
          {config.faq.map((item) => (
            <div key={item.q} className="p-6">
              <h3 className="font-display font-semibold text-base text-ink mb-1.5">{item.q}</h3>
              <p className="text-sm text-ink-2 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
