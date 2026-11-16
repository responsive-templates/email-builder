import React, { useMemo, useState } from 'react';
import { Check, Code2, Copy, Download, Eye, Monitor, Smartphone, X } from 'lucide-react';
import type { EmailDocument } from '../../email/types';
import { compileEmailToHtml } from '../../email/htmlCompiler';

interface PreviewModalProps {
  document: EmailDocument;
  onClose: () => void;
  onDownloadHtml: () => void;
  onCopyHtml: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  document: doc,
  onClose,
  onDownloadHtml,
  onCopyHtml,
}) => {
  const [tab, setTab] = useState<'preview' | 'html'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => compileEmailToHtml(doc), [doc]);

  const handleCopy = () => {
    onCopyHtml();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  tab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                type="button"
                onClick={() => setTab('html')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  tab === 'html' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Table HTML Source
              </button>
            </div>

            {tab === 'preview' && (
              <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    viewport === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                    viewport === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy HTML'}
            </button>
            <button
              type="button"
              onClick={onDownloadHtml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Download .html
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 bg-slate-100 overflow-auto p-4 flex justify-center">
          {tab === 'preview' ? (
            <iframe
              title="Compiled Email Preview"
              srcDoc={html}
              style={{ width: viewport === 'mobile' ? 375 : '100%', maxWidth: 820 }}
              className="h-full bg-white rounded-xl shadow-md border border-slate-200 transition-all duration-200"
            />
          ) : (
            <pre className="w-full h-full overflow-auto bg-slate-950 text-slate-100 p-5 rounded-xl text-xs font-mono leading-relaxed">
              <code>{html}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
