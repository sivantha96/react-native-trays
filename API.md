# API Reference: react-native-trays

## `TrayProvider`

Provides tray stack context and renders trays. Wrap your app with this provider.

### Props

- `trays: TrayRegistry` — Registry of tray components.
- `children: ReactNode` — App children.
- `stackConfigs?: Record<string, TrayStackConfig>` — Optional stack-specific config.

### Example

```tsx
// Define multiple tray components with different heights
const trays = {
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
```

---

## `useTrays<T>(stackId: string)`

Hook to control trays in a stack. The generic type parameter `T` can be used to provide type safety for tray props.

### Returns

#### `push(trayKey, props)`

Pushes a new tray onto the stack.

- If no trays are open in this stack: Opens a new tray.
- If trays already exist in this stack: Transitions the currently visible tray to the new tray.

#### `pop()`

Removes the most recently added tray from the stack.

- If only one tray is left in the stack: Closes the tray completely.
- If multiple trays exist in the stack: Transitions back to the previous tray.

#### `replace(trayKey, props)`

Replaces all instances of trays with the given key in the stack.

- Useful for updating all trays of a specific type with new props.
- Maintains the stack order but updates the content.

#### `replaceById(trayId, props)`

Replaces a specific tray instance by its unique ID.

- More precise than `replace()` as it targets a single tray instance.
- Preserves the stack structure while updating just one tray.

#### `dismiss(trayKey)`

Removes all trays with the given key from the stack.

- If removing the last tray: Closes the tray UI completely.
- If other trays remain: Shows the next tray in the stack.

#### `dismissById(trayId)`

Removes a specific tray instance by its unique ID.

- More precise than `dismiss()` as it targets a single tray instance.
- If removing the last tray: Closes the tray UI completely.

#### `dismissAll()`

Removes all trays from the stack, closing the tray UI completely.

### Example

```tsx
function HomeScreen() {
  // Use multiple stacks
  const mainTrays = useTrays('main');
  const secondaryTrays = useTrays('secondary');

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

      {/* Replace the top tray */}
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
```

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
