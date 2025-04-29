import { type TrayStackConfig } from 'react-native-trays';
import {
  SlideInUp,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

// Configure different stack configurations
export const stackConfigs: Record<string, TrayStackConfig> = {
  main: {
    horizontalSpacing: 16,
    defaultBottomSpacing: 16,
    dismissOnBackdropPress: true,
  },
  secondary: {
    backdropStyles: { backgroundColor: 'rgba(0,0,0,0.3)' },
    trayStyles: { borderRadius: 5 },
    adjustForKeyboard: true,
    horizontalSpacing: 24,
    defaultBottomSpacing: 24,
    dismissOnBackdropPress: false,
    enteringAnimation: SlideInUp,
    exitingAnimation: SlideOutDown,
  },
  modal: {
    backdropStyles: { backgroundColor: 'rgba(50,50,80,0.7)' },
    trayStyles: { backgroundColor: 'white', borderRadius: 24 },
    adjustForKeyboard: false,
    horizontalSpacing: 8,
    defaultBottomSpacing: 32,
    dismissOnBackdropPress: true,
    enteringAnimation: FadeIn,
    exitingAnimation: FadeOut,
  },
};
