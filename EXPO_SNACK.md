# Live Demo: Expo Snack

Experience react-native-trays in action with our interactive demo:

[![Open in Snack](https://snack.expo.dev/static/snack-expo-banner.svg)](https://snack.expo.dev/@sivanthaeatme/react-native-trays)

---

## Demo Overview

This live demo showcases the full capabilities of react-native-trays with a React Navigation-like API, multiple tray stacks, and various tray interactions.

### Featured Tray Components

| Tray Type            | Description            | Features                                        |
| -------------------- | ---------------------- | ----------------------------------------------- |
| **Short Tray**       | Simple notification    | Minimal height, quick info display              |
| **Form Tray**        | Interactive input form | Text input, form submission, keyboard awareness |
| **Tall Tray**        | Scrollable content     | Long content handling, scroll behavior          |
| **Image Tray**       | Media display          | Image rendering, captions, media controls       |
| **Wallet Details**   | Financial information  | Multiple action buttons, styled UI              |
| **Edit Wallet**      | Data editing interface | Form validation, save functionality             |
| **View Private Key** | Secure information     | Security-focused UI, copy options               |

### Multiple Stack Configurations

| Stack Name          | Purpose               | Configuration                                  |
| ------------------- | --------------------- | ---------------------------------------------- |
| **Family Stack**    | Wallet management     | Custom styling inspired by Family crypto app   |
| **Main Stack**      | General notifications | Default animations with standard backdrop      |
| **Secondary Stack** | Modal-like overlays   | Slide animations with non-dismissible backdrop |
| **Modal Stack**     | Full-screen content   | Fade animations with custom styling            |

### Animation Showcase

| Animation Type    | Description                       | Use Case                 |
| ----------------- | --------------------------------- | ------------------------ |
| **Default Slide** | Standard bottom-to-top slide      | General purpose trays    |
| **Custom Slide**  | Customized SlideInUp/SlideOutUp   | Modal-like interactions  |
| **Fade**          | Smooth FadeIn/FadeOut transitions | Subtle notifications     |
| **Custom Spring** | Bouncy spring animations          | Attention-grabbing trays |

### React Navigation-like API

The demo showcases the library's familiar API that resembles React Navigation:

```tsx
// Similar to useNavigation() in React Navigation
const { push, pop, replace } = useTrays('stackId');

// Similar to navigation.navigate()
push('DetailsTray', { id: '123' });

// Similar to navigation.goBack()
pop();

// Similar to navigation.replace()
replace('FormTray', { onSubmit: handleSubmit });
```

### TypeScript Integration

The demo demonstrates full TypeScript support with generics for type-safe tray props:

```tsx
// Type-safe hook with your TrayProps type map
const { push, pop } = useTrays<TrayProps>('family');

// TypeScript enforces correct props for each tray
push(TrayEnum.WalletDetails, {
  /* type-checked props */
});
```

---

## Interactive Demo Guide

### Basic Operations

1. **Explore Different Stacks**

   - **Family Stack**: Try the Wallet management flow with nested trays
   - **Main Stack**: Experience simple notifications with default animations
   - **Secondary Stack**: See modal-like overlays with custom slide animations
   - **Modal Stack**: View full-screen content with fade transitions

2. **Try Core API Features**
   - Push new trays onto a stack
   - Pop back to previous trays
   - Replace existing trays with new content
   - Dismiss specific trays or entire stacks

### Advanced Features

1. **API Testing Playground**

   - **Stack Management**: Test multiple stacked trays and transitions
   - **ID-based Operations**: Target specific tray instances with unique IDs
   - **Cross-stack Interactions**: Trigger trays from one stack to another
   - **Animation Customization**: See different animation configurations

2. **UI/UX Patterns**
   - Keyboard-aware forms that adjust when the keyboard appears
   - Scrollable content handling in trays
   - Backdrop blur and press-to-dismiss behaviors
   - Custom styling and theming options

---

## Implementation Details

The demo showcases several advanced patterns:

- **Stack Composition**: Multiple independent tray stacks with different configurations
- **Tray Chaining**: Sequential tray flows for multi-step processes
- **State Preservation**: Maintaining state between tray transitions
- **Responsive Design**: Adapting to different screen sizes and orientations
- **Animation Customization**: Fine-tuning animations for specific interactions

---

## Source Code

For the complete source code of this demo, see the `/example` directory in the [GitHub repository](https://github.com/sivantha96/react-native-trays).
