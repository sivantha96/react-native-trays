import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';
import CloseButton from '../CloseButton';
import { useState } from 'react';
import { useTrays } from 'react-native-trays';
import { type TrayProps } from '../../config/trayRegistry';
import AnimatedButton from '../AnimatedButton';

export interface EditWalletTrayProps {}

export const EditWalletTray: React.FC<EditWalletTrayProps> = ({}) => {
  const [name, setName] = useState('Luke');
  const [icon] = useState('Icon');

  const { pop } = useTrays<TrayProps>('family');

  const handleOnClose = () => {
    pop();
  };

  const handleOnPressSave = () => {
    console.log('Saved');
    pop();
  };

  return (
    <View style={styles.container}>
      <View style={trayStyles.trayHeader}>
        <Text style={styles.title}>Wallet Details</Text>
        <CloseButton onPress={handleOnClose} />
      </View>

      <View style={styles.divider} />

      <View style={styles.input}>
        <TextInput
          autoFocus
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          style={styles.inputText}
        />
      </View>

      <View style={styles.input}>
        <TextInput
          placeholder="Select Icon"
          value={icon}
          style={styles.inputText}
        />
        <View style={styles.iconContainer}>
          <Image
            source={require('../../../assets/emoji.png')}
            resizeMode="contain"
            style={styles.icon}
          />
        </View>
      </View>

      <AnimatedButton
        title="Save"
        onPress={handleOnPressSave}
        style={styles.button}
        textStyle={styles.buttonText}
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
  input: {
    backgroundColor: '#F9F9FB',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 19,
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputText: {
    fontFamily: 'FamilyMedium',
    fontSize: 18,
    flex: 1,
  },
  iconContainer: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#54B8F9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  buttonText: {
    fontFamily: 'FamilyMedium',
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
