import { View, Text, Image, Button } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';

export interface ImageTrayProps {
  imageUrl: string;
  caption: string;
  onClose: () => void;
  onShowForm?: () => void;
}

export const ImageTray: React.FC<ImageTrayProps> = ({
  imageUrl,
  caption,
  onClose,
  onShowForm,
}) => {
  return (
    <View style={[trayStyles.trayContent, trayStyles.mediumTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>Image Preview</Text>
        <CloseButton onClose={onClose} />
      </View>
      <Image
        source={{ uri: imageUrl }}
        style={trayStyles.image}
        resizeMode="cover"
      />
      <Text style={trayStyles.caption}>{caption}</Text>

      {onShowForm && (
        <View>
          <Button title="Replace with Form" onPress={onShowForm} />
        </View>
      )}
    </View>
  );
};
