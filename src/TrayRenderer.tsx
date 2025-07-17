/**
 * TrayRenderer.tsx
 *
 * Renders a single tray component with animation and keyboard adjustment support.
 * Handles tray position, animation, and keyboard-aware behavior for tray UI.
 */
import React, { useEffect, useMemo } from 'react';
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
interface TrayRendererProps {
  trayKey: string;
  trayProps: unknown;
  config: TrayStackConfig;
  TrayComponent: React.ComponentType<Record<string, unknown>>;
  insets: EdgeInsets;
}

/**
 * TrayRenderer
 *
 * Renders the given tray component with animation and keyboard-aware adjustments.
 * Handles tray position, entry/exit animations, and safe area insets.
 */
export const TrayRenderer: React.FC<TrayRendererProps> = ({
  trayKey,
  trayProps,
  config,
  TrayComponent,
  insets,
}) => {
  const trayBottom = useSharedValue(insets.bottom);

  const maxAllowedHeight = useMemo(
    () =>
      Math.round(DEVICE_HEIGHT) -
      (Math.round(insets.top) + Math.round(insets.bottom)),
    [insets.bottom, insets.top]
  );

  const maxHeight = useSharedValue<DimensionValue>(maxAllowedHeight);

  useEffect(() => {
    if (!config.adjustForKeyboard) return;

    const handleKeyboardShow = (e: KeyboardEvent) => {
      trayBottom.value = withTiming(
        Platform.OS === 'android' && config.clipMaxHeightToSafeArea
          ? 0
          : e.endCoordinates.height,
        {
          duration: Platform.OS === 'ios' ? 60 : 250,
          easing: Easing.out(Easing.ease),
        }
      );
    };

    const handleKeyboardHide = () => {
      trayBottom.value = withTiming(insets.bottom, {
        duration: Platform.OS === 'ios' ? 90 : 200,
        easing: Easing.out(Easing.ease),
      });
    };

    const showSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', handleKeyboardShow)
        : Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    const hideSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
        : Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [
    config.adjustForKeyboard,
    config.clipMaxHeightToSafeArea,
    insets.bottom,
    trayBottom,
  ]);

  useEffect(() => {
    if (!config.clipMaxHeightToSafeArea) return;

    const handleKeyboardShow = (e: KeyboardEvent) => {
      maxHeight.value = withTiming(
        maxAllowedHeight -
          (config.adjustForKeyboard ? e.endCoordinates.height : 0),
        {
          duration: Platform.OS === 'ios' ? 60 : 250,
          easing: Easing.out(Easing.ease),
        }
      );
    };

    const handleKeyboardHide = () => {
      maxHeight.value = withTiming(maxAllowedHeight, {
        duration: Platform.OS === 'ios' ? 90 : 200,
        easing: Easing.out(Easing.ease),
      });
    };

    const showSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillShow', handleKeyboardShow)
        : Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    const hideSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillHide', handleKeyboardHide)
        : Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [
    config.adjustForKeyboard,
    config.clipMaxHeightToSafeArea,
    maxAllowedHeight,
    maxHeight,
  ]);

  const trayAnimatedStyle = useAnimatedStyle(
    () =>
      config.stickToTop
        ? {
            top:
              insets.top +
              (typeof config.trayStyles?.top === 'number'
                ? config.trayStyles?.top
                : 0),
          }
        : {
            bottom:
              trayBottom.value +
              (typeof config.trayStyles?.bottom === 'number'
                ? config.trayStyles?.bottom
                : 0),
          },
    [config.trayStyles]
  );

  const trayAnimatedHeight = useAnimatedStyle(
    () => ({
      maxHeight: maxHeight.value,
    }),
    [maxHeight]
  );

  const {
    enteringAnimation = SlideInDown,
    exitingAnimation = SlideOutDown,
    horizontalSpacing = 20,
  } = config;

  return (
    <Animated.View
      style={[
        styles.tray,
        {
          backgroundColor: config.customTheming ? undefined : '#fff',
          shadowColor: config.customTheming ? undefined : '#000',
          left: insets.left + horizontalSpacing,
          right: insets.right + horizontalSpacing,
        },
        config.trayStyles,
        trayAnimatedStyle,
        config.clipMaxHeightToSafeArea ? trayAnimatedHeight : {},
      ]}
      layout={
        config.disableLayoutAnimation
          ? undefined
          : (config.customLayoutAnimation ??
            LinearTransition.easing(Easing.out(Easing.ease)).duration(150))
      }
      entering={enteringAnimation}
      exiting={exitingAnimation}
    >
      <View style={styles.content}>
        <Animated.View
          key={trayKey}
          entering={FadeInDown.duration(180)}
          exiting={FadeOutDown.duration(120)}
        >
          <TrayComponent {...(trayProps ?? {})} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tray: {
    position: 'absolute',
    borderRadius: 30,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 40,
    elevation: 10,
    overflow: 'hidden',
    zIndex: 999,
  },
  content: {
    position: 'relative',
    flex: 1,
  },
  closeBtnWrapper: {
    position: 'absolute',
    zIndex: 1,
    top: 20,
    right: 20,
    overflow: 'hidden',
  },
  closeBtn: {
    width: 30,
    height: 30,
    zIndex: 2,
  },
});
