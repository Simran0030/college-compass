import { createContext, useContext, useState, ReactNode } from 'react';

interface CompareContextType {
  compareIds: number[];
  addCollege: (id: number) => void;
  removeCollege: (id: number) => void;
  clearAll: () => void;
  isSelected: (id: number) => boolean;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const addCollege = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id) || prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const removeCollege = (id: number) => {
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
  };

  const clearAll = () => setCompareIds([]);

  const isSelected = (id: number) => compareIds.includes(id);

  const canAdd = compareIds.length < 3;

  return (
    <CompareContext.Provider value={{ compareIds, addCollege, removeCollege, clearAll, isSelected, canAdd }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
