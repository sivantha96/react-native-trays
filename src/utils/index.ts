type KeyboardBehavior = {
  adjustForKeyboard: boolean;
  clipMaxHeightToSafeArea: boolean;
};

/**
 * Calculate tray bottom position and max height adjustments when the keyboard appears.
 *
 * Android historically used adjustResize which resized the window automatically, so
 * no manual bottom offset was needed. However, edge-to-edge mode and certain Expo
 * configurations mean the window does NOT resize, so the tray must be moved up
 * manually — the same as iOS.
 */
export const calculateKeyboardAdjustments = (
  keyboardHeight: number,
  behavior: KeyboardBehavior,
  maxAllowedHeight: number,
  insetsBottom: number
) => {
  const { adjustForKeyboard, clipMaxHeightToSafeArea } = behavior;

  const strategies = {
    noAdjustment: {
      bottom: insetsBottom,
      maxHeight: maxAllowedHeight,
    },
    adjustOnly: {
      bottom: keyboardHeight + insetsBottom,
      maxHeight: maxAllowedHeight,
    },
    clipOnly: {
      bottom: insetsBottom,
      maxHeight: maxAllowedHeight,
    },
    adjustAndClip: {
      bottom: keyboardHeight + insetsBottom,
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
