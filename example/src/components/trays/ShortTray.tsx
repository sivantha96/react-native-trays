import { View, Text } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';

export interface ShortTrayProps {
  title: string;
  message: string;
}

export const ShortTray: React.FC<ShortTrayProps> = ({ title, message }) => {
  return (
    <View style={[trayStyles.trayContent, trayStyles.shortTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>{title}</Text>
      </View>
      <Text style={trayStyles.trayMessage}>{message}</Text>
    </View>
  );
};
