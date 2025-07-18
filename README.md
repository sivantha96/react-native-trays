# react-native-trays

<!-- Demo Videos -->
<p align="center">
  <img src="example/demo-1.gif" width="250" alt="Demo 1" style="border-radius:12px;margin:0 10px;">
  <img src="example/demo-2.gif" width="250" alt="Demo 2" style="border-radius:12px;margin:0 10px;">
  <img src="example/demo-3.gif" width="250" alt="Demo 3" style="border-radius:12px;margin:0 10px;">
</p>

A production-grade, fully open-source tray system for React Native with a React Navigation-like API. Built with TypeScript, Reanimated, and best industry practices, supporting both Expo and bare workflows.

---

[![npm version](https://img.shields.io/npm/v/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![Downloads](https://img.shields.io/npm/dm/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://github.com/sivantha96/react-native-trays/actions/workflows/release.yml/badge.svg)](https://github.com/sivantha96/react-native-trays/actions/workflows/release.yml)

---

## 🤔 Why react-native-trays?

While there are many modal libraries for React Native, `react-native-trays` is designed to feel like a native extension of your app's navigation. It provides a powerful, yet familiar, `useTrays` hook that mimics the `useNavigation` hook from React Navigation. This allows you to manage contextual UI "trays"—like bottom sheets, alerts, or pop-ups—as part of a declarative and predictable stack.

It's built from the ground up with **TypeScript**, **Reanimated 2**, and a focus on **performance and developer experience**.

## ✨ Features

- **React Navigation-like API**: A familiar `useTrays` hook with `push`, `pop`, `replace`, and `dismiss` methods.
- **Multiple Tray Stacks**: Manage independent tray flows (e.g., `main` vs. `modal`) with separate configurations.
- **Highly Customizable**: Configure animations, backdrops, keyboard handling, safe area, and more, per-stack or per-tray.
- **Directional Swipe-to-Close**: Intuitive swipe gestures to dismiss trays (swipe down for bottom trays, swipe up for top trays).
- **Keyboard Awareness**: Trays automatically adjust their position when the keyboard appears, ensuring inputs are always visible.
- **Full TypeScript Support**: Complete type safety with generics for tray props, ensuring robust and error-free code.
- **Expo & Bare Workflow Compatible**: Works seamlessly in any React Native environment.
- **Production-Ready**: Built with performance and reliability as top priorities.

---

## 🚀 Installation

```sh
# Using yarn
yarn add react-native-trays

# Or using npm
npm install react-native-trays
```

### Required Peer Dependencies

The library requires the following peer dependencies:

```sh
# Install required peer dependencies
npm install react-native-reanimated react-native-safe-area-context react-native-gesture-handler

# Optional: For backdrop blur effect
npm install expo-blur
```

---

## ⚠️ Required Setup

Before using the library, you must properly set up the required dependencies:

1.  **React Native Reanimated** - Follow the [official setup guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/).
2.  **React Native Safe Area Context** - Follow the [official setup guide](https://github.com/th3rdwave/react-native-safe-area-context#installation).
3.  **React Native Gesture Handler** - Follow the [official setup guide](https://docs.swmansion.com/react-native-gesture-handler/docs/installation).

Make sure to wrap your app's entry point with the `gestureHandlerRootHOC` and `SafeAreaProvider`, and add the Reanimated Babel plugin to your `babel.config.js`.

---

## 🚀 Quick Start

Here's how to get started in just a few steps:

```tsx
import { TrayProvider, useTrays } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Button } from 'react-native';

// 1. Define your tray components
const trays = {
  MyTray: {
    component: ({ message }) => (
      <View style={{ padding: 20, backgroundColor: 'white', borderRadius: 16 }}>
        <Text>{message}</Text>
        <Button title="Close" onPress={() => {}} />
      </View>
    ),
  },
};

// 2. Wrap your app with providers
export default function App() {
  return (
    <SafeAreaProvider>
      <TrayProvider trays={trays}>
        <HomeScreen />
      </TrayProvider>
    </SafeAreaProvider>
  );
}

// 3. Use the useTrays hook to open and close trays
function HomeScreen() {
  const { push } = useTrays('main');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Open Tray"
        onPress={() => push('MyTray', { message: 'Hello from tray!' })}
      />
    </View>
  );
}
```

---

## 🔥 TypeScript Support

React Native Trays provides full TypeScript support with generics for type-safe tray props.

### Defining Tray Props Types

Create a type map for your tray components to ensure type safety:

```tsx
// Define your tray keys (enum or string literals)
enum TrayEnum {
  Details = 'DetailsTray',
  Form = 'FormTray',
  Settings = 'SettingsTray',
}

// Define props for each tray component
type DetailsTrayProps = {
  id: string;
  title: string;
};

type FormTrayProps = {
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
};

type SettingsTrayProps = {
  userId: string;
  preferences: Record<string, boolean>;
};

// Create a type map for all tray props
type TrayProps = {
  [TrayEnum.Details]: DetailsTrayProps;
  [TrayEnum.Form]: FormTrayProps;
  [TrayEnum.Settings]: SettingsTrayProps;
};
```

### Using Type-Safe Hooks

Get full type safety for your tray props by creating a type map and passing it to the `useTrays` hook.

```tsx
import { useTrays } from 'react-native-trays';

// Pass the type map to the useTrays hook
function MyComponent() {
  const { push, pop, replace } = useTrays<TrayProps>('main');

  // TypeScript will now enforce correct props for each tray
  const openDetailsTray = () => {
    push('Details', {
      id: '123',
      title: 'Product Details',
      // TypeScript error: Property 'invalid' does not exist on type 'DetailsTrayProps'
      // invalid: true,
    });
  };

  // Type-safe replace operation
  const updateForm = (newValues: Record<string, any>) => {
    replace(TrayEnum.Form, {
      onSubmit: handleSubmit,
      initialValues: newValues,
    });
  };

  return <Button title="Open Details" onPress={openDetailsTray} />;
}
```

---

## 📚 API Reference

For a complete reference of all types, hooks, and provider props, see **[API.md](./API.md)**.

For a detailed breakdown of all the available configuration options, see the **[TrayStackConfig documentation](./API.md#traystackconfig)**.

---

## 🥑 Advanced Usage

`react-native-trays` is designed to be highly customizable. You can configure animations, gestures, keyboard handling, and more on a per-stack basis.

### Multiple Tray Stacks

Create independent tray flows with separate configurations:

```tsx
// Configure different stack configurations
const stackConfigs = {
  main: {
    backdropStyles: { backgroundColor: 'rgba(0,0,0,0.5)' },
    trayStyles: { backgroundColor: 'white', borderRadius: 16 },
  },
  modal: {
    backdropStyles: { backgroundColor: 'rgba(0,0,0,0.7)' },
    dismissOnBackdropPress: false,
  },
};

// In your component
function MyComponent() {
  const mainTrays = useTrays<MainTrayProps>('main');
  const modalTrays = useTrays<ModalTrayProps>('modal');

  return (
    <View>
      <Button title="Open Main Tray" onPress={() => mainTrays.push('InfoTray', { ... })} />
      <Button title="Open Modal Tray" onPress={() => modalTrays.push('AlertTray', { ... })} />
    </View>
  );
}
```

### Custom Animations

Use Reanimated's animation builders for custom entry and exit animations:

```tsx
import {
  SlideInUp,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

<TrayProvider
  trays={trays}
  stackConfigs={{
    main: {
      enteringAnimation: SlideInUp.springify().damping(15),
      exitingAnimation: SlideOutDown.duration(300),
    },
    modal: {
      enteringAnimation: FadeIn.duration(400),
      exitingAnimation: FadeOut.duration(300),
    },
  }}
>
  <App />
</TrayProvider>;
```

### Keyboard Awareness

Trays automatically adjust when the keyboard appears:

```tsx
<TrayProvider
  trays={trays}
  stackConfigs={{
    main: {
      adjustForKeyboard: true, // default is true
    },
  }}
>
  <App />
</TrayProvider>
```

See **[TrayStackConfig](./API.md#traystackconfig)** for the full list of over 20 configuration options.

---

## 🧑‍💻 Live Demo

Try the library instantly on [Expo Snack](https://snack.expo.dev/@sivanthaeatme/react-native-trays) or check [EXPO_SNACK.md](./EXPO_SNACK.md) for more details.

---

## 🤝 Contributing

PRs and issues are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

MIT © Sivantha
