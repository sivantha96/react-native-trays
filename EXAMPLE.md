# Example Usage: react-native-trays

This document provides practical examples of how to use `react-native-trays` in your React Native application. For a complete API reference, see [API.md](./API.md), and for a live demo, check out the [Expo Snack](https://snack.expo.dev/@sivanthaeatme/react-native-trays).

## Basic Setup

```tsx
import { TrayProvider, useTrays } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Button, StyleSheet } from 'react-native';

// Define your tray components
const trays = {
  SimpleTray: {
    component: ({ title, message, onClose }) => (
      <View style={styles.tray}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Button title="Close" onPress={onClose} />
      </View>
    ),
  },
};

// Wrap your app with providers
export default function App() {
  return (
    <SafeAreaProvider>
      <TrayProvider trays={trays}>
        <HomeScreen />
      </TrayProvider>
    </SafeAreaProvider>
  );
}

// Use trays in your components
function HomeScreen() {
  const { push, pop } = useTrays('main');

  const openTray = () => {
    push('SimpleTray', {
      title: 'Welcome',
      message: 'This is a simple tray example',
      onClose: () => pop(),
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Open Tray" onPress={openTray} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tray: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    minHeight: 200,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 20,
  },
});
```

## React Navigation-like API

The library provides a familiar API similar to React Navigation, making it easy to use if you're already familiar with React Navigation:

```tsx
import { useTrays } from 'react-native-trays';

function MyComponent() {
  // Similar to useNavigation() in React Navigation
  const { push, pop, replace } = useTrays('main');

  // Similar to navigation.navigate()
  const navigateToDetails = () => {
    push('DetailsTray', { id: '123', title: 'Product Details' });
  };

  // Similar to navigation.goBack()
  const goBack = () => {
    pop();
  };

  // Similar to navigation.replace()
  const replaceWithForm = () => {
    replace('FormTray', { onSubmit: handleSubmit });
  };

  return (
    <View>
      <Button title="View Details" onPress={navigateToDetails} />
      <Button title="Go Back" onPress={goBack} />
      <Button title="Replace with Form" onPress={replaceWithForm} />
    </View>
  );
}
```

## TypeScript Support

For complete type safety, use TypeScript generics with the `useTrays` hook:

```tsx
// Define your tray keys
enum TrayEnum {
  Details = 'DetailsTray',
  Form = 'FormTray',
}

// Define props for each tray
type DetailsTrayProps = {
  id: string;
  title: string;
};

type FormTrayProps = {
  onSubmit: (data: any) => void;
};

// Create a type map for all tray props
type TrayProps = {
  [TrayEnum.Details]: DetailsTrayProps;
  [TrayEnum.Form]: FormTrayProps;
};

function MyComponent() {
  // Type-safe hook with your TrayProps type map
  const { push } = useTrays<TrayProps>('main');

  // TypeScript will enforce correct props for each tray
  const openDetailsTray = () => {
    push(TrayEnum.Details, {
      id: '123',
      title: 'Product Details',
    });
  };

  return <Button title="Open Details" onPress={openDetailsTray} />;
}
```

## Advanced Examples

For more advanced usage examples, including multiple stacks, custom animations, and complex tray interactions, see [README.md](./README.md) and [API.md](./API.md) or try the [live demo](https://snack.expo.dev/@sivanthaeatme/react-native-trays).
