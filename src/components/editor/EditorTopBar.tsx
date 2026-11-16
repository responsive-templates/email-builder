import React, { useRef, useState } from 'react';
import {
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  FileJson,
  FolderOpen,
  Monitor,
  Redo2,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Undo2,
  Upload,
} from 'lucide-react';

interface EditorTopBarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  viewport: 'desktop' | 'mobile';
  onViewportChange: (v: 'desktop' | 'mobile') => void;
  savedAt: number | null;
  onSaveNow: () => void;
  onPreview: () => void;
  onExportHtml: () => void;
  onCopyHtml: () => void;
  onExportJson: () => void;
  onImportJson: (raw: string) => void;
  onResetEmail: () => void;
  onNavigate: (path: string) => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  projectName,
  onProjectNameChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  viewport,
  onViewportChange,
  savedAt,
  onSaveNow,
  onPreview,
  onExportHtml,
  onCopyHtml,
  onExportJson,
  onImportJson,
  onResetEmail,
  onNavigate,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    onCopyHtml();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setMenuOpen(false);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0 z-30">
      {/* Left: Brand + Project Name */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors shrink-0"
          title="Back to Home"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-display font-bold text-sm hidden md:inline">EmailBuilder</span>
        </button>

        <span className="text-slate-300 hidden sm:inline">/</span>

        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          aria-label="Project name"
          className="text-sm font-medium text-slate-800 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-md px-2 py-1 outline-none w-32 sm:w-48 truncate transition-colors"
        />

        <button
          type="button"
          onClick={onSaveNow}
          className="hidden lg:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
          title="Save locally in browser"
        >
          <Save className="w-3.5 h-3.5 text-emerald-600" />
          <span>{savedAt ? 'Saved locally' : 'Save'}</span>
        </button>
      </div>

      {/* Center: Undo/Redo + Desktop/Mobile */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-35 disabled:pointer-events-none transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-35 disabled:pointer-events-none transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5 ml-1">
          <button
            type="button"
            onClick={() => onViewportChange('desktop')}
            title="Desktop View (600px)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewport === 'desktop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => onViewportChange('mobile')}
            title="Mobile View (375px)"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewport === 'mobile'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Right: Templates, Preview, Copy, Export */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onNavigate('/templates/')}
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Templates
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy HTML'}</span>
        </button>

        <button
          type="button"
          onClick={onExportHtml}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export HTML</span>
        </button>

        {/* JSON / Reset Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="JSON Import / Export & Reset"
            aria-label="More actions"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onSaveNow();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5 text-slate-500" />
                  Save Locally
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportJson();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileJson className="w-3.5 h-3.5 text-slate-500" />
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  Import JSON
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    onResetEmail();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset / New Email
                </button>
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};
