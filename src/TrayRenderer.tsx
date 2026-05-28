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
import { calculateKeyboardAdjustments } from './utils';

const DEVICE_HEIGHT = require('react-native').Dimensions.get('screen').height;

interface TrayRendererProps {
  trayKey: string;
  trayProps: unknown;
  config: TrayStackConfig;
  TrayComponent: React.ComponentType<Record<string, unknown>>;
  insets: { bottom: number; top: number; left: number; right: number };
}

export const TrayRenderer: React.FC<TrayRendererProps> = ({
  trayKey,
  trayProps,
  config,
  TrayComponent,
  insets,
}) => {
  const isIOS = Platform.OS === 'ios';

  const maxAllowedHeight = useMemo(
    () => DEVICE_HEIGHT - insets.top - insets.bottom,
    [insets.bottom, insets.top]
  );

  const trayBottom = useSharedValue(insets.bottom);
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
      const adjustments = calculateKeyboardAdjustments(
        e.endCoordinates.height,
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
    insets.bottom,
    isIOS,
    keyboardBehavior,
    maxAllowedHeight,
    maxHeight,
    trayBottom,
  ]);

  const trayAnimatedStyle = useAnimatedStyle(() => ({
    bottom:
      trayBottom.value +
      (typeof config.trayStyles?.bottom === 'number'
        ? config.trayStyles.bottom
        : 0),
  }));

  const trayAnimatedHeight = useAnimatedStyle(() => ({
    maxHeight: maxHeight.value as number,
  }));

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
          left: insets.left + horizontalSpacing,
          right: insets.right + horizontalSpacing,
        },
        config.trayStyles,
        trayAnimatedStyle,
        config.clipMaxHeightToSafeArea ? trayAnimatedHeight : undefined,
      ]}
      layout={
        config.disableLayoutAnimation
          ? undefined
          : LinearTransition.easing(Easing.out(Easing.ease)).duration(150)
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
    backgroundColor: '#fff',
    shadowColor: '#000',
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
