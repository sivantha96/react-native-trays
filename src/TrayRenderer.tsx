/**
 * TrayRenderer.tsx
 *
 * Renders a single tray component with animation and keyboard adjustment support.
 * Handles tray position, animation, and keyboard-aware behavior for tray UI.
 */
import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Platform,
  Keyboard,
  type KeyboardEvent,
  StyleSheet,
  type DimensionValue,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
  FadeInDown,
  FadeOutDown,
} from 'react-native-reanimated';
import type { TrayStackConfig } from './types';
import { type EdgeInsets } from 'react-native-safe-area-context';
import { DEVICE_HEIGHT } from './constants';

/**
 * Props for TrayRenderer component.
 * @property trayKey - Unique key for the tray instance.
 * @property trayProps - Props to pass to the tray component.
 * @property config - Tray stack configuration.
 * @property TrayComponent - The tray component to render.
 * @property insets - Safe area insets for proper positioning.
 */
interface TrayRendererProps<T = Record<string, unknown>> {
  trayKey: string;
  trayProps: T;
  config: TrayStackConfig;
  TrayComponent: React.ComponentType<T>;
  insets: EdgeInsets;
}

/**
 * Constants for consistent behavior across the component
 */
const CONSTANTS = {
  ANIMATION_TIMING: {
    ios: { show: 60, hide: 90 },
    android: { show: 10, hide: 20 },
  },
  DEFAULT_HORIZONTAL_SPACING: 20,
  DEFAULT_BORDER_RADIUS: 30,
  FADE_IN_DURATION: 180,
  FADE_OUT_DURATION: 120,
  LAYOUT_TRANSITION_DURATION: 150,
  SHADOW_OFFSET: { width: 0, height: 5 },
  SHADOW_OPACITY: 0.25,
  SHADOW_RADIUS: 40,
  ELEVATION: 10,
  Z_INDEX: 999,
} as const;

/**
 * Keyboard behavior configuration type for better type safety
 */
type KeyboardBehavior = {
  adjustForKeyboard: boolean;
  clipMaxHeightToSafeArea: boolean;
};

/**
 * Shallow comparison utility for props
 */
const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object')
    return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
};

/**
 * Get keyboard animation configuration based on platform
 */
const getKeyboardAnimationConfig = (platform: typeof Platform.OS) => ({
  duration: CONSTANTS.ANIMATION_TIMING[platform as 'ios' | 'android'].show,
  easing: Easing.out(Easing.ease),
});

const getKeyboardHideAnimationConfig = (platform: typeof Platform.OS) => ({
  duration: CONSTANTS.ANIMATION_TIMING[platform as 'ios' | 'android'].hide,
  easing: Easing.out(Easing.ease),
});

/**
 * Calculate keyboard adjustments based on configuration
 */
const calculateKeyboardAdjustments = (
  keyboardHeight: number,
  behavior: KeyboardBehavior,
  maxAllowedHeight: number,
  insetsBottom: number
) => {
  const { adjustForKeyboard, clipMaxHeightToSafeArea } = behavior;
  const isAndroid = Platform.OS === 'android';

  // Define adjustment strategies
  const strategies = {
    noAdjustment: {
      bottom: isAndroid ? -keyboardHeight : insetsBottom,
      maxHeight: maxAllowedHeight,
    },
    adjustOnly: {
      bottom: isAndroid ? 0 : keyboardHeight,
      maxHeight: maxAllowedHeight,
    },
    clipOnly: {
      bottom: isAndroid ? -keyboardHeight : insetsBottom,
      maxHeight: maxAllowedHeight,
    },
    adjustAndClip: {
      bottom: isAndroid ? 0 : keyboardHeight,
      maxHeight: maxAllowedHeight - keyboardHeight + insetsBottom,
    },
    hide: {
      bottom: insetsBottom,
      maxHeight: maxAllowedHeight,
    },
  };

  if (!adjustForKeyboard && !clipMaxHeightToSafeArea) {
    return strategies.noAdjustment;
  }
  if (adjustForKeyboard && !clipMaxHeightToSafeArea) {
    return strategies.adjustOnly;
  }
  if (!adjustForKeyboard && clipMaxHeightToSafeArea) {
    return strategies.clipOnly;
  }
  if (adjustForKeyboard && clipMaxHeightToSafeArea) {
    return strategies.adjustAndClip;
  }

  return strategies.hide;
};

/**
 * TrayRenderer
 *
 * Renders the given tray component with animation and keyboard-aware adjustments.
 * Handles tray position, entry/exit animations, and safe area insets.
 */
const TrayRendererComponent = <
  T extends Record<string, unknown> = Record<string, unknown>,
>({
  trayKey,
  trayProps,
  config,
  TrayComponent,
  insets,
}: TrayRendererProps<T>) => {
  const trayBottom = useSharedValue(insets.bottom);

  const maxAllowedHeight = useMemo(
    () =>
      Math.round(DEVICE_HEIGHT) -
      (Math.round(insets.top) + Math.round(insets.bottom)),
    [insets.bottom, insets.top]
  );

  const maxHeight = useSharedValue<DimensionValue>(maxAllowedHeight);

  // Memoize keyboard behavior to prevent unnecessary recalculations
  const keyboardBehavior = useMemo(
    () => ({
      adjustForKeyboard: config.adjustForKeyboard ?? false,
      clipMaxHeightToSafeArea: config.clipMaxHeightToSafeArea ?? false,
    }),
    [config.adjustForKeyboard, config.clipMaxHeightToSafeArea]
  );

  const handleKeyboardShow = useCallback(
    (e: KeyboardEvent) => {
      const keyboardHeight = e.endCoordinates.height;
      const timingConfig = getKeyboardAnimationConfig(Platform.OS);

      const adjustments = calculateKeyboardAdjustments(
        keyboardHeight,
        keyboardBehavior,
        maxAllowedHeight,
        insets.bottom
      );

      trayBottom.value = withTiming(adjustments.bottom, timingConfig);
      maxHeight.value = withTiming(adjustments.maxHeight, timingConfig);
    },
    [keyboardBehavior, maxAllowedHeight, insets.bottom, maxHeight, trayBottom]
  );

  const handleKeyboardHide = useCallback(() => {
    const timingConfig = getKeyboardHideAnimationConfig(Platform.OS);

    // Reset to default position when keyboard hides
    trayBottom.value = withTiming(insets.bottom, timingConfig);
    maxHeight.value = withTiming(maxAllowedHeight, timingConfig);
  }, [insets.bottom, maxAllowedHeight, maxHeight, trayBottom]);

  // Consolidated keyboard listener effect - optimized dependencies
  useEffect(() => {
    const showEventName =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEventName =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEventName, handleKeyboardShow);
    const hideSub = Keyboard.addListener(hideEventName, handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  // Update shared values when insets change
  useEffect(() => {
    trayBottom.value = insets.bottom;
    maxHeight.value = maxAllowedHeight;
  }, [insets.bottom, maxAllowedHeight, maxHeight, trayBottom]);

  // Memoized animated styles with proper worklet functions
  const trayAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const customOffset = config.stickToTop
      ? typeof config.trayStyles?.top === 'number'
        ? config.trayStyles.top
        : 0
      : typeof config.trayStyles?.bottom === 'number'
        ? config.trayStyles.bottom
        : 0;

    return config.stickToTop
      ? { top: insets.top + customOffset }
      : { bottom: trayBottom.value + customOffset };
  }, [
    config.stickToTop,
    config.trayStyles?.top,
    config.trayStyles?.bottom,
    insets.top,
  ]);

  const trayAnimatedHeight = useAnimatedStyle(() => {
    'worklet';
    return { maxHeight: maxHeight.value };
  }, []);

  // Memoized style calculations with extracted constants
  const staticStyles = useMemo(
    () => ({
      backgroundColor: config.customTheming ? undefined : '#fff',
      shadowColor: config.customTheming ? undefined : '#000',
      left:
        insets.left +
        (config.horizontalSpacing ?? CONSTANTS.DEFAULT_HORIZONTAL_SPACING),
      right:
        insets.right +
        (config.horizontalSpacing ?? CONSTANTS.DEFAULT_HORIZONTAL_SPACING),
    }),
    [config.customTheming, config.horizontalSpacing, insets.left, insets.right]
  );

  const layoutTransition = useMemo(
    () =>
      config.disableLayoutAnimation
        ? undefined
        : (config.customLayoutAnimation ??
          LinearTransition.easing(Easing.out(Easing.ease)).duration(
            CONSTANTS.LAYOUT_TRANSITION_DURATION
          )),
    [config.disableLayoutAnimation, config.customLayoutAnimation]
  );

  const { enteringAnimation = SlideInDown, exitingAnimation = SlideOutDown } =
    config;

  // Memoized tray props to prevent unnecessary re-renders
  const memoizedTrayProps = useMemo(() => trayProps ?? ({} as T), [trayProps]);

  return (
    <Animated.View
      style={[
        styles.tray,
        staticStyles,
        config.trayStyles,
        trayAnimatedStyle,
        config.clipMaxHeightToSafeArea ? trayAnimatedHeight : undefined,
      ]}
      layout={layoutTransition}
      entering={enteringAnimation}
      exiting={exitingAnimation}
    >
      <View style={styles.content}>
        <Animated.View
          key={trayKey}
          entering={FadeInDown.duration(CONSTANTS.FADE_IN_DURATION)}
          exiting={FadeOutDown.duration(CONSTANTS.FADE_OUT_DURATION)}
        >
          <TrayComponent {...memoizedTrayProps} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Memoized component to prevent unnecessary re-renders with optimized comparison
export const TrayRenderer = React.memo(
  TrayRendererComponent,
  (prevProps, nextProps) => {
    // Efficient shallow comparison for better performance
    return (
      prevProps.trayKey === nextProps.trayKey &&
      prevProps.config === nextProps.config &&
      prevProps.TrayComponent === nextProps.TrayComponent &&
      prevProps.insets.top === nextProps.insets.top &&
      prevProps.insets.bottom === nextProps.insets.bottom &&
      prevProps.insets.left === nextProps.insets.left &&
      prevProps.insets.right === nextProps.insets.right &&
      shallowEqual(prevProps.trayProps, nextProps.trayProps)
    );
  }
) as <T extends Record<string, unknown> = Record<string, unknown>>(
  props: TrayRendererProps<T>
) => React.ReactElement;

const styles = StyleSheet.create({
  tray: {
    position: 'absolute',
    borderRadius: CONSTANTS.DEFAULT_BORDER_RADIUS,
    shadowOffset: CONSTANTS.SHADOW_OFFSET,
    shadowOpacity: CONSTANTS.SHADOW_OPACITY,
    shadowRadius: CONSTANTS.SHADOW_RADIUS,
    elevation: CONSTANTS.ELEVATION,
    overflow: 'hidden',
    zIndex: CONSTANTS.Z_INDEX,
  },
  content: {
    position: 'relative',
  },
  closeBtnWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: CONSTANTS.DEFAULT_HORIZONTAL_SPACING,
    right: CONSTANTS.DEFAULT_HORIZONTAL_SPACING,
    overflow: 'hidden',
  },
  closeBtn: {
    width: 30,
    height: 30,
    zIndex: 2,
  },
});
