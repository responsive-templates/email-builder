import React, { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Plus,
  Settings,
  Sliders,
  Trash2,
} from 'lucide-react';
import type {
  Alignment,
  EmailBlock,
  EmailDocument,
  EmailSettings,
  LeafBlock,
  Padding,
  SocialPlatform,
} from '../../email/types';
import type { SelectionTarget } from './EmailCanvas';

interface PropertyInspectorProps {
  document: EmailDocument;
  selection: SelectionTarget;
  onUpdateSettings: (patch: Partial<EmailSettings>) => void;
  onUpdateBlock: (blockId: string, patch: Record<string, unknown>) => void;
  onUpdateColumnChild: (
    blockId: string,
    columnIndex: number,
    childId: string,
    patch: Record<string, unknown>,
  ) => void;
}

const FONT_FAMILIES = [
  { label: 'Arial (Email Safe)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Helvetica / Sans', value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { label: 'Georgia (Serif)', value: "Georgia, 'Times New Roman', serif" },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: 'Courier New (Mono)', value: "'Courier New', Courier, monospace" },
];

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-600 mb-1">{children}</label>
);

const ColorField: React.FC<{
  label: string;
  value: string;
  allowTransparent?: boolean;
  onChange: (val: string) => void;
}> = ({ label, value, allowTransparent, onChange }) => {
  const isTransparent = value === 'transparent';
  const pickerVal = isTransparent ? '#ffffff' : value;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <FieldLabel>{label}</FieldLabel>
        {allowTransparent && (
          <button
            type="button"
            onClick={() => onChange(isTransparent ? '#ffffff' : 'transparent')}
            className="text-[10px] text-indigo-600 hover:underline"
          >
            {isTransparent ? 'Set color' : 'Clear'}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={pickerVal}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-md border border-slate-200 cursor-pointer p-0.5 bg-white shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 font-mono text-slate-700 focus:border-indigo-500 outline-none"
        />
      </div>
    </div>
  );
};

const AlignmentField: React.FC<{
  value: Alignment;
  onChange: (val: Alignment) => void;
}> = ({ value, onChange }) => (
  <div>
    <FieldLabel>Alignment</FieldLabel>
    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
      {(['left', 'center', 'right'] as Alignment[]).map((align) => (
        <button
          key={align}
          type="button"
          onClick={() => onChange(align)}
          className={`py-1.5 rounded-md flex items-center justify-center transition-all ${
            value === align
              ? 'bg-white text-indigo-600 shadow-2xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {align === 'left' && <AlignLeft className="w-3.5 h-3.5" />}
          {align === 'center' && <AlignCenter className="w-3.5 h-3.5" />}
          {align === 'right' && <AlignRight className="w-3.5 h-3.5" />}
        </button>
      ))}
    </div>
  </div>
);

const PaddingFields: React.FC<{
  value: Padding;
  onChange: (p: Padding) => void;
}> = ({ value, onChange }) => (
  <div>
    <FieldLabel>Padding (px)</FieldLabel>
    <div className="grid grid-cols-4 gap-1.5">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <div key={side}>
          <span className="block text-[10px] text-slate-400 capitalize mb-0.5">{side}</span>
          <input
            type="number"
            min={0}
            max={120}
            value={value[side]}
            onChange={(e) => onChange({ ...value, [side]: Number(e.target.value) || 0 })}
            className="w-full text-xs border border-slate-200 rounded-md px-1.5 py-1 text-slate-700 focus:border-indigo-500 outline-none"
          />
        </div>
      ))}
    </div>
  </div>
);

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  document: doc,
  selection,
  onUpdateSettings,
  onUpdateBlock,
  onUpdateColumnChild,
}) => {
  const [tab, setTab] = useState<'block' | 'email'>('block');

  // Resolve selected block or column child
  let selectedBlock: EmailBlock | undefined;
  let selectedChild: LeafBlock | undefined;

  if (selection?.kind === 'block') {
    selectedBlock = doc.blocks.find((b) => b.id === selection.blockId);
  } else if (selection?.kind === 'columnChild') {
    const parent = doc.blocks.find((b) => b.id === selection.blockId);
    if (parent && parent.type === 'columns') {
      selectedChild = parent.props.columns[selection.columnIndex]?.find(
        (c) => c.id === selection.childId,
      );
    }
  }

  const activeLeaf: LeafBlock | undefined =
    selectedChild ?? (selectedBlock && selectedBlock.type !== 'columns' ? selectedBlock : undefined);

  const showEmailTab = tab === 'email' || (!selectedBlock && !selectedChild);

  const updateActiveLeaf = (patch: Record<string, unknown>) => {
    if (selection?.kind === 'columnChild') {
      onUpdateColumnChild(selection.blockId, selection.columnIndex, selection.childId, patch);
    } else if (selection?.kind === 'block') {
      onUpdateBlock(selection.blockId, patch);
    }
  };

  const renderLeafControls = (block: LeafBlock) => {
    switch (block.type) {
      case 'heading': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Heading Text</FieldLabel>
              <textarea
                rows={3}
                value={p.text}
                onChange={(e) => updateActiveLeaf({ text: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Tag Level</FieldLabel>
                <select
                  value={p.level}
                  onChange={(e) => updateActiveLeaf({ level: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                </select>
              </div>
              <div>
                <FieldLabel>Font Size (px)</FieldLabel>
                <input
                  type="number"
                  min={14}
                  max={60}
                  value={p.fontSize}
                  onChange={(e) => updateActiveLeaf({ fontSize: Number(e.target.value) || 24 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
            </div>
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <ColorField label="Text Color" value={p.color} onChange={(v) => updateActiveLeaf({ color: v })} />
            <ColorField
              label="Background"
              value={p.backgroundColor}
              allowTransparent
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'text': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Text Content</FieldLabel>
              <textarea
                rows={5}
                value={p.text}
                onChange={(e) => updateActiveLeaf({ text: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Font Size (px)</FieldLabel>
                <input
                  type="number"
                  min={11}
                  max={32}
                  value={p.fontSize}
                  onChange={(e) => updateActiveLeaf({ fontSize: Number(e.target.value) || 16 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
              <div>
                <FieldLabel>Line Height</FieldLabel>
                <input
                  type="number"
                  step={0.1}
                  min={1}
                  max={2.5}
                  value={p.lineHeight}
                  onChange={(e) => updateActiveLeaf({ lineHeight: Number(e.target.value) || 1.6 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
            </div>
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <ColorField label="Text Color" value={p.color} onChange={(v) => updateActiveLeaf({ color: v })} />
            <ColorField
              label="Background"
              value={p.backgroundColor}
              allowTransparent
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'image': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Image URL</FieldLabel>
              <input
                type="url"
                value={p.src}
                onChange={(e) => updateActiveLeaf({ src: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Alt Text</FieldLabel>
              <input
                type="text"
                value={p.alt}
                onChange={(e) => updateActiveLeaf({ alt: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Link URL (optional)</FieldLabel>
              <input
                type="url"
                value={p.href}
                onChange={(e) => updateActiveLeaf({ href: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Width (%)</FieldLabel>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={p.widthPercent}
                  onChange={(e) =>
                    updateActiveLeaf({
                      widthPercent: Math.min(100, Math.max(10, Number(e.target.value) || 100)),
                    })
                  }
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
              <div>
                <FieldLabel>Radius (px)</FieldLabel>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={p.borderRadius}
                  onChange={(e) => updateActiveLeaf({ borderRadius: Number(e.target.value) || 0 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
            </div>
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'button': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Button Label</FieldLabel>
              <input
                type="text"
                value={p.label}
                onChange={(e) => updateActiveLeaf({ label: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Button URL</FieldLabel>
              <input
                type="url"
                value={p.href}
                onChange={(e) => updateActiveLeaf({ href: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <ColorField
              label="Button Color"
              value={p.backgroundColor}
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
            <ColorField
              label="Text Color"
              value={p.textColor}
              onChange={(v) => updateActiveLeaf({ textColor: v })}
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FieldLabel>Font Size</FieldLabel>
                <input
                  type="number"
                  min={12}
                  max={24}
                  value={p.fontSize}
                  onChange={(e) => updateActiveLeaf({ fontSize: Number(e.target.value) || 15 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
              <div>
                <FieldLabel>Radius (px)</FieldLabel>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={p.borderRadius}
                  onChange={(e) => updateActiveLeaf({ borderRadius: Number(e.target.value) || 0 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={p.fullWidth}
                onChange={(e) => updateActiveLeaf({ fullWidth: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600"
              />
              Full width button
            </label>
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'divider': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <ColorField label="Line Color" value={p.color} onChange={(v) => updateActiveLeaf({ color: v })} />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <FieldLabel>Thickness</FieldLabel>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={p.thickness}
                  onChange={(e) => updateActiveLeaf({ thickness: Number(e.target.value) || 1 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
              <div>
                <FieldLabel>Width %</FieldLabel>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={p.widthPercent}
                  onChange={(e) => updateActiveLeaf({ widthPercent: Number(e.target.value) || 100 })}
                  className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5"
                />
              </div>
              <div>
                <FieldLabel>Style</FieldLabel>
                <select
                  value={p.style}
                  onChange={(e) => updateActiveLeaf({ style: e.target.value })}
                  className="w-full text-xs border border-slate-200 rounded-md px-1.5 py-1.5 bg-white"
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                </select>
              </div>
            </div>
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'spacer': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Height (px)</FieldLabel>
              <input
                type="number"
                min={4}
                max={160}
                value={p.height}
                onChange={(e) => updateActiveLeaf({ height: Number(e.target.value) || 16 })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <ColorField
              label="Background"
              value={p.backgroundColor}
              allowTransparent
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
          </div>
        );
      }

      case 'header': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Brand / Logo Text</FieldLabel>
              <input
                type="text"
                value={p.logoText}
                onChange={(e) => updateActiveLeaf({ logoText: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Logo Image URL (optional)</FieldLabel>
              <input
                type="url"
                value={p.logoImageUrl}
                onChange={(e) => updateActiveLeaf({ logoImageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={p.showNav}
                onChange={(e) => updateActiveLeaf({ showNav: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600"
              />
              Show navigation links
            </label>
            <ColorField
              label="Background"
              value={p.backgroundColor}
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
            <ColorField label="Text Color" value={p.textColor} onChange={(v) => updateActiveLeaf({ textColor: v })} />
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'social': {
        const p = block.props;
        const platforms: SocialPlatform[] = [
          'twitter',
          'linkedin',
          'instagram',
          'facebook',
          'youtube',
          'github',
          'website',
        ];
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Icon Style</FieldLabel>
              <select
                value={p.iconStyle}
                onChange={(e) => updateActiveLeaf({ iconStyle: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
              >
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="outline">Outline</option>
              </select>
            </div>
            <ColorField
              label="Icon Accent Color"
              value={p.iconBackgroundColor}
              onChange={(v) => updateActiveLeaf({ iconBackgroundColor: v })}
            />
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <FieldLabel>Social Links</FieldLabel>
                <button
                  type="button"
                  onClick={() =>
                    updateActiveLeaf({
                      links: [
                        ...p.links,
                        { platform: 'website', url: 'https://example.com', label: 'Website' },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {p.links.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <select
                      value={item.platform}
                      onChange={(e) => {
                        const next = [...p.links];
                        next[idx] = {
                          ...item,
                          platform: e.target.value as SocialPlatform,
                          label: e.target.value,
                        };
                        updateActiveLeaf({ links: next });
                      }}
                      className="text-xs border border-slate-200 rounded-md px-1.5 py-1 bg-white w-24 shrink-0"
                    >
                      {platforms.map((pl) => (
                        <option key={pl} value={pl}>
                          {pl}
                        </option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => {
                        const next = [...p.links];
                        next[idx] = { ...item, url: e.target.value };
                        updateActiveLeaf({ links: next });
                      }}
                      className="w-full text-xs border border-slate-200 rounded-md px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateActiveLeaf({ links: p.links.filter((_, i) => i !== idx) })
                      }
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }

      case 'footer': {
        const p = block.props;
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel>Company Name</FieldLabel>
              <input
                type="text"
                value={p.companyName}
                onChange={(e) => updateActiveLeaf({ companyName: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <input
                type="text"
                value={p.address}
                onChange={(e) => updateActiveLeaf({ address: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Footer Note</FieldLabel>
              <textarea
                rows={2}
                value={p.extraText}
                onChange={(e) => updateActiveLeaf({ extraText: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Unsubscribe Label</FieldLabel>
              <input
                type="text"
                value={p.unsubscribeText}
                onChange={(e) => updateActiveLeaf({ unsubscribeText: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <ColorField
              label="Background"
              value={p.backgroundColor}
              onChange={(v) => updateActiveLeaf({ backgroundColor: v })}
            />
            <ColorField label="Text Color" value={p.textColor} onChange={(v) => updateActiveLeaf({ textColor: v })} />
            <AlignmentField value={p.alignment} onChange={(v) => updateActiveLeaf({ alignment: v })} />
            <PaddingFields value={p.padding} onChange={(v) => updateActiveLeaf({ padding: v })} />
          </div>
        );
      }
    }
  };

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200 p-1.5 gap-1 bg-slate-50">
        <button
          type="button"
          onClick={() => setTab('block')}
          disabled={!selectedBlock && !selectedChild}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
            !showEmailTab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Block
        </button>
        <button
          type="button"
          onClick={() => setTab('email')}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            showEmailTab ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          Email Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto editor-scroll p-4">
        {showEmailTab ? (
          <div className="space-y-4">
            <div>
              <FieldLabel>Subject Line</FieldLabel>
              <input
                type="text"
                value={doc.settings.subject}
                onChange={(e) => onUpdateSettings({ subject: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Preheader Text</FieldLabel>
              <textarea
                rows={2}
                value={doc.settings.preheader}
                onChange={(e) => onUpdateSettings({ preheader: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <div>
              <FieldLabel>Font Family</FieldLabel>
              <select
                value={doc.settings.fontFamily}
                onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Content Width (px)</FieldLabel>
              <input
                type="number"
                min={480}
                max={720}
                step={10}
                value={doc.settings.contentWidth}
                onChange={(e) =>
                  onUpdateSettings({
                    contentWidth: Math.min(720, Math.max(480, Number(e.target.value) || 600)),
                  })
                }
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <ColorField
              label="Canvas Background"
              value={doc.settings.canvasColor}
              onChange={(v) => onUpdateSettings({ canvasColor: v })}
            />
            <ColorField
              label="Email Body Background"
              value={doc.settings.contentBackgroundColor}
              onChange={(v) => onUpdateSettings({ contentBackgroundColor: v })}
            />
          </div>
        ) : activeLeaf ? (
          <div>
            <div className="mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {activeLeaf.type} Block
              </span>
              {selectedChild && (
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                  Inside Column
                </span>
              )}
            </div>
            {renderLeafControls(activeLeaf)}
          </div>
        ) : selectedBlock?.type === 'columns' ? (
          <div className="space-y-4">
            <div className="mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Columns Layout
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any item inside a column on the canvas to edit its text or style.
              </p>
            </div>
            <div>
              <FieldLabel>Column Gap (px)</FieldLabel>
              <input
                type="number"
                min={0}
                max={40}
                value={selectedBlock.props.gap}
                onChange={(e) =>
                  onUpdateBlock(selectedBlock!.id, { gap: Number(e.target.value) || 0 })
                }
                className="w-full text-xs border border-slate-200 rounded-md px-2.5 py-1.5"
              />
            </div>
            <ColorField
              label="Background"
              value={selectedBlock.props.backgroundColor}
              allowTransparent
              onChange={(v) => onUpdateBlock(selectedBlock!.id, { backgroundColor: v })}
            />
            <PaddingFields
              value={selectedBlock.props.padding}
              onChange={(v) => onUpdateBlock(selectedBlock!.id, { padding: v })}
            />
          </div>
        ) : null}
      </div>
    </aside>
  );
};
