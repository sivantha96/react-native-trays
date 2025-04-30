# react-native-trays

[![npm version](https://img.shields.io/npm/v/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![Downloads](https://img.shields.io/npm/dm/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://github.com/sivantha/react-native-trays/actions/workflows/ci.yml/badge.svg)](https://github.com/sivantha/react-native-trays/actions)

A production-grade, fully open-source tray system for React Native inspired by [Family](https://benji.org/family-values), supporting Expo and bare workflows. Built with TypeScript, Reanimated, and best industry practices.

---

## ✨ Features

- **API Reference:** [API.md](./API.md)
- **Live Demo:** [Expo Snack](https://snack.expo.dev/@sivantha96/react-native-trays-demo)

- **Multiple tray stacks** with independent state
- **Customizable animations** (Reanimated, slide, fade, custom)
- **Keyboard awareness** (trays move above keyboard)
- **Safe area** support
- **Backdrop** with blur and dismiss options
- **Customizable trays** (style, animation, dismiss behavior, spacing)
- **ID- and key-based operations:** push, pop, replace, dismiss
- **Hooks-based API** for great DX
- **Expo + Bare workflow** compatible
- **Strict TypeScript** and full type exports

---

## 🚀 Installation

[![npm version](https://img.shields.io/npm/v/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![Downloads](https://img.shields.io/npm/dm/react-native-trays.svg)](https://www.npmjs.com/package/react-native-trays)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://github.com/sivantha/react-native-trays/actions/workflows/ci.yml/badge.svg)](https://github.com/sivantha/react-native-trays/actions)

```sh
# With npm
yarn add react-native-trays
# Or with npm
npm install react-native-trays
```

### Install required peer dependencies

```sh
# Install all required peer dependencies
npm install react-native-reanimated react-native-safe-area-context react-native-uuid

# (Optional, for Expo users who want backdrop blur)
npm install expo-blur
```

---

## ⚠️ Required Setup: Reanimated & Safe Area

You **must** set up [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/) and [`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context#installation) before using this library.

- Follow the official [react-native-reanimated setup guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/).
- Follow the official [react-native-safe-area-context setup guide](https://github.com/th3rdwave/react-native-safe-area-context#installation).

If these are not correctly set up, the tray system will not work and you may see errors such as `Native part of Reanimated doesn't seem to be initialized (Worklets)`.

---

## 📚 API Reference

See [API.md](./API.md) for a full reference of all types, hooks, and provider props.

## 🧑‍💻 Live Example

Try it instantly on [Expo Snack](https://snack.expo.dev/@sivantha96/react-native-trays-demo) or see [EXPO_SNACK.md](./EXPO_SNACK.md).

---

## 🧠 Advanced Usage

- **Multiple Stacks:** Use different `stackId` with `useTrays` for independent tray flows (e.g., main UI and modal overlays).
- **Custom Animations:** Pass custom Reanimated builders to `TrayStackConfig` for slide, fade, or your own entry/exit effects.
- **Backdrop Blur:** On Expo, backdrop blur is enabled automatically if `expo-blur` is installed.
- **Keyboard Awareness:** Trays move above the keyboard by default; can be disabled per stack.
- **Custom Tray Components:** Register any component in the `trays` registry and pass custom props.

See [EXPO_SNACK.md](./EXPO_SNACK.md) and `/example` for more.

---

## 🛠 Basic Usage

```tsx
import { TrayProvider, useTrays } from 'react-native-trays';

const trays = {
  MyCustomTray: {
    component: MyTrayComponent,
  },
};

export default function App() {
  return (
    <TrayProvider trays={trays}>
      <YourApp />
    </TrayProvider>
  );
}

function YourApp() {
  const trays = useTrays('main');
  return (
    <Button
      title="Open Tray"
      onPress={() => trays.push('MyCustomTray', { ...props })}
    />
  );
}
```

---

<!-- See [API.md](./API.md) for the full API reference. -->

## 🎨 Customization

- Pass custom Reanimated entry/exit/layout animations
- Style trays and backdrops with `trayStyles` and `backdropStyles`
- Control dismiss behavior and spacing

---

## 🧑‍💻 Advanced Usage

### Multiple Stacks

```tsx
<TrayProvider trays={trays} stackConfigs={{ main: {...}, secondary: {...} }}>
  ...
</TrayProvider>

const mainTrays = useTrays('main');
const secondaryTrays = useTrays('secondary');
```

### Custom Animations

```tsx
import { SlideInUp, SlideOutDown } from 'react-native-reanimated';

<TrayProvider
  trays={trays}
  stackConfigs={{
    main: {
      enteringAnimation: SlideInUp,
      exitingAnimation: SlideOutDown,
    },
  }}
>
  ...
</TrayProvider>;
```

---

## 🧪 Testing

This library is fully tested with Jest and React Native Testing Library. To run tests:

```sh
yarn test
# or
npm test
```

---

## 📱 Example & Expo Snack

A live demo is available on [Expo Snack](https://snack.expo.dev/) _(link coming soon)_

---

## 🤝 Contributing

PRs and issues are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

---

## 📄 License

MIT © Sivantha
