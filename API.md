# API Reference: react-native-trays

This document describes the complete API for the `react-native-trays` library. For usage examples, see [README.md](./README.md) and [EXAMPLE.md](./EXAMPLE.md).

## Table of Contents

- [Components](#components)
  - [TrayProvider](#trayprovider)
- [Hooks](#hooks)
  - [useTrays](#usetrays)
- [TypeScript Support](#typescript-support)
  - [Type Definitions](#type-definitions)
  - [Generic Type Parameters](#generic-type-parameters)
  - [Type-Safe API Usage](#type-safe-api-usage)
- [Configuration](#configuration)
  - [TrayStackConfig](#traystackconfig)
  - [TrayRegistry](#trayregistry)

## Components

### `TrayProvider`

The root component that provides tray stack context and renders trays. Wrap your app with this provider.

### Props

- `trays: TrayRegistry` — Registry mapping tray keys to their React components.
- `children: ReactNode` — App children.
- `stackConfigs?: Record<string, TrayStackConfig>` — Optional per-stack configuration overrides.

See [types.ts](./src/types.ts) for full type definitions.

### Example

```tsx
import { TrayProvider, useTrays } from 'react-native-trays';
import { Button, Text } from 'react-native';

const trays = {
  DemoTray: {
    component: ({ text }: { text: string }) => <Text>{text}</Text>,
  },
};

export default function App() {
  return (
    <TrayProvider trays={trays}>
      <HomeScreen />
    </TrayProvider>
  );
}

function HomeScreen() {
  const traysApi = useTrays('main');
  return (
    <Button
      title="Show Tray"
      onPress={() => traysApi.push('DemoTray', { text: 'Hello from Tray!' })}
    />
  );
}
```

ShortTray: {
component: ({ title, message }) => (
<View style={{ minHeight: 100, padding: 24 }}>
<Text>{title}</Text>
<Text>{message}</Text>
</View>
),
},
TallTray: {
component: ({ items }) => (
<View style={{ minHeight: 400, padding: 24 }}>
<Text>Scrollable List</Text>
<ScrollView>
{items.map((item, index) => (
<View key={index}>
<Text>{item}</Text>
</View>
))}
</ScrollView>
</View>
),
},
};

// Configure different stack configurations
const stackConfigs = {
main: {
backdropStyles: { backgroundColor: 'rgba(0,0,0,0.5)' },
trayStyles: { backgroundColor: 'white', borderRadius: 16 },
adjustForKeyboard: true,
dismissOnBackdropPress: true,
},
secondary: {
backdropStyles: { backgroundColor: 'rgba(0,0,0,0.3)' },
enteringAnimation: SlideInUp,
exitingAnimation: SlideOutDown,
dismissOnBackdropPress: false,
},
};

// App component with TrayProvider
export default function App() {
return (
<SafeAreaProvider>
<TrayProvider trays={trays} stackConfigs={stackConfigs}>
<YourAppContent />
</TrayProvider>
</SafeAreaProvider>
);
}

````

---

## Hooks

### `useTrays`

Hook to access tray stack manipulation functions for a specific stack. Throws if used outside of a `TrayProvider`.

```tsx
const { push, pop, replace, replaceById, dismiss, dismissById, dismissAll } = useTrays(stackId);
```

#### Parameters

- `stackId: string` — Identifier for the tray stack to manipulate.

#### Returns

An object containing the following methods:

- `push(trayKey, props)` — Push a new tray onto the stack.
- `pop()` — Pop the top-most tray from the stack.
- `replaceById(trayId, props)` — Replace a tray by its unique ID.
- `replace(trayKey, props)` — Replace the top-most tray by tray key.
- `dismiss(trayKey)` — Dismiss a tray by tray key.
- `dismissById(trayId)` — Dismiss a tray by its unique ID.
- `dismissAll()` — Dismiss all trays in the stack.

All methods are fully typed. For TypeScript support, see the [TypeScript Support](#typescript-support) section below.

#### Method Details

##### `push(trayKey, props)`

Pushes a new tray onto the stack.

- **Parameters**:
  - `trayKey: string` - The key of the tray to push (must be registered in the tray registry)
  - `props: any` - Props to pass to the tray component
- **Behavior**:
  - If no trays are open: Opens a new tray
  - If trays already exist: Transitions the currently visible tray to the new tray

##### `pop()`

Removes the most recently added tray from the stack.

- **Behavior**:
  - If only one tray is left: Closes the tray completely
  - If multiple trays exist: Transitions back to the previous tray

##### `replaceById(trayId, props)`

Replaces a specific tray instance by its unique ID.

- **Parameters**:
  - `trayId: string` - The unique ID of the tray instance to replace
  - `props: any` - New props to pass to the tray component
- **Behavior**:
  - More precise than `replace()` as it targets a single tray instance
  - Preserves the stack structure while updating just one tray

##### `replace(trayKey, props)`

Replaces all instances of trays with the given key in the stack.

- **Parameters**:
  - `trayKey: string` - The key of the tray type to replace
  - `props: any` - New props to pass to the tray component(s)
- **Behavior**:
  - Updates all trays of a specific type with new props
  - Maintains the stack order but updates the content

##### `dismiss(trayKey)`

Removes all trays with the given key from the stack.

- **Parameters**:
  - `trayKey: string` - The key of the tray type to dismiss
- **Behavior**:
  - If removing the last tray: Closes the tray UI completely
  - If other trays remain: Shows the next tray in the stack

##### `dismissById(trayId)`

Removes a specific tray instance by its unique ID.

- **Parameters**:
  - `trayId: string` - The unique ID of the tray instance to dismiss
- **Behavior**:
  - More precise than `dismiss()` as it targets a single tray instance
  - If removing the last tray: Closes the tray UI completely

##### `dismissAll()`

Removes all trays from the stack, closing the tray UI completely.

### Example

```tsx
function HomeScreen() {
  // Use multiple stacks
  const mainTrays = useTrays('main'); // For general notifications
  const secondaryTrays = useTrays('secondary'); // For modal-like overlays

  return (
    <View>
      {/* Push a short tray to main stack */}
      <Button
        title="Show Notification"
        onPress={() =>
          mainTrays.push('ShortTray', {
            title: 'Simple Notification',
            message: 'This is a short tray with minimal content',
          })
        }
      />

      {/* Push an image tray to secondary stack */}
      <Button
        title="Show Image"
        onPress={() =>
          secondaryTrays.push('ImageTray', {
            imageUrl: 'https://example.com/image.jpg',
            caption: 'Beautiful landscape',
          })
        }
      />
    </View>
  );
}
```

---

## TypeScript Support

The library provides comprehensive TypeScript support with generics for type-safe tray props.

### Type Definitions

The main type definitions you'll work with include:

```tsx
// Define your tray registry
type TrayRegistry = Record<string, { component: React.ComponentType<any> }>;

// Configuration for each tray stack
type TrayStackConfig = {
  enteringAnimation?: AnimationBuilder;
  exitingAnimation?: AnimationBuilder;
  backdropStyles?: ViewStyle;
  trayStyles?: ViewStyle;
  adjustForKeyboard?: boolean;
  dismissOnBackdropPress?: boolean;
  // ... other configuration options
};
```

### Generic Type Parameters

The `useTrays` hook accepts a generic type parameter for full type safety:

```tsx
// Define your tray props type map
type TrayProps = {
  TrayKey1: { prop1: string; prop2: number };
  TrayKey2: { data: Array<any>; onSubmit: () => void };
  // ... other tray props
};

// Use the type-safe hook
const { push, pop, replace } = useTrays<TrayProps>('stackId');
```

### Type-Safe API Usage

With proper type definitions, you get full type checking for tray operations:

```tsx
// Define enum for tray keys (optional but recommended)
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
  initialValues?: Record<string, any>;
};

// Create a type map for all tray props
type TrayProps = {
  [TrayEnum.Details]: DetailsTrayProps;
  [TrayEnum.Form]: FormTrayProps;
};

// In your component
function MyComponent() {
  const { push } = useTrays<TrayProps>('main');

  // TypeScript will enforce correct props for each tray
  const openDetailsTray = () => {
    push(TrayEnum.Details, {
      id: '123',
      title: 'Product Details',
      // TypeScript error: Property 'invalid' does not exist on type 'DetailsTrayProps'
      // invalid: true,
    });
  };
}
```
      <Button
        title="Replace with Form"
        onPress={() =>
          secondaryTrays.replace('FormTray', {
            onSubmit: (text) => {
              console.log(`Submitted: ${text}`);
              secondaryTrays.pop();
            },
          })
        }
      />

      {/* Dismiss all trays */}
      <Button
        title="Dismiss All"
        onPress={() => {
          mainTrays.dismissAll();
          secondaryTrays.dismissAll();
        }}
      />
    </View>
  );
}
````

---

## Types

### `TrayRegistry`

Registry of tray components that can be used in the application.

```tsx
interface TrayRegistry {
  [key: string]: {
    component: ComponentType<any>;
  };
}
```

### `TrayProps`

Props for tray components.

```tsx
interface TrayProps {
  [key: string]: unknown;
}
```

### `TrayContextType`

Context API for tray stack.

```tsx
interface TrayContextType<T extends Record<string, unknown>> {
  push: <K extends keyof T>(trayKey: K, props: T[K]) => void;
  pop: () => void;
  replaceById: <K extends keyof T>(trayId: string, props: T[K]) => void;
  replace: <K extends keyof T>(trayKey: string, props: T[K]) => void;
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
