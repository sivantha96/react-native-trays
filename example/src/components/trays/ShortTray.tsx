import { View, Text } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';

export interface ShortTrayProps {
  title: string;
  message: string;
  onClose: () => void;
}

export const ShortTray: React.FC<ShortTrayProps> = ({
  title,
  message,
  onClose,
}) => {
  return (
    <View style={[trayStyles.trayContent, trayStyles.shortTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>{title}</Text>
        <CloseButton onClose={onClose} />
      </View>
      <Text style={trayStyles.trayMessage}>{message}</Text>
    </View>
  );
};
