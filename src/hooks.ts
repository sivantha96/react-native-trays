import { useContext } from 'react';
import type { TrayProps, TrayContextType } from './types';
import { TrayContext } from './context';

/**
 * Hook to access tray functions
 */
export const useTrays = <T extends TrayProps>(
  stackId: string
): TrayContextType<T> => {
  const getContext = useContext(TrayContext);
  if (!getContext) throw new Error('useTrays must be used within TrayProvider');
  const ctx = getContext(stackId);
  if (!ctx) throw new Error('useTrays must be used within TrayProvider');
  return ctx;
};
