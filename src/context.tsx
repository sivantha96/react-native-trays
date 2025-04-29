import { createContext } from 'react';
import type { TrayContextValue } from './types';

/**
 * Internal context for tray stack management
 */
export const TrayContext = createContext<TrayContextValue | undefined>(
  undefined
);
