import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getVariant } from '@carcompare/data';
import { useToast } from '@carcompare/ui';

export const MAX_COMPARE = 4;
const LS_KEY = 'carcompare.selected';
const Ctx = createContext(null);

function load() {
  try { return (JSON.parse(localStorage.getItem(LS_KEY)) || []).filter(id => getVariant(id)); } catch { return []; }
}

/** Holds the list of variant ids chosen for comparison; persisted to localStorage. */
export function CompareProvider({ children }) {
  const [ids, setIds] = useState(load);
  const toast = useToast();
  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(ids)); } catch {} }, [ids]);

  const isSelected = useCallback(id => ids.includes(id), [ids]);
  const remove = useCallback(id => setIds(prev => prev.filter(x => x !== id)), []);
  const clear = useCallback(() => setIds([]), []);
  const toggle = useCallback(id => {
    let ok = true;
    setIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_COMPARE) { ok = false; return prev; }
      return [...prev, id];
    });
    if (!ok) toast(`You can compare up to ${MAX_COMPARE} variants. Remove one first.`);
    return ok;
  }, [toast]);
  const replaceWith = useCallback(list => setIds(list.slice(0, MAX_COMPARE)), []);

  const value = useMemo(() => ({
    ids, variants: ids.map(getVariant).filter(Boolean), isSelected, toggle, remove, clear, replaceWith, max: MAX_COMPARE,
  }), [ids, isSelected, toggle, remove, clear, replaceWith]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
  return ctx;
}
