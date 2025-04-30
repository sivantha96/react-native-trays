import {
  Image,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const CloseButton = ({
  onPress,
  style,
}: {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.closeButton, style]}>
      <Image
        style={styles.closeIcon}
        source={require('../../assets/close.png')}
      />
    </TouchableOpacity>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 15,
    backgroundColor: '#F9F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  closeIcon: {
    width: 12,
    height: 12,
  },
});
