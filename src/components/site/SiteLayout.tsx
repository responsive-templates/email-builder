import React from 'react';
import { ArrowRight } from 'lucide-react';
import { toAppUrl } from '../../seo/metadata';
import { TEMPLATE_CATEGORIES } from '../../templates';

interface SiteLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onStartBuilding: () => void;
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  currentPath,
  onNavigate,
  onStartBuilding,
  children,
}) => {
  const navLink = (path: string, label: string) => {
    const active = currentPath === path;
    return (
      <a
        href={toAppUrl(path)}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(path);
        }}
        className={`text-sm font-medium whitespace-nowrap transition-colors underline-offset-4 ${
          active
            ? 'text-ink underline decoration-accent decoration-2'
            : 'text-ink-2 hover:text-ink hover:underline decoration-accent'
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink-2">
      {/* Top Almanac Masthead */}
      <header className="sticky top-0 z-30 bg-sheet border-b-2 border-ink">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
          <a
            href={toAppUrl('/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="flex items-center gap-3 text-ink no-underline shrink-0"
          >
            <span
              className="w-2.5 h-6 bg-accent inline-block"
              aria-hidden="true"
            />
            <span className="font-display font-semibold text-base tracking-tight">
              EmailBuilder
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {navLink('/templates/', 'Templates')}
            {navLink('/html-email-builder/', 'HTML Builder')}
            {navLink('/drag-and-drop-email-builder/', 'Drag & Drop')}
            {navLink('/newsletter-builder/', 'Newsletters')}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={toAppUrl('/templates/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/templates/');
              }}
              className="md:hidden text-sm font-medium text-ink-2 hover:text-ink whitespace-nowrap"
            >
              Templates
            </a>
            <button
              type="button"
              onClick={onStartBuilding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] bg-accent hover:bg-accent-2 text-accent-ink font-display text-sm font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Almanac Mast Footer */}
      <footer className="bg-paper-2 border-t-2 border-ink mt-20">
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2 h-5 bg-accent inline-block" aria-hidden="true" />
              <span className="font-display font-semibold text-base text-ink">
                Free Email Builder
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Visual HTML email editor with 20 responsive templates, local browser persistence, and
              table-based HTML export.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted mb-3 pb-2 border-b border-rule">
              Email tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={toAppUrl('/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  Free Email Builder
                </a>
              </li>
              <li>
                <a
                  href={toAppUrl('/html-email-builder/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/html-email-builder/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  HTML Email Builder
                </a>
              </li>
              <li>
                <a
                  href={toAppUrl('/drag-and-drop-email-builder/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/drag-and-drop-email-builder/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  Drag and Drop Email Builder
                </a>
              </li>
              <li>
                <a
                  href={toAppUrl('/email-template-builder/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/email-template-builder/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  Email Template Builder
                </a>
              </li>
              <li>
                <a
                  href={toAppUrl('/newsletter-builder/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/newsletter-builder/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  Newsletter Builder
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted mb-3 pb-2 border-b border-rule">
              Template categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={toAppUrl('/templates/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/templates/');
                  }}
                  className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                >
                  All Templates (20)
                </a>
              </li>
              {TEMPLATE_CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={toAppUrl(`/templates/${cat.slug}/`)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/templates/${cat.slug}/`);
                    }}
                    className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted mb-3 pb-2 border-b border-rule">
              More templates
            </h3>
            <ul className="space-y-2 text-sm">
              {TEMPLATE_CATEGORIES.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={toAppUrl(`/templates/${cat.slug}/`)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/templates/${cat.slug}/`);
                    }}
                    className="text-ink-2 hover:text-ink underline-offset-4 hover:underline decoration-accent"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-rule py-5 px-4 sm:px-8 max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
          <span>Free Email Builder</span>
          <span>Table-based HTML export, local browser storage, no signup required.</span>
        </div>
      </footer>
    </div>
  );
};
