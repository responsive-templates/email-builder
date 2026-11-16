import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { cloneBlock, createBlankDocument, createBlock } from '../../email/defaults';
import { createInitialHistory, historyReducer } from '../../email/history';
import { compileEmailToHtml } from '../../email/htmlCompiler';
import {
  clearLocalDocument,
  downloadFile,
  exportDocumentJson,
  loadDocumentLocally,
  parseImportedDocumentJson,
  saveDocumentLocally,
} from '../../email/storage';
import type { BlockType, EmailBlock, EmailDocument, EmailSettings } from '../../email/types';
import { BlockPalette } from './BlockPalette';
import { EmailCanvas, type SelectionTarget } from './EmailCanvas';
import { EditorTopBar } from './EditorTopBar';
import { PreviewModal } from './PreviewModal';
import { PropertyInspector } from './PropertyInspector';

interface EmailEditorProps {
  initialDocument?: EmailDocument | null;
  onNavigate: (path: string) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ initialDocument, onNavigate }) => {
  const [history, dispatch] = useReducer(
    historyReducer,
    initialDocument ?? loadDocumentLocally() ?? createBlankDocument(),
    createInitialHistory,
  );
  const doc = history.present;

  const [selection, setSelection] = useState<SelectionTarget>(null);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  }, []);

  // Load new initialDocument if passed explicitly (e.g. from template "Edit This Template")
  useEffect(() => {
    if (initialDocument) {
      dispatch({ type: 'RESET', doc: initialDocument });
      setSelection(null);
      saveDocumentLocally(initialDocument);
      setSavedAt(Date.now());
    }
  }, [initialDocument]);

  // Auto-save locally whenever document changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (saveDocumentLocally(doc)) {
        setSavedAt(Date.now());
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [doc]);

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        const isEditable = (e.target as HTMLElement)?.isContentEditable;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || isEditable) return;
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if (
        (e.key.toLowerCase() === 'z' && e.shiftKey) ||
        e.key.toLowerCase() === 'y'
      ) {
        const tag = (e.target as HTMLElement)?.tagName;
        const isEditable = (e.target as HTMLElement)?.isContentEditable;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || isEditable) return;
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const commitDoc = useCallback((next: EmailDocument, recordHistory = true) => {
    dispatch({ type: 'SET', doc: next, recordHistory });
  }, []);

  const handleInsertBlock = useCallback(
    (type: BlockType, index: number, columnCount?: 2 | 3) => {
      const newBlock = createBlock(type, columnCount);
      const nextBlocks = [...doc.blocks];
      nextBlocks.splice(index, 0, newBlock);
      commitDoc({ ...doc, blocks: nextBlocks });
      setSelection({ kind: 'block', blockId: newBlock.id });
    },
    [doc, commitDoc],
  );

  const handleAddBlock = useCallback(
    (type: BlockType, columnCount?: 2 | 3) => {
      handleInsertBlock(type, doc.blocks.length, columnCount);
    },
    [doc.blocks.length, handleInsertBlock],
  );

  const handleMoveBlock = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= doc.blocks.length ||
        toIndex >= doc.blocks.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const nextBlocks = [...doc.blocks];
      const [moved] = nextBlocks.splice(fromIndex, 1);
      nextBlocks.splice(toIndex, 0, moved);
      commitDoc({ ...doc, blocks: nextBlocks });
    },
    [doc, commitDoc],
  );

  const handleDuplicateBlock = useCallback(
    (blockId: string) => {
      const idx = doc.blocks.findIndex((b) => b.id === blockId);
      if (idx === -1) return;
      const copy = cloneBlock(doc.blocks[idx]);
      const nextBlocks = [...doc.blocks];
      nextBlocks.splice(idx + 1, 0, copy);
      commitDoc({ ...doc, blocks: nextBlocks });
      setSelection({ kind: 'block', blockId: copy.id });
    },
    [doc, commitDoc],
  );

  const handleDeleteBlock = useCallback(
    (blockId: string) => {
      const nextBlocks = doc.blocks.filter((b) => b.id !== blockId);
      commitDoc({ ...doc, blocks: nextBlocks });
      if (selection?.blockId === blockId) {
        setSelection(null);
      }
    },
    [doc, commitDoc, selection],
  );

  const handleUpdateBlock = useCallback(
    (blockId: string, patch: Record<string, unknown>) => {
      const nextBlocks = doc.blocks.map((b) =>
        b.id === blockId ? ({ ...b, props: { ...b.props, ...patch } } as EmailBlock) : b,
      );
      commitDoc({ ...doc, blocks: nextBlocks });
    },
    [doc, commitDoc],
  );

  const handleUpdateColumnChild = useCallback(
    (
      blockId: string,
      columnIndex: number,
      childId: string,
      patch: Record<string, unknown>,
    ) => {
      const nextBlocks = doc.blocks.map((b) => {
        if (b.id !== blockId || b.type !== 'columns') return b;
        const nextCols = b.props.columns.map((col, idx) =>
          idx !== columnIndex
            ? col
            : col.map((child) =>
                child.id === childId
                  ? ({ ...child, props: { ...child.props, ...patch } } as typeof child)
                  : child,
              ),
        );
        return { ...b, props: { ...b.props, columns: nextCols } };
      });
      commitDoc({ ...doc, blocks: nextBlocks });
    },
    [doc, commitDoc],
  );

  const handleUpdateLeafBlock = useCallback(
    (
      target: { blockId: string; columnIndex?: number; childId?: string },
      patch: Record<string, unknown>,
    ) => {
      if (target.columnIndex !== undefined && target.childId) {
        handleUpdateColumnChild(target.blockId, target.columnIndex, target.childId, patch);
      } else {
        handleUpdateBlock(target.blockId, patch);
      }
    },
    [handleUpdateBlock, handleUpdateColumnChild],
  );

  const handleUpdateSettings = useCallback(
    (patch: Partial<EmailSettings>) => {
      commitDoc({ ...doc, settings: { ...doc.settings, ...patch } });
    },
    [doc, commitDoc],
  );

  const safeSlug = doc.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'email';

  const handleExportHtml = () => {
    const html = compileEmailToHtml(doc);
    downloadFile(`${safeSlug}.html`, html, 'text/html;charset=utf-8');
    showToast('HTML email downloaded');
  };

  const handleCopyHtml = async () => {
    const html = compileEmailToHtml(doc);
    try {
      await navigator.clipboard.writeText(html);
      showToast('HTML copied to clipboard');
    } catch {
      showToast('Copy failed — use Preview to copy manually');
    }
  };

  const handleExportJson = () => {
    const json = exportDocumentJson(doc);
    downloadFile(`${safeSlug}.json`, json, 'application/json;charset=utf-8');
    showToast('JSON project downloaded');
  };

  const handleImportJson = (raw: string) => {
    try {
      const imported = parseImportedDocumentJson(raw);
      dispatch({ type: 'RESET', doc: imported });
      setSelection(null);
      showToast('JSON template imported');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Invalid JSON file');
    }
  };

  const handleResetEmail = () => {
    const blank = createBlankDocument('Untitled Email');
    clearLocalDocument();
    dispatch({ type: 'RESET', doc: blank });
    setSelection(null);
    showToast('Started a fresh email');
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      <EditorTopBar
        projectName={doc.name}
        onProjectNameChange={(name) => commitDoc({ ...doc, name }, false)}
        canUndo={history.past.length > 0}
        canRedo={history.future.length > 0}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onRedo={() => dispatch({ type: 'REDO' })}
        viewport={viewport}
        onViewportChange={setViewport}
        savedAt={savedAt}
        onSaveNow={() => {
          saveDocumentLocally(doc);
          setSavedAt(Date.now());
          showToast('Saved locally in browser');
        }}
        onPreview={() => setPreviewOpen(true)}
        onExportHtml={handleExportHtml}
        onCopyHtml={handleCopyHtml}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetEmail={handleResetEmail}
        onNavigate={onNavigate}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <BlockPalette onAddBlock={handleAddBlock} />
        <EmailCanvas
          document={doc}
          viewport={viewport}
          selection={selection}
          onSelect={setSelection}
          onInsertBlock={handleInsertBlock}
          onMoveBlock={handleMoveBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onDeleteBlock={handleDeleteBlock}
          onUpdateLeafBlock={handleUpdateLeafBlock}
        />
        <PropertyInspector
          document={doc}
          selection={selection}
          onUpdateSettings={handleUpdateSettings}
          onUpdateBlock={handleUpdateBlock}
          onUpdateColumnChild={handleUpdateColumnChild}
        />
      </div>

      {previewOpen && (
        <PreviewModal
          document={doc}
          onClose={() => setPreviewOpen(false)}
          onDownloadHtml={handleExportHtml}
          onCopyHtml={handleCopyHtml}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};
