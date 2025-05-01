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

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Required Setup](#️-required-setup-reanimated--safe-area)
- [Quick Start](#-quick-start)
- [TypeScript Support](#-typescript-support)
- [API Reference](#-api-reference)
- [Advanced Usage](#-advanced-usage)
- [Live Demo](#-live-demo)
- [License](#license)

---

---

## ✨ Features

- **React Navigation-like API**: Familiar hooks-based API with push, pop, replace, and dismiss operations
- **Multiple tray stacks**: Create independent tray flows with separate configurations
- **Customizable animations**: Built-in Reanimated animations (slide, fade) with support for custom animations
- **Keyboard awareness**: Trays automatically adjust position when keyboard appears
- **Safe area support**: Proper handling of device notches and system UI
- **Backdrop customization**: Blur effects, opacity, and dismiss behavior
- **Full TypeScript support**: Complete type safety with generics for tray props
- **ID and key-based operations**: Target specific trays or tray types
- **Expo and bare workflow compatible**: Works in all React Native environments
- **Production-ready**: Built with performance and reliability in mind

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
npm install react-native-reanimated react-native-safe-area-context react-native-uuid

# Optional: For backdrop blur effect in Expo
npm install expo-blur
```

---

## ⚠️ Required Setup

Before using the library, you must properly set up the required dependencies:

1. **React Native Reanimated** - Follow the [official setup guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/)

   - Make sure to add the Babel plugin to your `babel.config.js`
   - For Expo, ensure you have the correct version compatible with your Expo SDK

2. **React Native Safe Area Context** - Follow the [official setup guide](https://github.com/th3rdwave/react-native-safe-area-context#installation)
   - Wrap your app with `SafeAreaProvider` before using `TrayProvider`

If these dependencies are not correctly set up, you may encounter errors like `Native part of Reanimated doesn't seem to be initialized (Worklets)`.

---

## 🚀 Quick Start

```tsx
import { TrayProvider, useTrays } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Define your tray components
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

Pass your type map to the `useTrays` hook for complete type safety:

```tsx
import { useTrays } from 'react-native-trays';

function MyComponent() {
  // Type-safe hook with your TrayProps type map
  const { push, pop, replace } = useTrays<TrayProps>('main');

  // TypeScript will enforce correct props for each tray
  const openDetailsTray = () => {
    push(TrayEnum.Details, {
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

See [API.md](./API.md) for a complete reference of all types, hooks, and provider props.

---

## 🤗 Advanced Usage

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

---

## 🧑‍💻 Live Demo

Try the library instantly on [Expo Snack](https://snack.expo.dev/@sivanthaeatme/react-native-trays) or check [EXPO_SNACK.md](./EXPO_SNACK.md) for more details.

---

## 🤝 Contributing

PRs and issues are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

MIT © Sivantha
