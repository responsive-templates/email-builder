import React, { useMemo } from 'react';
import { ArrowUpRight, Pencil } from 'lucide-react';
import { compileEmailToHtml } from '../../email/htmlCompiler';
import type { EmailTemplateMeta } from '../../email/types';
import { toAppUrl } from '../../seo/metadata';

interface TemplateCardProps {
  template: EmailTemplateMeta;
  onEditTemplate: (template: EmailTemplateMeta) => void;
  onNavigate: (path: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEditTemplate,
  onNavigate,
}) => {
  const previewHtml = useMemo(() => compileEmailToHtml(template.document), [template.document]);

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col">
      {/* Scaled Live Email Preview */}
      <div className="relative h-60 bg-slate-100 overflow-hidden border-b border-slate-100">
        <iframe
          title={`${template.name} preview`}
          srcDoc={previewHtml}
          sandbox=""
          tabIndex={-1}
          className="w-[640px] h-[520px] origin-top-left pointer-events-none border-0 bg-white"
          style={{ transform: 'scale(0.5)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4 gap-2">
          <button
            type="button"
            onClick={() => onEditTemplate(template)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit This Template
          </button>
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold shadow-md transition-colors"
          >
            <span>Preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {template.category}
          </span>
        </div>
        <h3 className="font-display font-bold text-base text-slate-900 mb-1">
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="hover:text-indigo-600 transition-colors"
          >
            {template.name}
          </a>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
          {template.description}
        </p>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onEditTemplate(template)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            <Pencil className="w-3 h-3" />
            Edit This Template
          </button>
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            Details &rarr;
          </a>
        </div>
      </div>
    </article>
  );
};
