import { View, Text, StyleSheet, Image } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';
import AnimatedButton from '../AnimatedButton';
import { useTrays } from 'react-native-trays';
import { type TrayProps } from '../../config/trayRegistry';

export interface ViewPrivateKeyTrayProps {}

export const ViewPrivateKeyTray: React.FC<ViewPrivateKeyTrayProps> = ({}) => {
  const { pop } = useTrays<TrayProps>('family');

  const handleOnPressCancel = () => {
    pop();
  };

  return (
    <View style={styles.container}>
      <View style={trayStyles.trayHeader}>
        <View>
          <View style={styles.iconContainer}>
            <Image
              source={require('../../../assets/key.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Private Key</Text>
        </View>
        <CloseButton onPress={handleOnPressCancel} />
      </View>

      <Text style={styles.description}>
        Your Private Key is the key used to back up your wallet. Keep it secret
        and secure at all times.
      </Text>

      <View style={styles.divider} />

      <View style={styles.itemContainer}>
        <View style={styles.smallIconContainer}>
          <Image
            source={require('../../../assets/shield.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.item}>Keep your Private Key Safe</Text>
      </View>
      <View style={styles.itemContainer}>
        <View style={styles.smallIconContainer}>
          <Image
            source={require('../../../assets/para.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.item}>Don't share it with anyone else</Text>
      </View>
      <View style={styles.itemContainer}>
        <View style={styles.smallIconContainer}>
          <Image
            source={require('../../../assets/ban.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.item}>If you lose it, we can't recover it</Text>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <AnimatedButton
            style={styles.button}
            title="Cancel"
            textStyle={styles.buttonDefaultText}
            onPress={handleOnPressCancel}
          />
        </View>

        <View style={styles.buttonSeparator} />

        <View style={styles.buttonWrapper}>
          <AnimatedButton
            title="Reveal"
            style={[styles.button, styles.buttonPrimary]}
            icon={require('../../../assets/face.png')}
            textStyle={[styles.buttonText, styles.buttonDefaultText]}
          />
        </View>
      </View>
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
  input: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 19,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
    fontFamily: 'FamilyMedium',
  },
  description: {
    fontFamily: 'FamilyMedium',
    fontSize: 18,
    fontWeight: '400',
    color: '#A6A6A6',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  item: {
    fontFamily: 'FamilyMedium',
    fontSize: 16,
    fontWeight: '400',
    color: '#A6A6A6',
    textAlign: 'left',
  },
  buttonText: {
    color: '#FFFFFF',
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  smallIconContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  button: {
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%',
  },
  buttonDefaultText: {
    fontSize: 22,
  },
  buttonPrimary: {
    backgroundColor: '#54B8F9',
  },
  buttonSeparator: {
    width: 15,
  },
  buttonWrapper: { flex: 1 },
});
