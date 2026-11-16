import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Copy, GripVertical, Plus, Trash2 } from 'lucide-react';
import type {
  BlockType,
  EmailBlock,
  EmailDocument,
  LeafBlock,
  SocialPlatform,
} from '../../email/types';

export type SelectionTarget =
  | { kind: 'block'; blockId: string }
  | { kind: 'columnChild'; blockId: string; columnIndex: number; childId: string }
  | null;

interface EmailCanvasProps {
  document: EmailDocument;
  viewport: 'desktop' | 'mobile';
  selection: SelectionTarget;
  onSelect: (target: SelectionTarget) => void;
  onInsertBlock: (type: BlockType, index: number, columnCount?: 2 | 3) => void;
  onMoveBlock: (fromIndex: number, toIndex: number) => void;
  onDuplicateBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateLeafBlock: (
    target: { blockId: string; columnIndex?: number; childId?: string },
    patch: Record<string, unknown>,
  ) => void;
}

const SOCIAL_BADGE: Record<SocialPlatform, string> = {
  twitter: 'X',
  linkedin: 'in',
  instagram: 'IG',
  facebook: 'f',
  youtube: 'YT',
  github: 'GH',
  website: 'Web',
};

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  document: doc,
  viewport,
  selection,
  onSelect,
  onInsertBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onUpdateLeafBlock,
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingBlockIndex, setDraggingBlockIndex] = useState<number | null>(null);

  const handleDropAt = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const newBlockRaw = e.dataTransfer.getData('application/x-email-new-block');
    if (newBlockRaw) {
      try {
        const parsed = JSON.parse(newBlockRaw) as { type: BlockType; columnCount?: 2 | 3 };
        onInsertBlock(parsed.type, targetIndex, parsed.columnCount);
      } catch {
        // ignore invalid payload
      }
      return;
    }

    const moveIndexRaw = e.dataTransfer.getData('application/x-email-move-index');
    if (moveIndexRaw !== '') {
      const fromIndex = Number(moveIndexRaw);
      if (!Number.isNaN(fromIndex)) {
        const adjustedTarget = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
        if (fromIndex !== adjustedTarget) {
          onMoveBlock(fromIndex, adjustedTarget);
        }
      }
    }
    setDraggingBlockIndex(null);
  };

  const renderLeaf = (
    block: LeafBlock,
    loc: { blockId: string; columnIndex?: number; childId?: string },
    isSelected: boolean,
  ) => {
    const fontFamily = doc.settings.fontFamily;

    switch (block.type) {
      case 'header': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
              fontFamily,
            }}
            className="flex items-center justify-between gap-4"
          >
            <div
              className="flex-1"
              style={{ textAlign: p.alignment }}
            >
              {p.logoImageUrl ? (
                <img
                  src={p.logoImageUrl}
                  alt={p.logoText}
                  style={{ width: p.logoWidth, maxWidth: '100%', display: 'inline-block' }}
                />
              ) : (
                <span
                  contentEditable={isSelected}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdateLeafBlock(loc, { logoText: e.currentTarget.textContent || '' })
                  }
                  style={{
                    color: p.textColor,
                    fontSize: 18,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    outline: 'none',
                  }}
                >
                  {p.logoText}
                </span>
              )}
            </div>
            {p.showNav && p.navLinks.length > 0 && (
              <div className="flex items-center gap-4 shrink-0">
                {p.navLinks.map((link, idx) => (
                  <span
                    key={idx}
                    style={{ color: p.textColor, fontSize: 13, fontWeight: 600 }}
                  >
                    {link.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'heading': {
        const p = block.props;
        const Tag = p.level;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
            }}
          >
            <Tag
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateLeafBlock(loc, { text: e.currentTarget.innerText })}
              style={{
                margin: 0,
                fontFamily,
                fontSize: p.fontSize,
                fontWeight: p.fontWeight,
                lineHeight: p.lineHeight,
                color: p.color,
                textAlign: p.alignment,
                outline: 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              {p.text}
            </Tag>
          </div>
        );
      }

      case 'text': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
            }}
          >
            <p
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateLeafBlock(loc, { text: e.currentTarget.innerText })}
              style={{
                margin: 0,
                fontFamily,
                fontSize: p.fontSize,
                lineHeight: p.lineHeight,
                color: p.color,
                textAlign: p.alignment,
                outline: 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              {p.text}
            </p>
          </div>
        );
      }

      case 'image': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
              textAlign: p.alignment,
            }}
          >
            <img
              src={p.src}
              alt={p.alt}
              style={{
                width: `${p.widthPercent}%`,
                maxWidth: '100%',
                borderRadius: p.borderRadius,
                display: 'inline-block',
              }}
            />
          </div>
        );
      }

      case 'button': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor:
                p.containerBackgroundColor === 'transparent'
                  ? undefined
                  : p.containerBackgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
              textAlign: p.alignment,
            }}
          >
            <span
              contentEditable={isSelected}
              suppressContentEditableWarning
              onBlur={(e) => onUpdateLeafBlock(loc, { label: e.currentTarget.textContent || '' })}
              style={{
                display: p.fullWidth ? 'block' : 'inline-block',
                textAlign: 'center',
                backgroundColor: p.backgroundColor,
                color: p.textColor,
                fontFamily,
                fontSize: p.fontSize,
                fontWeight: p.fontWeight,
                borderRadius: p.borderRadius,
                padding: `${p.paddingY}px ${p.paddingX}px`,
                outline: 'none',
                cursor: isSelected ? 'text' : 'pointer',
              }}
            >
              {p.label}
            </span>
          </div>
        );
      }

      case 'divider': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
            }}
          >
            <hr
              style={{
                border: 'none',
                borderTop: `${p.thickness}px ${p.style} ${p.color}`,
                width: `${p.widthPercent}%`,
                margin: '0 auto',
              }}
            />
          </div>
        );
      }

      case 'spacer': {
        const p = block.props;
        return (
          <div
            style={{
              height: p.height,
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
            }}
            className="flex items-center justify-center text-[10px] text-slate-300 select-none"
          >
            {isSelected ? `${p.height}px spacer` : null}
          </div>
        );
      }

      case 'social': {
        const p = block.props;
        const radius = p.iconStyle === 'circle' ? '9999px' : '6px';
        const isOutline = p.iconStyle === 'outline';
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
              textAlign: p.alignment,
            }}
          >
            <div className="inline-flex items-center gap-2.5">
              {p.links.map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    fontFamily,
                    fontSize: 12,
                    fontWeight: 700,
                    color: isOutline ? p.iconBackgroundColor : p.iconColor,
                    backgroundColor: isOutline ? 'transparent' : p.iconBackgroundColor,
                    border: isOutline ? `1px solid ${p.iconBackgroundColor}` : 'none',
                    borderRadius: radius,
                  }}
                >
                  {SOCIAL_BADGE[item.platform]}
                </span>
              ))}
            </div>
          </div>
        );
      }

      case 'footer': {
        const p = block.props;
        return (
          <div
            style={{
              backgroundColor: p.backgroundColor,
              padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
              fontFamily,
              fontSize: p.fontSize,
              lineHeight: 1.6,
              color: p.textColor,
              textAlign: p.alignment,
            }}
          >
            {p.extraText && (
              <p
                contentEditable={isSelected}
                suppressContentEditableWarning
                onBlur={(e) => onUpdateLeafBlock(loc, { extraText: e.currentTarget.innerText })}
                style={{ margin: '0 0 8px 0', outline: 'none' }}
              >
                {p.extraText}
              </p>
            )}
            <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
              {p.companyName}
              {p.address ? ` • ${p.address}` : ''}
            </p>
            {p.unsubscribeText && (
              <p style={{ margin: 0, textDecoration: 'underline' }}>{p.unsubscribeText}</p>
            )}
          </div>
        );
      }
    }
  };

  const renderBlockContent = (block: EmailBlock) => {
    if (block.type !== 'columns') {
      const isSelected = selection?.kind === 'block' && selection.blockId === block.id;
      return renderLeaf(block, { blockId: block.id }, isSelected);
    }

    const p = block.props;
    const isMobile = viewport === 'mobile';
    return (
      <div
        style={{
          backgroundColor: p.backgroundColor === 'transparent' ? undefined : p.backgroundColor,
          padding: `${p.padding.top}px ${p.padding.right}px ${p.padding.bottom}px ${p.padding.left}px`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : `repeat(${p.columnCount}, minmax(0, 1fr))`,
            gap: p.gap,
          }}
        >
          {p.columns.slice(0, p.columnCount).map((colBlocks, colIdx) => (
            <div key={colIdx} className="min-w-0">
              {colBlocks.map((child) => {
                const isChildSelected =
                  selection?.kind === 'columnChild' &&
                  selection.blockId === block.id &&
                  selection.columnIndex === colIdx &&
                  selection.childId === child.id;
                return (
                  <div
                    key={child.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect({
                        kind: 'columnChild',
                        blockId: block.id,
                        columnIndex: colIdx,
                        childId: child.id,
                      });
                    }}
                    className={`relative rounded transition-all cursor-pointer ${
                      isChildSelected
                        ? 'ring-2 ring-indigo-500 ring-offset-1'
                        : 'hover:ring-1 hover:ring-indigo-300'
                    }`}
                  >
                    {renderLeaf(
                      child,
                      { blockId: block.id, columnIndex: colIdx, childId: child.id },
                      isChildSelected,
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DropZone = ({ index }: { index: number }) => {
    const isOver = dragOverIndex === index;
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (dragOverIndex !== index) setDragOverIndex(index);
        }}
        onDragLeave={() => {
          if (dragOverIndex === index) setDragOverIndex(null);
        }}
        onDrop={(e) => handleDropAt(e, index)}
        className={`transition-all ${
          isOver
            ? 'h-8 my-1 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-50/80 flex items-center justify-center text-[11px] font-semibold text-indigo-600'
            : 'h-2'
        }`}
      >
        {isOver ? 'Drop block here' : null}
      </div>
    );
  };

  const containerWidth = viewport === 'mobile' ? 375 : doc.settings.contentWidth;

  return (
    <main
      className="flex-1 overflow-y-auto editor-scroll p-4 sm:p-8 flex flex-col items-center"
      style={{ backgroundColor: doc.settings.canvasColor }}
      onClick={() => onSelect(null)}
    >
      {/* Subject / Preheader Preview Strip */}
      <div
        style={{ width: containerWidth, maxWidth: '100%' }}
        className="mb-3 px-3 py-2 rounded-lg bg-white/80 backdrop-blur border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between gap-2 shadow-2xs"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(null);
        }}
      >
        <div className="truncate">
          <span className="font-semibold text-slate-800">{doc.settings.subject}</span>
          {doc.settings.preheader && (
            <span className="text-slate-400 ml-2">— {doc.settings.preheader}</span>
          )}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 shrink-0">
          {viewport === 'mobile' ? '375px' : `${doc.settings.contentWidth}px`}
        </span>
      </div>

      {/* Email Container */}
      <div
        style={{
          width: containerWidth,
          maxWidth: '100%',
          backgroundColor: doc.settings.contentBackgroundColor,
        }}
        className="rounded-xl shadow-md border border-slate-200/70 transition-all duration-200 overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {doc.blocks.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(0);
            }}
            onDrop={(e) => handleDropAt(e, 0)}
            className="py-20 px-6 text-center border-2 border-dashed border-slate-200 m-4 rounded-xl"
          >
            <Plus className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">Your email canvas is empty</p>
            <p className="text-xs text-slate-400 mt-1">
              Drag or click any block from the left panel to start building.
            </p>
          </div>
        ) : (
          <div className="p-0.5">
            <DropZone index={0} />
            {doc.blocks.map((block, index) => {
              const isSelected =
                (selection?.kind === 'block' && selection.blockId === block.id) ||
                (selection?.kind === 'columnChild' && selection.blockId === block.id);

              return (
                <React.Fragment key={block.id}>
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/x-email-move-index', String(index));
                      e.dataTransfer.effectAllowed = 'move';
                      setDraggingBlockIndex(index);
                    }}
                    onDragEnd={() => {
                      setDraggingBlockIndex(null);
                      setDragOverIndex(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect({ kind: 'block', blockId: block.id });
                    }}
                    className={`group relative transition-all ${
                      draggingBlockIndex === index ? 'opacity-40' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-indigo-600 z-10'
                        : 'hover:ring-1 hover:ring-indigo-300'
                    }`}
                  >
                    {/* Block Floating Controls */}
                    <div
                      className={`absolute -top-3 right-2 flex items-center gap-0.5 bg-indigo-600 text-white rounded-md px-1 py-0.5 shadow-md z-20 transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="p-1 cursor-grab active:cursor-grabbing opacity-80 hover:opacity-100"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-3 h-3" />
                      </span>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => onMoveBlock(index, index - 1)}
                        className="p-1 hover:bg-indigo-500 rounded disabled:opacity-35"
                        title="Move up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={index === doc.blocks.length - 1}
                        onClick={() => onMoveBlock(index, index + 1)}
                        className="p-1 hover:bg-indigo-500 rounded disabled:opacity-35"
                        title="Move down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateBlock(block.id)}
                        className="p-1 hover:bg-indigo-500 rounded"
                        title="Duplicate block"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBlock(block.id)}
                        className="p-1 hover:bg-rose-500 rounded"
                        title="Delete block"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    {renderBlockContent(block)}
                  </div>
                  <DropZone index={index + 1} />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};
