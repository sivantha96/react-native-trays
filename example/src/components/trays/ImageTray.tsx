import { View, Text, Image, Button } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';

export interface ImageTrayProps {
  imageUrl: string;
  caption: string;
  onShowForm?: () => void;
}

export const ImageTray: React.FC<ImageTrayProps> = ({
  imageUrl,
  caption,
  onShowForm,
}) => {
  return (
    <View style={[trayStyles.trayContent, trayStyles.mediumTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>Image Preview</Text>
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
