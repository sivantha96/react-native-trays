import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';

export interface TallTrayProps {
  items: string[];
  onClose: () => void;
  onDismissAll?: () => void;
}

export const TallTray: React.FC<TallTrayProps> = ({
  items,
  onClose,
  onDismissAll,
}) => {
  return (
    <View style={[trayStyles.trayContent, trayStyles.tallTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>Scrollable List</Text>
        <CloseButton onClose={onClose} />
      </View>
      <ScrollView style={trayStyles.scrollView}>
        {items.map((item, index) => (
          <View key={index} style={trayStyles.listItem}>
            <Text>{item}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={trayStyles.buttonRow}>
        <TouchableOpacity
          onPress={onClose}
          style={trayStyles.bottomCloseButton}
        >
          <Text style={trayStyles.bottomCloseText}>Close List</Text>
        </TouchableOpacity>

        {onDismissAll && (
          <TouchableOpacity
            onPress={onDismissAll}
            style={trayStyles.bottomCloseButton}
          >
            <Text style={trayStyles.bottomCloseText}>Dismiss All Trays</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
