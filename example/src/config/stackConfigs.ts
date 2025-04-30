import { type TrayStackConfig } from 'react-native-trays';
import {
  SlideInUp,
  SlideOutDown,
  FadeIn,
  FadeOut,
  SlideOutUp,
  SlideInDown,
} from 'react-native-reanimated';

// Configure different stack configurations
export const stackConfigs: Record<string, TrayStackConfig> = {
  main: {
    horizontalSpacing: 16,
    dismissOnBackdropPress: true,
  },
  secondary: {
    backdropStyles: { backgroundColor: 'rgba(0,0,0,0.3)' },
    trayStyles: { borderRadius: 5, top: 10 },
    adjustForKeyboard: false,
    horizontalSpacing: 24,
    dismissOnBackdropPress: false,
    enteringAnimation: SlideInUp,
    exitingAnimation: SlideOutUp,
    stickToTop: true,
  },
  modal: {
    backdropStyles: { backgroundColor: 'rgba(50,50,80,0.7)' },
    trayStyles: { backgroundColor: 'white', borderRadius: 24 },
    adjustForKeyboard: false,
    horizontalSpacing: 8,
    dismissOnBackdropPress: true,
    enteringAnimation: FadeIn,
    exitingAnimation: FadeOut,
  },
  family: {
    backdropStyles: {
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    trayStyles: {
      borderRadius: 40,
    },
    horizontalSpacing: 16,
    dismissOnBackdropPress: true,
    disableBackgroundBlur: true,
    enteringAnimation: SlideInDown,
    exitingAnimation: SlideOutDown,
    adjustForKeyboard: true,
  },
};
