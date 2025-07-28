/**
 * @file types.ts
 * @description This file exports the essential TypeScript types and interfaces for the React Native Trays library.
 * These types define the structure for tray registration, stack management, configuration, and context, ensuring type safety and clarity across the library.
 */

import type { ComponentType, ReactNode } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import type {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';

/**
 * @interface TrayRegistry
 * @description Defines the shape of the tray registry, which maps unique string keys to their corresponding React components.
 * This registry is used by the `TrayProvider` to resolve and render the correct tray component when requested.
 * @property {[key: string]: { component: ComponentType<any> }} - An index signature where each key is a tray identifier and the value is an object containing the tray's React component.
 */
export interface TrayRegistry {
  [key: string]: {
    component: ComponentType<any>;
  };
}

/**
 * @type TrayContextValue
 * @description A function type that provides access to the tray manipulation context for a specific tray stack.
 * When invoked with a `stackId`, it returns an object with methods to interact with that stack, such as `push`, `pop`, and `dismiss`.
 * @param {string} stackId - The unique identifier for the tray stack.
 * @returns {TrayContextType<Record<string, unknown>>} - The context object for the specified stack.
 */
export type TrayContextValue = (
  stackId: string
) => TrayContextType<Record<string, unknown>>;

/**
 * @interface TrayProps
 * @description A base interface for the props that are passed to a tray component.
 * It allows for any number of properties of any type, providing flexibility for custom tray components.
 */
export interface TrayProps {
  [key: string]: unknown;
}

/**
 * @interface StackTray
 * @description Represents a single tray instance within a tray stack.
 * Each object contains the necessary information to render and manage a specific tray.
 * @property {string} id - A unique identifier for this specific tray instance.
 * @property {string} tray - The key corresponding to the tray component in the `TrayRegistry`.
 * @property {unknown} props - The props to be passed to the tray component.
 * @property {string} stackId - The identifier of the stack this tray belongs to.
 */
export interface StackTray {
  id: string;
  tray: string;
  props: unknown;
  stackId: string;
}

/**
 * @interface TrayStack
 * @description Represents a stack of trays.
 * Each stack has a unique ID and contains an array of `StackTray` objects.
 * @property {string} id - The unique identifier for the tray stack.
 * @property {StackTray[]} stack - An array of `StackTray` objects currently in the stack.
 */
export interface TrayStack {
  id: string;
  stack: StackTray[];
}

/**
 * @type EntryOrExitLayoutType
 * @description Defines the types of animations that can be used for a tray's entry and exit transitions.
 * This can be a `BaseAnimationBuilder` instance, a class extending it, an `EntryExitAnimationFunction`, or a `ReanimatedKeyframe` object from `react-native-reanimated`.
 */
export type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

/**
 * @interface BlurViewProps
 * @description Extends `ViewProps` to include properties for configuring the blur effect on the tray backdrop, typically for `expo-blur`.
 * @property {number} [blurReductionFactor] - A factor to reduce the blur intensity. Android only.
 * @property {'light' | 'dark' | 'default' | ...} [tint] - The tint color of the blur view. iOS and Android support different values.
 * @property {number} [intensity] - A number from 1 to 100 to control the intensity of the blur effect. iOS only.
 */
interface BlurViewProps extends ViewProps {
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
 * @interface TrayProviderProps
 * @description Defines the props for the `TrayProvider` component, which is the root component for the tray system.
 * @template T - A generic type that extends `TrayRegistry`, ensuring that the `trays` prop is a valid registry.
 * @property {ReactNode} children - The child components that will be rendered within the provider.
 * @property {T} trays - The tray registry object.
 * @property {Record<string, TrayStackConfig>} [stackConfigs] - An optional mapping of stack IDs to their specific configurations.
 * @property {TrayStackConfig} [defaultStackConfig] - An optional default configuration that applies to all stacks unless overridden.
 */
export interface TrayProviderProps<T extends TrayRegistry> {
  children: ReactNode;
  trays: T;
  stackConfigs?: Record<string, TrayStackConfig>;
  defaultStackConfig?: TrayStackConfig;
}

/**
 * @interface TrayStackConfig
 * @description Defines the configuration options for a tray stack, allowing for extensive customization of its appearance and behavior.
 */
export interface TrayStackConfig {
  /**
   * @property {ViewStyle} [backdropStyles]
   * @description Custom styles for the backdrop view that appears behind the tray.
   * @default {}
   */
  backdropStyles?: ViewStyle;
  /**
   * @property {'auto' | 'box-none' | 'box-only' | 'none'} [backdropPointerEvents]
   * @description Controls whether the backdrop can be the target of touch events.
   * @default 'auto'
   */
  backdropPointerEvents?: 'auto' | 'box-none' | 'box-only' | 'none';
  /**
   * @property {ViewStyle} [trayStyles]
   * @description Custom styles for the tray container itself.
   * @default {}
   */
  trayStyles?: ViewStyle;
  /**
   * @property {boolean} [adjustForKeyboard]
   * @description If `true`, the tray will adjust its position to avoid the on-screen keyboard.
   * @default true
   */
  adjustForKeyboard?: boolean;
  /**
   * @property {EntryOrExitLayoutType} [enteringAnimation]
   * @description The animation to use when a tray enters the screen. From `react-native-reanimated`.
   * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations
   */
  enteringAnimation?: EntryOrExitLayoutType;
  /**
   * @property {EntryOrExitLayoutType} [exitingAnimation]
   * @description The animation to use when a tray exits the screen. From `react-native-reanimated`.
   * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/entering-exiting-animations
   */
  exitingAnimation?: EntryOrExitLayoutType;
  /**
   * @property {number} [horizontalSpacing]
   * @description The horizontal spacing (margin) for the tray from the screen edges.
   * @default 20
   */
  horizontalSpacing?: number;
  /**
   * @property {boolean} [dismissOnBackdropPress]
   * @description If `true`, pressing the backdrop will dismiss the top-most tray.
   * @default true
   */
  dismissOnBackdropPress?: boolean;
  /**
   * @property {boolean} [disableBackgroundBlur]
   * @description If `true`, the blur effect on the backdrop will be disabled.
   * @default false
   */
  disableBackgroundBlur?: boolean;
  /**
   * @property {BlurViewProps} [blurViewProps]
   * @description Props to customize the backdrop's blur effect, passed to the `BlurView` component.
   */
  blurViewProps?: BlurViewProps;
  /**
   * @property {boolean} [enableSwipeToClose]
   * @description If `true`, the tray can be closed by swiping it down or up based on the `stickToTop` property.
   * @default false
   */
  enableSwipeToClose?: boolean;
  /**
   * @property {boolean} [stickToTop]
   * @description If `true`, the tray will be aligned to the top of the screen instead of the bottom.
   * @default false
   */
  stickToTop?: boolean;
  /**
   * @property {boolean} [customTheming]
   * @description A flag to indicate if custom theming is being used, which may affect default styles.
   * @default false
   */
  customTheming?: boolean;
  /**
   * @property {boolean} [ignoreSafeArea]
   * @description If `true`, the tray will ignore the safe area insets and extend to the screen edges.
   * @default false
   */
  ignoreSafeArea?: boolean;
  /**
   * @property {boolean} [disableLayoutAnimation]
   * @description Disables the layout animation when components are added to or removed from the view hierarchy.
   * @default false
   */
  disableLayoutAnimation?: boolean;
  /**
   * @property {BaseAnimationBuilder | typeof BaseAnimationBuilder | LayoutAnimationFunction} [customLayoutAnimation]
   * @description Lets you animate the layout changes when components are added to or removed from the view hierarchy.
   * You can use predefined layout transitions (e.g., `LinearTransition`, `FadingTransition`) or create your own.
   * @see https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions
   */
  customLayoutAnimation?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | LayoutAnimationFunction;

  /**
   * Lets you clip the maximum height of the tray to be inside the safe area.
   * Make sure to use a ScrollView or a relevant component inside the tray
   * to make the items scrollable when the height is clipped
   * @default false
   */
  clipMaxHeightToSafeArea?: boolean;
}

/**
 * @interface TrayContextType
 * @description Defines the set of functions available on the tray context for manipulating a tray stack.
 * @template T - A generic type representing the props of the trays in the stack.
 */
export interface TrayContextType<T extends Record<string, unknown>> {
  /**
   * @method push
   * @description Pushes a new tray onto the stack.
   * @param {K} trayKey - The key of the tray to push, which must be a key in `T`.
   * @param {T[K]} props - The props to pass to the new tray component.
   */
  push: <K extends keyof T>(trayKey: K, props: T[K]) => void;

  /**
   * @method pop
   * @description Removes the top-most tray from the stack.
   */
  pop: () => void;

  /**
   * @method replaceById
   * @description Replaces the props of a specific tray in the stack, identified by its unique ID.
   * @param {string} trayId - The unique ID of the tray to update.
   * @param {T[K]} props - The new props for the tray.
   */
  replaceById: <K extends keyof T>(trayId: string, props: T[K]) => void;

  /**
   * @method replace
   * @description Replaces the props of the top-most tray that matches the given `trayKey`.
   * If no matching tray is found, it pushes a new tray with the given key and props onto the stack.
   * @param {string} trayKey - The key of the tray to replace.
   * @param {T[K]} props - The new props for the tray.
   */
  replace: <K extends keyof T>(trayKey: string, props: T[K]) => void;

  /**
   * @method replaceTrayById
   * @description Replaces a tray component and its props for a tray instance identified by its unique ID.
   * @param {string} trayId - The unique ID of the tray to replace.
   * @param {string} newTrayKey - The key of the new tray component to render.
   * @param {T[K]} props - The props for the new tray component.
   */
  replaceTrayById: <K extends keyof T>(
    trayId: string,
    newTrayKey: string,
    props: T[K]
  ) => void;

  /**
   * @method replaceTray
   * @description Replaces the tray component and props for the top-most tray that matches the given `trayKey`.
   * @param {string} trayKey - The key of the tray to replace.
   * @param {string} newTrayKey - The key of the new tray component.
   * @param {T[K]} props - The props for the new tray component.
   */
  replaceTray: <K extends keyof T>(
    trayKey: string,
    newTrayKey: string,
    props: T[K]
  ) => void;

  /**
   * @method dismiss
   * @description Dismisses all instances of a tray with the given `trayKey` from the stack.
   * @param {string} trayKey - The key of the tray to dismiss.
   */
  dismiss: (trayKey: string) => void;

  /**
   * @method dismissById
   * @description Dismisses a specific tray instance from the stack by its unique ID.
   * @param {string} trayId - The unique ID of the tray to dismiss.
   */
  dismissById: (trayId: string) => void;

  /**
   * @method dismissAll
   * @description Dismisses all trays from the stack, leaving it empty.
   */
  dismissAll: () => void;

  /**
   * @method onDismiss
   * @description Register a callback for when a tray is dismissed.
   * @param {function} callback - The callback function to be invoked when a tray is dismissed.
   */
  onDismiss: (
    callback: (event: {
      stackId: string;
      trayId?: string;
      trayKey?: string;
    }) => void
  ) => void;

  /**
   * @method onDismissAll
   * @description Register a callback for when all trays are dismissed.
   * @param {function} callback - The callback function to be invoked when all trays are dismissed.
   */
  onDismissAll: (callback: (event: { stackId: string }) => void) => void;

  /**
   * @method onBackdropPress
   * @description Register a callback for when the backdrop is pressed.
   * @param {function} callback - The callback function to be invoked when the backdrop is pressed.
   */
  onBackdropPress: (callback: (event: { stackId: string }) => void) => void;
}
