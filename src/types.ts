/**
 * types.ts
 *
 * Exports TypeScript types and interfaces for tray stack management, context, and configuration.
 * Used throughout the tray provider and related components.
 */
import type { ComponentType } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import type {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
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

interface BlueViewProps extends ViewProps {
  blurReductionFactor?: number;
  tint?:
    | 'light'
    | 'dark'
    | 'default'
    | 'extraLight'
    | 'regular'
    | 'prominent'
    | 'systemUltraThinMaterial'
    | 'systemThinMaterial'
    | 'systemMaterial'
    | 'systemThickMaterial'
    | 'systemChromeMaterial'
    | 'systemUltraThinMaterialLight'
    | 'systemThinMaterialLight'
    | 'systemMaterialLight'
    | 'systemThickMaterialLight'
    | 'systemChromeMaterialLight'
    | 'systemUltraThinMaterialDark'
    | 'systemThinMaterialDark'
    | 'systemMaterialDark'
    | 'systemThickMaterialDark'
    | 'systemChromeMaterialDark';
  intensity?: number;
}
/**
 * TrayStackConfig
 *
 * Configuration options for a tray stack, allowing customization of styles, animations, and behavior.
 */
export interface TrayStackConfig {
  backdropStyles?: ViewStyle;
  backdropPointerEvents?: 'auto' | 'box-none' | 'box-only' | 'none';
  trayStyles?: ViewStyle;
  adjustForKeyboard?: boolean;
  enteringAnimation?: EntryOrExitLayoutType;
  exitingAnimation?: EntryOrExitLayoutType;
  horizontalSpacing?: number;
  dismissOnBackdropPress?: boolean;
  disableBackgroundBlur?: boolean;
  blurViewProps?: BlueViewProps;
  stickToTop?: boolean;
  customTheming?: boolean;
  ignoreSafeArea?: boolean;
  /**
   * Disables the layout animation when components are added to or removed from the view hierarchy.
   * @default false
   */
  disableLayoutAnimation?: boolean;
  /**
   * Lets you animate the layout changes when components are added to or removed
   * from the view hierarchy.
   *
   * You can use the predefined layout transitions (eg. `LinearTransition`,
   * `FadingTransition`) or create your own ones.
   *
   * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions
   */
  customLayoutAnimation?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | LayoutAnimationFunction;
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
  /** Replace the props of a tray by its unique ID */
  replaceById: <K extends keyof T>(trayId: string, props: T[K]) => void;
  /** Replace the props of the top-most tray by tray key. push to the stack if the stack is empty */
  replace: <K extends keyof T>(trayKey: string, props: T[K]) => void;
  /** Replace the tray of a tray by its unique ID with new tray key and props. */
  replaceTrayById: <K extends keyof T>(
    trayId: string,
    newTrayKey: string,
    props: T[K]
  ) => void;
  /** Replace the tray of the top-most tray by tray key with new tray key and props. */
  replaceTray: <K extends keyof T>(
    trayKey: string,
    newTrayKey: string,
    props: T[K]
  ) => void;
  /** Dismiss a tray by tray key. */
  dismiss: (trayKey: string) => void;
  /** Dismiss a tray by its unique ID. */
  dismissById: (trayId: string) => void;
  /** Dismiss all trays in the stack. */
  dismissAll: () => void;
}
