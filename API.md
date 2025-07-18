# API Reference: react-native-trays

This document provides a complete API reference for the `react-native-trays` library. For setup instructions and basic usage examples, please see the [README.md](./README.md).

## Table of Contents

- [Components](#components)
  - [`TrayProvider`](#trayprovider)
- [Hooks](#hooks)
  - [`useTrays`](#usetrays)
- [Configuration](#configuration)
  - [`TrayStackConfig`](#traystackconfig)
- [TypeScript Support](#typescript-support)
  - [`TrayRegistry`](#trayregistry)
  - [Type-Safe API Usage](#type-safe-api-usage)

---

## Components

### `TrayProvider`

The root component that enables the tray system. It should be placed at the top level of your application.

#### Props

- `trays: TrayRegistry` **(required)** - An object that maps string keys to your tray components. See [`TrayRegistry`](#trayregistry) for more details.
- `children: ReactNode` **(required)** - Your application's child components.
- `stackConfigs?: Record<string, TrayStackConfig>` - An object to provide specific configurations for different tray stacks.
- `defaultStackConfig?: TrayStackConfig` - A default configuration that applies to all stacks unless overridden by `stackConfigs`.

#### Example

```tsx
import { TrayProvider } from 'react-native-trays';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyTrays } from './trays'; // Your tray definitions

// Define configurations for different stacks
const stackConfigs = {
  main: {
    dismissOnBackdropPress: true,
    backdropStyles: { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  },
  modal: {
    dismissOnBackdropPress: false,
    enteringAnimation: SlideInUp,
    exitingAnimation: SlideOutDown,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <TrayProvider trays={MyTrays} stackConfigs={stackConfigs}>
        <YourAppContent />
      </TrayProvider>
    </SafeAreaProvider>
  );
}
```

---

## Hooks

### `useTrays`

A hook that provides access to the tray manipulation API for a specific stack.

```tsx
const { push, pop, ... } = useTrays(stackId);
```

#### Parameters

- `stackId: string` **(required)** - The unique identifier for the tray stack you want to control.

#### Return Value

Returns an object with the following functions:

| Method            | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `push`            | Pushes a new tray onto the stack.                                                                       |
| `pop`             | Removes the top-most tray from the stack.                                                               |
| `replace`         | Replaces the props of the top-most tray matching a key. If none exists, it pushes a new tray.           |
| `replaceById`     | Replaces the props of a specific tray instance identified by its unique ID.                             |
| `replaceTray`     | Replaces the component and props of the top-most tray matching a key.                                   |
| `replaceTrayById` | Replaces the component and props for a specific tray instance identified by its unique ID.              |
| `dismiss`         | Dismisses all instances of a tray with the given key.                                                   |
| `dismissById`     | Dismisses a specific tray instance by its unique ID.                                                    |
| `dismissAll`      | Dismisses all trays in the stack, leaving it empty.                                                     |

---

## Configuration

### `TrayStackConfig`

This interface allows you to customize the appearance and behavior of each tray stack.

| Property                  | Type                               | Default     | Description                                                                                               |
| ------------------------- | ---------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `backdropStyles`          | `ViewStyle`                        | `{}`        | Custom styles for the backdrop view.                                                                      |
| `backdropPointerEvents`   | `'auto' \| 'none' \| ...`         | `'auto'`    | Controls if the backdrop can be the target of touch events.                                               |
| `trayStyles`              | `ViewStyle`                        | `{}`        | Custom styles for the tray container.                                                                     |
| `adjustForKeyboard`       | `boolean`                          | `true`      | If `true`, the tray adjusts its position to avoid the on-screen keyboard.                                 |
| `enteringAnimation`       | `EntryOrExitLayoutType`            | `undefined` | Animation from `react-native-reanimated` for when a tray enters.                                          |
| `exitingAnimation`        | `EntryOrExitLayoutType`            | `undefined` | Animation from `react-native-reanimated` for when a tray exits.                                           |
| `horizontalSpacing`       | `number`                           | `20`        | Horizontal margin for the tray from the screen edges.                                                     |
| `dismissOnBackdropPress`  | `boolean`                          | `true`      | If `true`, pressing the backdrop dismisses the top-most tray.                                             |
| `disableBackgroundBlur`   | `boolean`                          | `false`     | If `true`, disables the `expo-blur` effect on the backdrop.                                               |
| `blurViewProps`           | `BlurViewProps`                    | `undefined` | Props to customize the backdrop's blur effect.                                                            |
| `enableSwipeToClose`      | `boolean`                          | `false`     | If `true`, the tray can be closed by swiping it down.                                                     |
| `stickToTop`              | `boolean`                          | `false`     | If `true`, the tray aligns to the top of the screen instead of the bottom.                                |
| `ignoreSafeArea`          | `boolean`                          | `false`     | If `true`, the tray ignores safe area insets and extends to the screen edges.                             |
| `disableLayoutAnimation`  | `boolean`                          | `false`     | Disables the layout animation when trays are added or removed.                                            |
| `customLayoutAnimation`   | `LayoutAnimation`                  | `undefined` | A custom `react-native-reanimated` layout animation for tray transitions.                                 |

---

## TypeScript Support

The library is written in TypeScript and provides strong type safety out of the box.

### `TrayRegistry`

To define your trays, create an object that maps string keys to tray component definitions.

```tsx
import { ComponentType } from 'react';

// Define props for each tray
export type MyTrayProps = {
  InfoTray: { title: string; message: string };
  ConfirmationTray: { onConfirm: () => void; onCancel: () => void };
};

// Define the tray components
const InfoTray: ComponentType<MyTrayProps['InfoTray']> = ({ title, message }) => { ... };
const ConfirmationTray: ComponentType<MyTrayProps['ConfirmationTray']> = ({ onConfirm, onCancel }) => { ... };

// Create the registry
export const MyTrays = {
  InfoTray: { component: InfoTray },
  ConfirmationTray: { component: ConfirmationTray },
};
```

### Type-Safe API Usage

Pass your props type to the `useTrays` hook to get full type safety and autocompletion for tray operations.

```tsx
import { useTrays } from 'react-native-trays';
import { MyTrayProps } from './trays'; // Your props type definition

function MyComponent() {
  const { push } = useTrays<MyTrayProps>('main');

  const showInfo = () => {
    // TypeScript will ensure the props match the definition for 'InfoTray'
    push('InfoTray', {
      title: 'Hello',
      message: 'This is a type-safe tray!',
    });
  };

  const showConfirmation = () => {
    push('ConfirmationTray', {
      onConfirm: () => console.log('Confirmed!'),
      onCancel: () => console.log('Cancelled.'),
      // The following would cause a TypeScript error:
      // invalidProp: true 
    });
  };

  return (
    // ... buttons to call showInfo and showConfirmation
  );
}
```
  ) => void;
  replaceTray: <K extends keyof T>(
    trayKey: string,
    newTrayKey: string,
    props: T[K]
  ) => void;
  dismiss: (trayKey: string) => void;
  dismissById: (trayId: string) => void;
  dismissAll: () => void;
}
```

### `TrayStackConfig`

Per-stack configuration options.

```tsx
interface TrayStackConfig {
  // Styling
  backdropStyles?: ViewStyle;
  backdropPointerEvents?: 'auto' | 'box-none' | 'box-only' | 'none';
  trayStyles?: ViewStyle;
  horizontalSpacing?: number; // Horizontal padding from screen edges

  // Behavior
  adjustForKeyboard?: boolean; // Move tray above keyboard when it appears
  dismissOnBackdropPress?: boolean; // Dismiss tray when backdrop is pressed

  // Animations
  enteringAnimation?: EntryOrExitLayoutType; // Animation when tray enters
  exitingAnimation?: EntryOrExitLayoutType; // Animation when tray exits
}
```

---

## Advanced Usage

### Multiple Stacks

Use different `stackId` with `useTrays` for independent tray flows.

```tsx
// In your component
const mainTrays = useTrays('main'); // For general notifications
const modalTrays = useTrays('modal'); // For modal-like overlays
```

### Custom Animations

Use Reanimated's animation builders for custom entry/exit effects.

```tsx
import { SlideInUp, FadeOut } from 'react-native-reanimated';

// In your stackConfigs
const stackConfigs = {
  custom: {
    enteringAnimation: SlideInUp,
    exitingAnimation: FadeOut,
  },
};
```

### Backdrop Blur

On Expo, backdrop blur is enabled automatically if `expo-blur` is installed.

```tsx
// In your stackConfigs
const stackConfigs = {
  blurred: {
    backdropStyles: { backgroundColor: 'rgba(255,255,255,0.3)' }, // Light blur
  },
};
```

### Different Tray Heights

Create trays with different heights for various content types.

```tsx
// In your tray components
const trays = {
  ShortTray: {
    component: (props) => <View style={{ minHeight: 100 }}>...</View>,
  },
  MediumTray: {
    component: (props) => <View style={{ minHeight: 250 }}>...</View>,
  },
  TallTray: {
    component: (props) => <View style={{ minHeight: 400 }}>...</View>,
  },
};
```

### Keyboard Awareness

Trays can automatically adjust when the keyboard appears.

```tsx
// Enable/disable per stack
const stackConfigs = {
  withKeyboard: {
    adjustForKeyboard: true, // Default is true
  },
  withoutKeyboard: {
    adjustForKeyboard: false,
  },
};
```

See the example app in the repo for a comprehensive demonstration of all features.
