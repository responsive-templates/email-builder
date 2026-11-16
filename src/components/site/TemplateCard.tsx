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
    <article className="group bg-sheet border-t-2 border-ink border-x border-b border-rule flex flex-col">
      {/* Scaled Live Email Preview */}
      <div className="relative h-60 bg-paper-2 overflow-hidden border-b border-rule">
        <iframe
          title={`${template.name} preview`}
          srcDoc={previewHtml}
          sandbox=""
          tabIndex={-1}
          className="w-[640px] h-[520px] origin-top-left pointer-events-none border-0 bg-sheet"
          style={{ transform: 'scale(0.5)' }}
        />
        <div className="absolute inset-0 bg-ink/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4 gap-2">
          <button
            type="button"
            onClick={() => onEditTemplate(template)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-xs font-medium cursor-pointer transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit This Template</span>
          </button>
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-[2px] bg-sheet text-ink font-display text-xs font-medium transition-colors"
          >
            <span>Preview</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs text-muted">
          <span>{template.category}</span>
          <span className="num">{template.document.settings.contentWidth}px</span>
        </div>

        <h3 className="font-display font-semibold text-lg text-ink mb-1.5 leading-snug">
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="hover:underline decoration-accent underline-offset-4"
          >
            {template.name}
          </a>
        </h3>

        <p className="text-sm text-ink-2 leading-relaxed line-clamp-2 flex-1">
          {template.description}
        </p>

        <div className="mt-4 pt-3 border-t border-rule flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onEditTemplate(template)}
            className="text-xs font-display font-medium text-accent hover:text-accent-2 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit This Template</span>
          </button>
          <a
            href={toAppUrl(`/templates/${template.slug}/`)}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/templates/${template.slug}/`);
            }}
            className="text-xs font-medium text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent inline-flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
