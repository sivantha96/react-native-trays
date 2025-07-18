/**
 * TrayRenderer.tsx
 *
 * Renders a single tray component with animation and keyboard adjustment support.
 * Handles tray position, animation, and keyboard-aware behavior for tray UI.
 */
import React, { useEffect } from 'react';
import {
  View,
  Platform,
  Keyboard,
  type KeyboardEvent,
  StyleSheet,
  Dimensions,
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
import type { EdgeInsets } from 'react-native-safe-area-context';

/**
 * Type alias for margin values used in tray style calculations.
 * Supports numeric values (pixels), string values (with units), or undefined.
 */
type MarginValue = number | string | undefined;

/**
 * Device screen height used for tray positioning and max height calculations.
 * Retrieved once at module load to avoid repeated Dimensions.get() calls.
 */
const { height: DEVICE_HEIGHT } = Dimensions.get('window');

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

  useEffect(() => {
    if (!config.adjustForKeyboard) return;

    const handleKeyboardShow = (e: KeyboardEvent) => {
      trayBottom.value = withTiming(e.endCoordinates.height + 20, {
        duration: Platform.OS === 'ios' ? 60 : 250,
        easing: Easing.out(Easing.ease),
      });
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
  }, [config.adjustForKeyboard, insets.bottom, trayBottom]);

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

  const {
    enteringAnimation = SlideInDown,
    exitingAnimation = SlideOutDown,
    horizontalSpacing = 20,
  } = config;

  // Helper function to parse margin values
  const parseMarginValue = (value?: number | string | null): number => {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return parseFloat(value) || 0;
    }
    return 0;
  };

  // Max height calculation
  const maxHeight =
    DEVICE_HEIGHT -
    insets.bottom -
    insets.top -
    (config.trayStyles?.marginVertical !== undefined
      ? parseMarginValue(config.trayStyles.marginVertical as MarginValue) * 2
      : parseMarginValue(
          (config.trayStyles?.marginBottom ?? 0) as MarginValue
        ) +
        parseMarginValue((config.trayStyles?.marginTop ?? 0) as MarginValue));

  return (
    <Animated.View
      style={[
        styles.tray,
        {
          ...(!config.customTheming && {
            backgroundColor: '#fff',
            shadowColor: '#000',
          }),
          maxHeight,
          left: insets.left + horizontalSpacing,
          right: insets.right + horizontalSpacing,
        },
        config.trayStyles,
        trayAnimatedStyle,
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
