import React, { useCallback, useEffect, useState } from 'react';
import { EmailEditor } from './components/editor/EmailEditor';
import { SiteLayout } from './components/site/SiteLayout';
import type { EmailDocument, EmailTemplateMeta } from './email/types';
import { HomePage } from './pages/HomePage';
import { SeoLandingPage } from './pages/SeoLandingPage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { TemplatesGalleryPage } from './pages/TemplatesGalleryPage';
import {
  SEO_LANDING_PAGES,
  SITE_ORIGIN,
  stripBasePath,
  toAppUrl,
} from './seo/metadata';
import { getCategoryBySlug, getTemplateBySlug } from './templates';

function normalizePath(p: string): string {
  if (!p || p === '/') return '/';
  return p.endsWith('/') ? p : `${p}/`;
}

export const App: React.FC = () => {
  const [path, setPath] = useState<string>(() =>
    normalizePath(stripBasePath(window.location.pathname)),
  );
  const [editorInitialDoc, setEditorInitialDoc] = useState<EmailDocument | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const tplSlug = params.get('template');
    if (tplSlug) {
      const tpl = getTemplateBySlug(tplSlug);
      if (tpl) return JSON.parse(JSON.stringify(tpl.document)) as EmailDocument;
    }
    return null;
  });

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(stripBasePath(window.location.pathname)));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    const norm = normalizePath(nextPath);
    const fullUrl = toAppUrl(norm);
    window.history.pushState({}, '', fullUrl);
    setPath(norm);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const handleStartBuilding = useCallback(() => {
    setEditorInitialDoc(null);
    navigate('/editor/');
  }, [navigate]);

  const handleEditTemplate = useCallback(
    (template: EmailTemplateMeta) => {
      const cloned = JSON.parse(JSON.stringify(template.document)) as EmailDocument;
      setEditorInitialDoc(cloned);
      navigate('/editor/');
    },
    [navigate],
  );

  // Sync <title>, description, canonical
  useEffect(() => {
    let title = 'Free Email Builder — Create Beautiful HTML Emails';
    let description =
      'Build responsive emails with drag & drop. Free HTML export, 20+ responsive email templates, and instant table-based HTML output. No signup required.';

    if (path === '/editor/') {
      title = 'Visual Email Editor — Free Email Builder';
    } else if (SEO_LANDING_PAGES[path]) {
      title = SEO_LANDING_PAGES[path].title;
      description = SEO_LANDING_PAGES[path].description;
    } else if (path === '/templates/') {
      title = 'Free Responsive Email Templates (20+ Designs)';
      description =
        'Browse 20+ free responsive HTML email templates for newsletters, welcome emails, promos, Black Friday, ecommerce, and transactional emails.';
    } else if (path.startsWith('/templates/')) {
      const slug = path.replace('/templates/', '').replace(/\/$/, '');
      const cat = getCategoryBySlug(slug);
      const tpl = getTemplateBySlug(slug);
      if (cat) {
        title = cat.title;
        description = cat.description;
      } else if (tpl) {
        title = `${tpl.name} — Free Responsive Email Template`;
        description = tpl.description;
      }
    }

    document.title = title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', description);
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', `${SITE_ORIGIN}${toAppUrl(path)}`);
  }, [path]);

  // Editor Route
  if (path === '/editor/') {
    return <EmailEditor initialDocument={editorInitialDoc} onNavigate={navigate} />;
  }

  // Marketing / SEO Routes
  let pageContent: React.ReactNode;

  if (path === '/') {
    pageContent = (
      <HomePage
        onStartBuilding={handleStartBuilding}
        onEditTemplate={handleEditTemplate}
        onNavigate={navigate}
      />
    );
  } else if (SEO_LANDING_PAGES[path]) {
    pageContent = (
      <SeoLandingPage
        config={SEO_LANDING_PAGES[path]}
        onStartBuilding={handleStartBuilding}
        onEditTemplate={handleEditTemplate}
        onNavigate={navigate}
      />
    );
  } else if (path === '/templates/') {
    pageContent = (
      <TemplatesGalleryPage
        onEditTemplate={handleEditTemplate}
        onStartBuilding={handleStartBuilding}
        onNavigate={navigate}
      />
    );
  } else if (path.startsWith('/templates/')) {
    const slug = path.replace('/templates/', '').replace(/\/$/, '');
    const cat = getCategoryBySlug(slug);
    const tpl = getTemplateBySlug(slug);

    if (cat) {
      pageContent = (
        <TemplatesGalleryPage
          categorySlug={cat.slug}
          onEditTemplate={handleEditTemplate}
          onStartBuilding={handleStartBuilding}
          onNavigate={navigate}
        />
      );
    } else if (tpl) {
      pageContent = (
        <TemplateDetailPage
          template={tpl}
          onEditTemplate={handleEditTemplate}
          onNavigate={navigate}
        />
      );
    } else {
      pageContent = (
        <TemplatesGalleryPage
          onEditTemplate={handleEditTemplate}
          onStartBuilding={handleStartBuilding}
          onNavigate={navigate}
        />
      );
    }
  } else {
    pageContent = (
      <HomePage
        onStartBuilding={handleStartBuilding}
        onEditTemplate={handleEditTemplate}
        onNavigate={navigate}
      />
    );
  }

  return (
    <SiteLayout
      currentPath={path}
      onNavigate={navigate}
      onStartBuilding={handleStartBuilding}
    >
      {pageContent}
    </SiteLayout>
  );
};

export default App;
