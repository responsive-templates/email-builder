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
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-10">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted">
        <a
          href={toAppUrl('/templates/')}
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/templates/');
          }}
          className="inline-flex items-center gap-1 hover:text-ink font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>All Templates</span>
        </a>
        <span>/</span>
        <a
          href={toAppUrl(`/templates/${template.categorySlug}/`)}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/templates/${template.categorySlug}/`);
          }}
          className="hover:text-ink font-medium"
        >
          {template.category}
        </a>
        <span>/</span>
        <span className="text-ink font-medium">{template.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preview Column */}
        <div className="lg:col-span-8 almanac-sheet border-x border-rule">
          <div className="px-4 py-3 border-b border-rule flex items-center justify-between bg-paper-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setShowCode(false);
                  setViewport('desktop');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                  !showCode && viewport === 'desktop'
                    ? 'bg-ink text-sheet'
                    : 'text-ink-2 hover:text-ink border border-rule bg-sheet'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCode(false);
                  setViewport('mobile');
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                  !showCode && viewport === 'mobile'
                    ? 'bg-ink text-sheet'
                    : 'text-ink-2 hover:text-ink border border-rule bg-sheet'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCode(true)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-display font-medium cursor-pointer transition-colors ${
                  showCode
                    ? 'bg-ink text-sheet'
                    : 'text-ink-2 hover:text-ink border border-rule bg-sheet'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>HTML</span>
              </button>
            </div>

            <span className="num text-xs text-muted">
              {viewport === 'mobile' ? '375px' : `${template.document.settings.contentWidth}px`}
            </span>
          </div>

          <div className="p-4 sm:p-6 bg-paper-2 flex justify-center min-h-[560px]">
            {showCode ? (
              <pre className="w-full max-h-[600px] overflow-auto bg-ink text-sheet p-4 text-xs font-mono leading-relaxed">
                <code>{html}</code>
              </pre>
            ) : (
              <iframe
                title={`${template.name} live preview`}
                srcDoc={html}
                style={{ width: viewport === 'mobile' ? 375 : '100%', maxWidth: 720, height: 600 }}
                className="bg-sheet border border-rule transition-opacity"
              />
            )}
          </div>
        </div>

        {/* Details & CTA Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="almanac-sheet border-x border-rule p-6">
            <span className="block text-xs text-muted mb-1.5">{template.category}</span>
            <h1 className="font-display font-semibold text-2xl text-ink mb-3">{template.name}</h1>
            <p className="text-sm text-ink-2 leading-relaxed mb-6">{template.description}</p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => onEditTemplate(template)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-sm font-medium transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" aria-hidden="true" />
                <span>Edit This Template</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  downloadFile(`${template.slug}.html`, html, 'text/html;charset=utf-8')
                }
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[2px] border border-ink text-ink hover:bg-paper-2 font-display text-sm font-medium transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download HTML</span>
              </button>
            </div>

            <dl className="mt-6 pt-5 border-t border-rule space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Subject</dt>
                <dd className="font-medium text-ink truncate max-w-[200px]">
                  {template.document.settings.subject}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Layout width</dt>
                <dd className="num font-medium text-ink">
                  {template.document.settings.contentWidth}px
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Blocks</dt>
                <dd className="num font-medium text-ink">
                  {template.document.blocks.length} sections
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-[2px] bg-paper-2 border border-rule text-ink-2 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {related.length > 0 && (
            <div className="almanac-sheet border-x border-rule p-5">
              <h2 className="font-display font-semibold text-base text-ink pb-2 mb-3 border-b border-rule">
                More in {template.category}
              </h2>
              <ul className="divide-y divide-rule">
                {related.map((rel) => (
                  <li key={rel.id} className="py-2.5 first:pt-0 last:pb-0">
                    <a
                      href={toAppUrl(`/templates/${rel.slug}/`)}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`/templates/${rel.slug}/`);
                      }}
                      className="block hover:underline decoration-accent underline-offset-4"
                    >
                      <div className="text-sm font-display font-medium text-ink">{rel.name}</div>
                      <div className="text-xs text-muted line-clamp-1">{rel.description}</div>
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
