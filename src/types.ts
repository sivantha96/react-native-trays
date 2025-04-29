import type { ComponentType } from 'react';
import type { ViewStyle } from 'react-native';
import type {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
} from 'react-native-reanimated';
import type { ReanimatedKeyframe } from 'react-native-reanimated/lib/typescript/layoutReanimation/animationBuilder/Keyframe';

export interface TrayRegistry {
  [key: string]: {
    component: ComponentType<any>;
  };
}

/** Context accessor type */
export type TrayContextValue = (
  stackId: string
) => TrayContextType<Record<string, unknown>>;

export interface TrayProps {
  [key: string]: unknown;
}

export type EntryOrExitLayoutType =
  | BaseAnimationBuilder
  | typeof BaseAnimationBuilder
  | EntryExitAnimationFunction
  | ReanimatedKeyframe;

export interface TrayStackConfig {
  backdropStyles?: ViewStyle;
  trayStyles?: ViewStyle;
  adjustForKeyboard?: boolean;
  enteringAnimation?: EntryOrExitLayoutType;
  exitingAnimation?: EntryOrExitLayoutType;
  horizontalSpacing?: number;
  defaultBottomSpacing?: number;
  dismissOnBackdropPress?: boolean;
}

export interface TrayContextType<T extends Record<string, unknown>> {
  push: <K extends keyof T>(trayKey: K, props: T[K]) => void;
  pop: () => void;
  replaceById: <K extends keyof T>(trayId: string, props: T[K]) => void;
  replace: <K extends keyof T>(trayKey: string, props: T[K]) => void;
  dismiss: (trayKey: string) => void;
  dismissById: (trayId: string) => void;
  dismissAll: () => void;
}
