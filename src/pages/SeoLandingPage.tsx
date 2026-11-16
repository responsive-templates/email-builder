import React, { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Code2 } from 'lucide-react';
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
      <section className="bg-white border-b border-slate-200/80 py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-5">
            {config.badge}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            {config.h1}
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">{config.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onStartBuilding}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md cursor-pointer"
            >
              <span>Launch Visual Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={toAppUrl('/templates/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/templates/');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-semibold"
            >
              Explore Templates
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.highlights.map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
              <h2 className="font-display font-bold text-lg text-slate-900 mb-2">{item.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code Preview on /html-email-builder/ */}
      {config.path === '/html-email-builder/' && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14">
          <div className="bg-slate-950 rounded-2xl p-6 text-slate-100 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Code2 className="w-4 h-4" />
                Live Table-Based HTML Output Example
              </span>
              <button
                type="button"
                onClick={onStartBuilding}
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg"
              >
                Open in Editor
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>{sampleHtml}</code>
            </pre>
          </div>
        </section>
      )}

      {/* Templates Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-slate-900">
            {config.categoryFilterSlug ? 'Newsletter Templates' : 'Ready-to-Edit Templates'}
          </h2>
          <a
            href={toAppUrl('/templates/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/templates/');
            }}
            className="text-sm font-semibold text-indigo-600 hover:underline"
          >
            View all templates &rarr;
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
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {config.faq.map((item) => (
            <div key={item.q} className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">{item.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
