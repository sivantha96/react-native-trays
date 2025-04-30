# Expo Snack Example

Try out react-native-trays live:

[Open in Snack](https://snack.expo.dev/@sivanthaeatme/react-native-trays)

---

## Comprehensive Demo Features

### Multiple Tray Types

- **Short Tray**: Simple notification with minimal height
- **Form Tray**: Interactive form with text input and submission
- **Tall Tray**: Scrollable list with many items
- **Image Tray**: Media content with images and captions
- **Wallet Details Tray**: Displays wallet information with actions
- **Edit Wallet Tray**: Form for editing wallet information
- **View Private Key Tray**: Secure display of private key information

### Multiple Stacks with Different Configurations

- **Family Stack**: Default animations with custom styling for wallet-related trays (inspired by the Family crypto app)
- **Main Stack**: Default animations with standard backdrop
- **Secondary Stack**: Slide animations (SlideInUp/SlideOutUp) with non-dismissible backdrop
- **Modal Stack**: Fade animations (FadeIn/FadeOut) with custom styling

### Animation Varieties

- Default slide animations
- Custom SlideInUp/SlideOutUp animations
- FadeIn/FadeOut animations
- SlideInDown/SlideOutDown animations

### Interactive Features

- Form submission with text input
- Scrollable content with many items
- Stack-specific backdrop behavior
- Push, pop, replace, and dismiss operations
- Replace by ID and replace by key functionality
- Selective dismissal of specific tray types
- Keyboard awareness (adjusts when keyboard appears)
- Cross-stack interactions

### Styling & Customization

- Different tray heights and styles
- Custom backdrop colors and opacity
- Custom border radius configurations
- Background blur options
- Font customization with custom typefaces

---

## How to Use the Demo

1. **Family Stack**: Try the Wallet tray to see wallet management features inspired by the Family crypto app
2. **Main Stack**: Try the Short and Form trays with default animations
3. **Secondary Stack**: Open the Image tray and try replacing it with a Form tray
4. **Modal Stack**: Open the tall scrollable list tray
5. **API Testing**: Explore the API Testing Playground section for advanced operations:
   - Push Operations: Test stacking multiple trays and cross-stack interactions
   - Pop Operations: Test pop with animation and pop to root functionality
   - Replace Operations: Test replace by key, replace by ID, and replace with animation
   - Dismiss Operations: Test dismiss by key, dismiss by ID, and selective dismissal

---

## Advanced API Demonstrations

The example also showcases advanced API features:

- Triple stacking of trays
- Cross-stack interactions
- Pop to root operations
- Replace all instances of a specific tray type
- Dismiss with callbacks
- Selective dismissal of specific tray types

---

For full source code, see the `/example` directory in this repo.
