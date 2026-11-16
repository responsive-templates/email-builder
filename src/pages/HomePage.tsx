import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  MonitorSmartphone,
  MousePointerClick,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TemplateCard } from '../components/site/TemplateCard';
import type { EmailTemplateMeta } from '../email/types';
import { toAppUrl } from '../seo/metadata';
import { TEMPLATE_CATEGORIES, TEMPLATES } from '../templates';

interface HomePageProps {
  onStartBuilding: () => void;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartBuilding,
  onEditTemplate,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const visibleTemplates =
    selectedCategory === 'all'
      ? TEMPLATES.slice(0, 6)
      : TEMPLATES.filter((t) => t.categorySlug === selectedCategory).slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free &bull; Browser-Based &bull; No Signup Required</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Free Email Builder — Create Beautiful HTML Emails
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Build responsive emails with drag &amp; drop. Free HTML export. No signup required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onStartBuilding}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Start Building</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={toAppUrl('/templates/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/templates/');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-base font-semibold transition-all"
            >
              Browse 20 Templates
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Table-based email HTML
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Inline CSS &amp; MSO support
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Auto-saved in your browser
            </span>
          </div>
        </div>
      </section>

      {/* Ready-to-Use Templates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Start with a Responsive Template
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Click any template to open it directly in the visual drag &amp; drop editor.
            </p>
          </div>
          <a
            href={toAppUrl('/templates/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/templates/');
            }}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 shrink-0"
          >
            View all 20 templates <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            Featured
          </button>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
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

      {/* Why Our Email Builder */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
              Everything You Need to Ship Responsive Emails Fast
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed for marketers, founders, and developers who want clean HTML without
              subscriptions or lock-in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">
                Drag &amp; Drop + Inline Editing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Drag headings, images, buttons, 2/3-column layouts, social icons, and footers onto
                your canvas and edit copy directly in place.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">
                Email-Safe Table HTML
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Exports XHTML table layouts with inline CSS, MSO Outlook conditionals, and mobile
                stacking media queries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-4">
                <MonitorSmartphone className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">
                Desktop &amp; Mobile Preview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Toggle between 600px desktop and 375px mobile views anytime, plus save or import
                portable JSON project files.
              </p>
            </div>
          </div>

          {/* Dedicated Tool Links */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                path: '/html-email-builder/',
                title: 'HTML Email Builder',
                desc: 'Inspect table-based HTML & inline CSS output.',
                icon: <Code2 className="w-4 h-4 text-indigo-600" />,
              },
              {
                path: '/drag-and-drop-email-builder/',
                title: 'Drag & Drop Builder',
                desc: 'Visual 3-column no-code email workspace.',
                icon: <Layers className="w-4 h-4 text-indigo-600" />,
              },
              {
                path: '/email-template-builder/',
                title: 'Email Template Builder',
                desc: 'Customize & export reusable JSON blueprints.',
                icon: <Sparkles className="w-4 h-4 text-indigo-600" />,
              },
              {
                path: '/newsletter-builder/',
                title: 'Newsletter Builder',
                desc: 'Multi-column digests & preheader optimization.',
                icon: <Zap className="w-4 h-4 text-indigo-600" />,
              },
            ].map((item) => (
              <a
                key={item.path}
                href={toAppUrl(item.path)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.path);
                }}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm bg-white transition-all flex items-start gap-3"
              >
                <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
