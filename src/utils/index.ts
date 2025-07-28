import { Platform } from 'react-native';

let sessionCounter = 0;

export const generateUniqueId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  // Fallback: High-entropy, timestamped, platform-aware unique ID
  sessionCounter += 1;

  const timestamp = Date.now().toString(36); // Short, millisecond precision
  const randomPart1 = Math.random().toString(36).substring(2, 10); // 8-char random
  const randomPart2 = Math.floor(Math.random() * 1e9).toString(36); // extra randomness
  const platform = Platform.OS; // 'ios' or 'android'

  return `id-${platform}-${timestamp}-${randomPart1}-${randomPart2}-${sessionCounter}`;
};

type KeyboardBehavior = {
  adjustForKeyboard: boolean;
  clipMaxHeightToSafeArea: boolean;
};

/**
 * Calculate keyboard adjustments based on configuration
 */
export const calculateKeyboardAdjustments = (
  keyboardHeight: number,
  behavior: KeyboardBehavior,
  maxAllowedHeight: number,
  insetsBottom: number
) => {
  const { adjustForKeyboard, clipMaxHeightToSafeArea } = behavior;
  const isAndroid = Platform.OS === 'android';

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
