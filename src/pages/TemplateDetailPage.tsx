import React, { useMemo, useState } from 'react';
import { ArrowLeft, Code2, Download, Monitor, Pencil, Smartphone } from 'lucide-react';
import { compileEmailToHtml } from '../email/htmlCompiler';
import { downloadFile } from '../email/storage';
import type { EmailTemplateMeta } from '../email/types';
import { toAppUrl } from '../seo/metadata';
import { TEMPLATES } from '../templates';

interface TemplateDetailPageProps {
  template: EmailTemplateMeta;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onNavigate: (path: string) => void;
}

export const TemplateDetailPage: React.FC<TemplateDetailPageProps> = ({
  template,
  onEditTemplate,
  onNavigate,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);

  const html = useMemo(() => compileEmailToHtml(template.document), [template.document]);
  const related = useMemo(
    () =>
      TEMPLATES.filter((t) => t.categorySlug === template.categorySlug && t.id !== template.id).slice(
        0,
        3,
      ),
    [template],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <a
          href={toAppUrl('/templates/')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/templates/');
          }}
          className="inline-flex items-center gap-1 hover:text-slate-900 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All Templates
        </a>
        <span>/</span>
        <a
          href={toAppUrl(`/templates/${template.categorySlug}/`)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/templates/${template.categorySlug}/`);
          }}
          className="hover:text-slate-900 font-medium"
        >
          {template.category}
        </a>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{template.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preview Column */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => {
                  setShowCode(false);
                  setViewport('desktop');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  !showCode && viewport === 'desktop'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCode(false);
                  setViewport('mobile');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  !showCode && viewport === 'mobile'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  showCode ? 'bg-slate-900 text-white' : 'text-slate-600'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> HTML
              </button>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              {viewport === 'mobile' ? '375px' : `${template.document.settings.contentWidth}px`}
            </span>
          </div>

          <div className="p-4 sm:p-6 bg-slate-100 flex justify-center min-h-[560px]">
            {showCode ? (
              <pre className="w-full max-h-[600px] overflow-auto bg-slate-950 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed">
                <code>{html}</code>
              </pre>
            ) : (
              <iframe
                title={`${template.name} live preview`}
                srcDoc={html}
                style={{ width: viewport === 'mobile' ? 375 : '100%', maxWidth: 720, height: 600 }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 transition-all duration-200"
              />
            )}
          </div>
        </div>

        {/* Details & CTA Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              {template.category}
            </span>
            <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-3">
              {template.name}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">{template.description}</p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onEditTemplate(template)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
                Edit This Template
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadFile(`${template.slug}.html`, html, 'text/html;charset=utf-8')
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Subject</span>
                <span className="font-medium text-slate-800 truncate max-w-[200px]">
                  {template.document.settings.subject}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Layout Width</span>
                <span className="font-medium text-slate-800">
                  {template.document.settings.contentWidth}px
                </span>
              </div>
              <div className="flex justify-between">
                <span>Blocks</span>
                <span className="font-medium text-slate-800">
                  {template.document.blocks.length} sections
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-display font-bold text-sm text-slate-900 mb-3">
                More in {template.category}
              </h2>
              <ul className="space-y-2.5">
                {related.map((rel) => (
                  <li key={rel.id}>
                    <a
                      href={toAppUrl(`/templates/${rel.slug}/`)}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/templates/${rel.slug}/`);
                      }}
                      className="block p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                    >
                      <div className="text-sm font-semibold text-slate-800">{rel.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{rel.description}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
