# Example Usage: react-native-trays

Below is a simple example of how to use `react-native-trays` in your app. For advanced usage, see [README.md](./README.md) and [API.md](./API.md).

Below is a simple example of how to use `react-native-trays` in your app. For a live demo, see the [Expo Snack](https://snack.expo.dev/@sivanthaeatme/react-native-trays).

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

---

For advanced configuration (multiple stacks, custom animations, keyboard handling, etc.), see [README.md](./README.md) and [API.md](./API.md).
