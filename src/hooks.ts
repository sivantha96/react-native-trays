/**
 * hooks.ts
 *
 * Provides custom React hooks for interacting with the tray stack context and managing trays.
 */
import { useContext } from 'react';
import type { TrayProps, TrayContextType } from './types';
import { TrayContext } from './context';

/**
 * useTrays
 *
 * Custom React hook to access tray stack manipulation functions for a specific stack.
 * Throws an error if used outside of TrayProvider.
 *
 * @template T - The tray props type.
 * @param stackId - The stack identifier to access.
 * @returns Tray context functions for the given stack.
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
