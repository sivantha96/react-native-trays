import { View, Text, StyleSheet } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';
import AnimatedButton from '../AnimatedButton';
import { useTrays } from 'react-native-trays';
import { TrayEnum, type TrayProps } from '../../config/trayRegistry';

export interface WalletDetailsTrayProps {}

export const WalletDetailsTray: React.FC<WalletDetailsTrayProps> = ({}) => {
  const { push, pop } = useTrays<TrayProps>('family');
  const handleOnPressEditWallet = () => {
    push(TrayEnum.EditWallet, {});
  };

  const handleOnPressViewPrivateKey = () => {
    push(TrayEnum.ViewPrivateKey, {});
  };

  const handleOnClose = () => {
    pop();
  };

  return (
    <View style={styles.container}>
      <View style={trayStyles.trayHeader}>
        <Text style={styles.title}>Wallet Details</Text>
        <CloseButton onPress={handleOnClose} />
      </View>

      <View style={styles.divider} />

      <AnimatedButton
        title="Edit Wallet"
        icon={require('../../../assets/wallet.png')}
        onPress={handleOnPressEditWallet}
      />
      <AnimatedButton
        title="View Private Key"
        icon={require('../../../assets/key.png')}
        onPress={handleOnPressViewPrivateKey}
      />
      <AnimatedButton
        title="Remove Wallet"
        icon={require('../../../assets/warn.png')}
        textStyle={styles.removeText}
        style={styles.removeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  divider: {
    marginBottom: 20,
    height: 1,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontFamily: 'FamilyMedium',
    fontSize: 21,
    fontWeight: '800',
  },
  removeText: {
    color: '#DD322F',
  },
  removeButton: {
    backgroundColor: '#FCEAE9',
  },
});
