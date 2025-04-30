/**
 * index.tsx
 *
 * Entry point for the tray provider module. Re-exports public API for consumers.
 */
export { TrayProvider, type TrayProviderProps } from './TrayProvider';
export { useTrays } from './hooks';
export {
  type TrayRegistry,
  type TrayStackConfig,
  type TrayContextValue,
  type TrayContextType,
} from './types';
