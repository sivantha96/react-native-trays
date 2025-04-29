import { Image, StyleSheet, TouchableOpacity } from 'react-native';

const CloseButton = ({ onClose }: { onClose: () => void }) => {
  return (
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Image style={styles.closeIcon} source={require('../assets/close.png')} />
    </TouchableOpacity>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  closeIcon: {
    width: 10,
    height: 10,
  },
});
