import { describe, expect, it } from 'vitest';
import { cloneBlock, createBlankDocument, createBlock } from '../defaults';
import { createInitialHistory, historyReducer } from '../history';
import { compileEmailToHtml } from '../htmlCompiler';
import {
  exportDocumentJson,
  isValidEmailDocument,
  parseImportedDocumentJson,
} from '../storage';
import { TEMPLATES } from '../../templates';

describe('Email HTML Compiler', () => {
  it('compiles a blank document into table-based XHTML with MSO conditionals and responsive CSS', () => {
    const doc = createBlankDocument('Test Campaign');
    const html = compileEmailToHtml(doc);

    expect(html).toContain('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"');
    expect(html).toContain('role="presentation"');
    expect(html).toContain('<!--[if mso]>');
    expect(html).toContain('@media only screen and (max-width: 620px)');
    expect(html).toContain('.stack-column');
    expect(html).toContain(doc.settings.preheader);
  });

  it('escapes HTML special characters in user text', () => {
    const doc = createBlankDocument('XSS Check');
    doc.blocks = [
      {
        id: 'h1',
        type: 'heading',
        props: {
          text: 'Hello <script>alert(1)</script> & "Friends"',
          level: 'h1',
          fontSize: 24,
          fontWeight: '700',
          color: '#000000',
          backgroundColor: 'transparent',
          alignment: 'left',
          lineHeight: 1.2,
          padding: { top: 10, right: 10, bottom: 10, left: 10 },
        },
      },
    ];
    const html = compileEmailToHtml(doc);
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;Friends&quot;');
  });

  it('compiles 2-column and 3-column layouts with stack-column classes', () => {
    const doc = createBlankDocument('Columns');
    doc.blocks = [createBlock('columns', 2), createBlock('columns', 3)];
    const html = compileEmailToHtml(doc);
    expect(html).toContain('class="stack-column"');
    expect(html).toContain('width="50%"');
    expect(html).toContain('width="33%"');
  });
});

describe('Templates & JSON Validation', () => {
  it('has 20 valid responsive templates that compile cleanly to HTML', () => {
    expect(TEMPLATES.length).toBe(20);
    for (const tpl of TEMPLATES) {
      expect(isValidEmailDocument(tpl.document)).toBe(true);
      const html = compileEmailToHtml(tpl.document);
      expect(html).toContain('<table role="presentation"');
      expect(html.length).toBeGreaterThan(500);
    }
  });

  it('round-trips JSON export and import', () => {
    const doc = createBlankDocument('Portable');
    const json = exportDocumentJson(doc);
    const parsed = parseImportedDocumentJson(json);
    expect(parsed.name).toBe('Portable');
    expect(parsed.blocks.length).toBe(doc.blocks.length);
  });

  it('rejects invalid JSON documents', () => {
    expect(() => parseImportedDocumentJson('{"version":2}')).toThrow();
  });

  it('clones blocks with fresh unique IDs', () => {
    const original = createBlock('columns', 2);
    const cloned = cloneBlock(original);
    expect(cloned.id).not.toBe(original.id);
    if (original.type === 'columns' && cloned.type === 'columns') {
      expect(cloned.props.columns[0][0].id).not.toBe(original.props.columns[0][0].id);
    }
  });
});

describe('History Undo/Redo Reducer', () => {
  it('supports undo and redo transitions', () => {
    const doc1 = createBlankDocument('Step 1');
    const doc2 = createBlankDocument('Step 2');
    const doc3 = createBlankDocument('Step 3');

    let state = createInitialHistory(doc1);
    state = historyReducer(state, { type: 'SET', doc: doc2 });
    state = historyReducer(state, { type: 'SET', doc: doc3 });
    expect(state.present.name).toBe('Step 3');

    state = historyReducer(state, { type: 'UNDO' });
    expect(state.present.name).toBe('Step 2');

    state = historyReducer(state, { type: 'UNDO' });
    expect(state.present.name).toBe('Step 1');

    state = historyReducer(state, { type: 'REDO' });
    expect(state.present.name).toBe('Step 2');
  });
});
