/**
 * types.ts
 *
 * Exports TypeScript types and interfaces for tray stack management, context, and configuration.
 * Used throughout the tray provider and related components.
 */
import type { ComponentType } from 'react';
import type { ViewStyle } from 'react-native';
import type {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
} from 'react-native-reanimated';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';

/**
 * TrayRegistry
 *
 * Maps tray keys to their respective React component definitions.
 * Used to register available trays with the provider.
 */
export interface TrayRegistry {
  [key: string]: {
    component: ComponentType<any>;
  };
}

/**
 * TrayContextValue
 *
 * Function type for accessing the tray context for a given stack ID.
 * Returns the context manipulation functions for the stack.
 */
export type TrayContextValue = (
  stackId: string
) => TrayContextType<Record<string, unknown>>;

/**
 * TrayProps
 *
 * Base type for props passed to tray components.
 */
export interface TrayProps {
  [key: string]: unknown;
}

/**
 * EntryOrExitLayoutType
 *
 * Supported types for entry/exit tray animations.
 */
export type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

/**
 * TrayStackConfig
 *
 * Configuration options for a tray stack, allowing customization of styles, animations, and behavior.
 */
export interface TrayStackConfig {
  backdropStyles?: ViewStyle;
  trayStyles?: ViewStyle;
  adjustForKeyboard?: boolean;
  enteringAnimation?: EntryOrExitLayoutType;
  exitingAnimation?: EntryOrExitLayoutType;
  horizontalSpacing?: number;
  dismissOnBackdropPress?: boolean;
  disableBackgroundBlur?: boolean;
  stickToTop?: boolean;
}

/**
 * TrayContextType
 *
 * Interface for tray stack manipulation functions, exposed by the context and hook.
 *
 * @template T - The tray props type.
 */
export interface TrayContextType<T extends Record<string, unknown>> {
  /** Push a new tray onto the stack. */
  push: <K extends keyof T>(trayKey: K, props: T[K]) => void;
  /** Pop the top-most tray from the stack. */
  pop: () => void;
  /** Replace a tray by its unique ID. */
  replaceById: <K extends keyof T>(trayId: string, props: T[K]) => void;
  /** Replace the top-most tray by tray key. */
  replace: <K extends keyof T>(trayKey: string, props: T[K]) => void;
  /** Dismiss a tray by tray key. */
  dismiss: (trayKey: string) => void;
  /** Dismiss a tray by its unique ID. */
  dismissById: (trayId: string) => void;
  /** Dismiss all trays in the stack. */
  dismissAll: () => void;
}
