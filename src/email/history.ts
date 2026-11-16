import type { EmailDocument } from './types';

export interface HistoryState {
  past: EmailDocument[];
  present: EmailDocument;
  future: EmailDocument[];
}

export type HistoryAction =
  | { type: 'SET'; doc: EmailDocument; recordHistory?: boolean }
  | { type: 'RESET'; doc: EmailDocument }
  | { type: 'UNDO' }
  | { type: 'REDO' };

const MAX_HISTORY = 50;

export function createInitialHistory(doc: EmailDocument): HistoryState {
  return {
    past: [],
    present: doc,
    future: [],
  };
}

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'SET': {
      if (action.recordHistory === false) {
        return {
          ...state,
          present: action.doc,
        };
      }
      const nextPast = [...state.past, state.present].slice(-MAX_HISTORY);
      return {
        past: nextPast,
        present: action.doc,
        future: [],
      };
    }
    case 'RESET':
      return {
        past: [],
        present: action.doc,
        future: [],
      };
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const nextPast = state.past.slice(0, -1);
      return {
        past: nextPast,
        present: previous,
        future: [state.present, ...state.future].slice(0, MAX_HISTORY),
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const nextFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: next,
        future: nextFuture,
      };
    }
  }
}
