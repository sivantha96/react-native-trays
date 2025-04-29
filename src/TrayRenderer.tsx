import React, { useEffect } from 'react';
import {
  View,
  Platform,
  Keyboard,
  type KeyboardEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import type { TrayStackConfig } from './types';

interface TrayRendererProps {
  trayKey: string;
  trayProps: unknown;
  config: TrayStackConfig;
  TrayComponent: React.ComponentType<Record<string, unknown>>;
  onDismiss: () => void;
  insets: { bottom: number; left: number; right: number };
}

export const TrayRenderer: React.FC<TrayRendererProps> = ({
  trayKey,
  trayProps,
  config,
  TrayComponent,
  onDismiss,
  insets,
}) => {
  const trayBottom = useSharedValue(
    insets.bottom + (config.defaultBottomSpacing || 20)
  );

  useEffect(() => {
    if (!config.adjustForKeyboard) return;

    const handleKeyboardShow = (e: KeyboardEvent) => {
      trayBottom.value = withTiming(
        e.endCoordinates.height + (config.defaultBottomSpacing || 20),
        {
          duration: Platform.OS === 'ios' ? 60 : 250,
          easing: Easing.out(Easing.ease),
        }
      );
    };

    const handleKeyboardHide = () => {
      trayBottom.value = withTiming(
        insets.bottom + (config.defaultBottomSpacing || 20),
        {
          duration: Platform.OS === 'ios' ? 90 : 200,
          easing: Easing.out(Easing.ease),
        }
      );
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
    insets.bottom,
    trayBottom,
    config.defaultBottomSpacing,
  ]);

  const trayAnimatedStyle = useAnimatedStyle(() => ({
    bottom: trayBottom.value,
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
        trayAnimatedStyle,
        {
          left: insets.left + horizontalSpacing,
          right: insets.right + horizontalSpacing,
        },
        config.trayStyles,
      ]}
      layout={LinearTransition.easing(Easing.out(Easing.ease)).duration(150)}
      entering={enteringAnimation}
      exiting={exitingAnimation}
    >
      <View style={styles.content}>
        <Animated.View
          key="close-btn"
          pointerEvents="box-none"
          style={styles.closeBtnWrapper}
        >
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={onDismiss}
            style={styles.closeBtn}
          />
        </Animated.View>
        <Animated.View
          key={trayKey}
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(120)}
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
    top: 10,
    right: 10,
    overflow: 'hidden',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
