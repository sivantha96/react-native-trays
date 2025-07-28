/**
 * TrayRenderer.tsx
 *
 * Renders a single tray component with animation and keyboard adjustment support.
 * Handles tray position, animation, and keyboard-aware behavior for tray UI.
 */
import {
  Gesture,
  GestureDetector,
  Directions,
} from 'react-native-gesture-handler';
import React, { useEffect, useMemo } from 'react';
import {
  Platform,
  Keyboard,
  type KeyboardEvent,
  StyleSheet,
  View,
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
  runOnJS,
} from 'react-native-reanimated';
import type { TrayStackConfig } from './types';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { DEVICE_HEIGHT } from './constants';
import { calculateKeyboardAdjustments } from './utils';

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
  onDismiss: () => void;
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
  onDismiss,
}) => {
  const translateY = useSharedValue(0);
  const trayHeight = useSharedValue(0);
  const trayBottom = useSharedValue(insets.bottom);
  const isIOS = Platform.OS === 'ios';

  const maxAllowedHeight = useMemo(
    () =>
      Math.round(DEVICE_HEIGHT) -
      (Math.round(insets.top) + Math.round(insets.bottom)),
    [insets.bottom, insets.top]
  );

  const maxHeight = useSharedValue<DimensionValue>(maxAllowedHeight);

  const keyboardBehavior = useMemo(
    () => ({
      adjustForKeyboard: config.adjustForKeyboard ?? false,
      clipMaxHeightToSafeArea: config.clipMaxHeightToSafeArea ?? false,
    }),

    [config.adjustForKeyboard, config.clipMaxHeightToSafeArea]
  );

  useEffect(() => {
    const handleKeyboardShow = (e: KeyboardEvent) => {
      const keyboardHeight = e.endCoordinates.height;

      const adjustments = calculateKeyboardAdjustments(
        keyboardHeight,
        keyboardBehavior,
        maxAllowedHeight,
        insets.bottom
      );

      trayBottom.value = withTiming(adjustments.bottom, {
        duration: isIOS ? 60 : 250,
        easing: Easing.out(Easing.ease),
      });

      maxHeight.value = withTiming(adjustments.maxHeight, {
        duration: isIOS ? 60 : 10,
        easing: Easing.out(Easing.ease),
      });
    };

    const handleKeyboardHide = () => {
      trayBottom.value = withTiming(insets.bottom, {
        duration: isIOS ? 90 : 200,
        easing: Easing.out(Easing.ease),
      });
      maxHeight.value = withTiming(maxAllowedHeight, {
        duration: isIOS ? 90 : 0,
        easing: Easing.out(Easing.ease),
      });
    };

    const showSub = isIOS
      ? Keyboard.addListener('keyboardWillShow', handleKeyboardShow)
      : Keyboard.addListener('keyboardDidShow', handleKeyboardShow);

    const hideSub = isIOS
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
    isIOS,
    keyboardBehavior,
    maxAllowedHeight,
    maxHeight,
    trayBottom,
  ]);

  const dynamicTrayStyle = useMemo(
    () => ({
      backgroundColor: config.customTheming ? undefined : '#fff',
      shadowColor: config.customTheming ? undefined : '#000',
    }),
    [config.customTheming]
  );

  const trayAnimatedStyle = useAnimatedStyle(() => {
    const style: any = {
      transform: [{ translateY: translateY.value }],
    };
    if (config.stickToTop) {
      style.top =
        insets.top +
        (typeof config.trayStyles?.top === 'number'
          ? config.trayStyles?.top
          : 0);
    } else {
      style.bottom =
        trayBottom.value +
        (typeof config.trayStyles?.bottom === 'number'
          ? config.trayStyles?.bottom
          : 0);
    }
    return style;
  }, [config.stickToTop, config.trayStyles, insets.top, trayBottom.value]);

  const {
    enteringAnimation = SlideInDown,
    exitingAnimation = SlideOutDown,
    horizontalSpacing = 20,
  } = config;

  const gesture = Gesture.Fling()
    .direction(config.stickToTop ? Directions.UP : Directions.DOWN)
    .onEnd((_event, success) => {
      if (success) {
        runOnJS(onDismiss)();
      }
    });

  const trayAnimatedHeight = useAnimatedStyle(() => {
    'worklet';
    return { maxHeight: maxHeight.value };
  }, []);

  return (
    <Animated.View
      key={trayKey}
      style={[
        styles.tray,
        {
          left: insets.left + horizontalSpacing,
          right: insets.right + horizontalSpacing,
        },
        dynamicTrayStyle,
        config.trayStyles,
        trayAnimatedStyle,
        config.clipMaxHeightToSafeArea ? trayAnimatedHeight : undefined,
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
      <View
        style={styles.content}
        onLayout={(e) => {
          trayHeight.value = e.nativeEvent.layout.height;
        }}
      >
        {config.enableSwipeToClose ? (
          <GestureDetector
            gesture={config.enableSwipeToClose ? gesture : Gesture.Pan()}
          >
            <Animated.View
              collapsable={false}
              key={trayKey}
              entering={FadeInDown.duration(180)}
              exiting={FadeOutDown.duration(120)}
            >
              <TrayComponent {...(trayProps ?? {})} />
            </Animated.View>
          </GestureDetector>
        ) : (
          <Animated.View
            key={trayKey}
            entering={FadeInDown.duration(180)}
            exiting={FadeOutDown.duration(120)}
          >
            <TrayComponent {...(trayProps ?? {})} />
          </Animated.View>
        )}
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
