import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
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
        className={`text-sm font-medium transition-colors ${
          active ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a
            href={toAppUrl('/')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="flex items-center gap-2.5 text-slate-900"
          >
            <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-display font-bold text-base tracking-tight">EmailBuilder</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {navLink('/templates/', 'Templates')}
            {navLink('/html-email-builder/', 'HTML Builder')}
            {navLink('/drag-and-drop-email-builder/', 'Drag & Drop')}
            {navLink('/newsletter-builder/', 'Newsletters')}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={toAppUrl('/templates/')}
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/templates/');
              }}
              className="md:hidden text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Templates
            </a>
            <button
              type="button"
              onClick={onStartBuilding}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <span>Start Building</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="font-display font-bold text-sm">Free Email Builder</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Build responsive HTML emails visually with drag &amp; drop. Export clean table-based
              HTML for free—no signup required.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Email Tools
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href={toAppUrl('/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="hover:text-indigo-600"
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
                  className="hover:text-indigo-600"
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
                  className="hover:text-indigo-600"
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
                  className="hover:text-indigo-600"
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
                  className="hover:text-indigo-600"
                >
                  Newsletter Builder
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Template Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href={toAppUrl('/templates/')}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/templates/');
                  }}
                  className="hover:text-indigo-600"
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
                    className="hover:text-indigo-600"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              More Templates
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {TEMPLATE_CATEGORIES.slice(4).map((cat) => (
                <li key={cat.slug}>
                  <a
                    href={toAppUrl(`/templates/${cat.slug}/`)}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/templates/${cat.slug}/`);
                    }}
                    className="hover:text-indigo-600"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
          Free Email Builder &bull; Table-based HTML export &bull; Local browser storage &bull; No
          signup required
        </div>
      </footer>
    </div>
  );
};
