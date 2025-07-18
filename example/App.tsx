import { TrayProvider } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import configurations
import { trays } from './src/config/trayRegistry';
import { stackConfigs } from './src/config/stackConfigs';
import { HomeScreen } from './src/screens/HomeScreen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

/**
 * Main App component that sets up the TrayProvider with all configurations
 */
export default function App() {
  useFonts({
    Inter: require('./assets/Inter.ttf'),
    FamilyRegular: require('./assets/FamilyRegular.ttf'),
    FamilyMedium: require('./assets/FamilyMedium.ttf'),
  });
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <TrayProvider trays={trays} stackConfigs={stackConfigs}>
          <HomeScreen />
        </TrayProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
