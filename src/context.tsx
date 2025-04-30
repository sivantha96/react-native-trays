/**
 * context.tsx
 *
 * Exports the TrayContext for tray stack management, used internally by TrayProvider and related hooks.
 */
import { createContext } from 'react';
import type { TrayContextValue } from './types';

/**
 * TrayContext
 *
 * Internal React context for tray stack management, providing access to tray stack manipulation functions.
 * Should only be accessed via the TrayProvider and useTrays hook.
 */
export const TrayContext = createContext<TrayContextValue | undefined>(
  undefined
);
