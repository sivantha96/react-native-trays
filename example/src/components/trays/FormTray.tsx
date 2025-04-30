import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button } from 'react-native';
import { trayStyles } from '../../styles/trayStyles';

export interface FormTrayProps {
  onSubmit: (text: string) => void;
}

export const FormTray: React.FC<FormTrayProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  return (
    <View style={[trayStyles.trayContent, trayStyles.mediumTray]}>
      <View style={trayStyles.trayHeader}>
        <Text style={trayStyles.trayTitle}>Input Form</Text>
      </View>
      <TextInput
        style={trayStyles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter some text..."
      />
      <View style={trayStyles.switchContainer}>
        <Text>Enable feature:</Text>
        <Switch value={true} />
      </View>
      <View style={trayStyles.buttonRow}>
        <View style={trayStyles.buttonSpacer} />
        <Button title="Submit" onPress={() => onSubmit(text)} />
      </View>
    </View>
  );
};
