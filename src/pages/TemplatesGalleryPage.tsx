import React, { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { TemplateCard } from '../components/site/TemplateCard';
import type { EmailTemplateMeta } from '../email/types';
import { toAppUrl } from '../seo/metadata';
import {
  getCategoryBySlug,
  TEMPLATE_CATEGORIES,
  TEMPLATES,
} from '../templates';

interface TemplatesGalleryPageProps {
  categorySlug?: string;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onStartBuilding: () => void;
  onNavigate: (path: string) => void;
}

export const TemplatesGalleryPage: React.FC<TemplatesGalleryPageProps> = ({
  categorySlug,
  onEditTemplate,
  onStartBuilding,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const categoryInfo = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (categorySlug && t.categorySlug !== categorySlug) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [categorySlug, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            {categoryInfo ? categoryInfo.name : 'Responsive Email Templates'}
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
            {categoryInfo ? categoryInfo.title : 'Free Responsive Email Templates'}
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl">
            {categoryInfo
              ? categoryInfo.description
              : 'Choose from 20 mobile-ready HTML email templates across 7 categories. Open any template in the visual editor and export clean table HTML for free.'}
          </p>
        </div>

        <button
          type="button"
          onClick={onStartBuilding}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shrink-0 cursor-pointer"
        >
          <span>Start Blank Email</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Links & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <a
            href={toAppUrl('/templates/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/templates/');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              !categorySlug
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All ({TEMPLATES.length})
          </a>
          {TEMPLATE_CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={toAppUrl(`/templates/${cat.slug}/`)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/templates/${cat.slug}/`);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categorySlug === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600 font-medium">No templates matched your search.</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 text-sm font-semibold text-indigo-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEditTemplate={onEditTemplate}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
