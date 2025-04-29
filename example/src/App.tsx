import { TrayProvider } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import configurations
import { trays } from './config/trayRegistry';
import { stackConfigs } from './config/stackConfigs';
import { HomeScreen } from './screens/HomeScreen';

/**
 * Main App component that sets up the TrayProvider with all configurations
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <TrayProvider trays={trays} stackConfigs={stackConfigs}>
        <HomeScreen />
      </TrayProvider>
    </SafeAreaProvider>
  );
}
