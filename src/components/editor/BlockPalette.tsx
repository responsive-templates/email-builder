import React from 'react';
import {
  Columns2,
  Columns3,
  Heading1,
  Image as ImageIcon,
  LayoutTemplate,
  Minus,
  MousePointerClick,
  PanelBottom,
  Share2,
  Space,
  Type,
} from 'lucide-react';
import type { BlockType } from '../../email/types';

interface BlockPaletteProps {
  onAddBlock: (type: BlockType, columnCount?: 2 | 3) => void;
}

interface PaletteItem {
  type: BlockType;
  columnCount?: 2 | 3;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PALETTE_GROUPS: Array<{ title: string; items: PaletteItem[] }> = [
  {
    title: 'Content Blocks',
    items: [
      {
        type: 'heading',
        label: 'Heading',
        description: 'H1 / H2 / H3 title',
        icon: <Heading1 className="w-4 h-4 text-indigo-600" />,
      },
      {
        type: 'text',
        label: 'Text',
        description: 'Paragraph copy',
        icon: <Type className="w-4 h-4 text-indigo-600" />,
      },
      {
        type: 'image',
        label: 'Image / Logo',
        description: 'Responsive picture',
        icon: <ImageIcon className="w-4 h-4 text-emerald-600" />,
      },
      {
        type: 'button',
        label: 'Button',
        description: 'Call-to-action',
        icon: <MousePointerClick className="w-4 h-4 text-violet-600" />,
      },
    ],
  },
  {
    title: 'Layout & Spacing',
    items: [
      {
        type: 'columns',
        columnCount: 2,
        label: '2 Columns',
        description: '50% / 50% split',
        icon: <Columns2 className="w-4 h-4 text-sky-600" />,
      },
      {
        type: 'columns',
        columnCount: 3,
        label: '3 Columns',
        description: '33% / 33% / 33%',
        icon: <Columns3 className="w-4 h-4 text-sky-600" />,
      },
      {
        type: 'divider',
        label: 'Divider',
        description: 'Horizontal line',
        icon: <Minus className="w-4 h-4 text-slate-600" />,
      },
      {
        type: 'spacer',
        label: 'Spacer',
        description: 'Vertical gap',
        icon: <Space className="w-4 h-4 text-slate-600" />,
      },
    ],
  },
  {
    title: 'Sections & Social',
    items: [
      {
        type: 'header',
        label: 'Header',
        description: 'Logo & nav links',
        icon: <LayoutTemplate className="w-4 h-4 text-amber-600" />,
      },
      {
        type: 'social',
        label: 'Social Icons',
        description: 'X, LinkedIn, IG',
        icon: <Share2 className="w-4 h-4 text-pink-600" />,
      },
      {
        type: 'footer',
        label: 'Footer',
        description: 'Address & unsubscribe',
        icon: <PanelBottom className="w-4 h-4 text-slate-600" />,
      },
    ],
  },
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  const handleDragStart = (e: React.DragEvent, item: PaletteItem) => {
    e.dataTransfer.setData(
      'application/x-email-new-block',
      JSON.stringify({ type: item.type, columnCount: item.columnCount }),
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Blocks</h2>
        <p className="text-[11px] text-slate-400 mt-0.5">Drag onto canvas or click to add</p>
      </div>

      <div className="flex-1 overflow-y-auto editor-scroll p-3 space-y-5">
        {PALETTE_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">
              {group.title}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item) => (
                <button
                  key={`${item.type}-${item.columnCount ?? 0}`}
                  type="button"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => onAddBlock(item.type, item.columnCount)}
                  className="group flex flex-col items-start p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition-all text-left cursor-grab active:cursor-grabbing"
                >
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 flex items-center justify-center mb-2 shadow-2xs">
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 leading-tight">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                    {item.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
