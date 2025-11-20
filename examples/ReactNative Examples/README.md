# React Native Examples App

This is a React Native app built with Expo that showcases various JavaScript examples through a navigation interface.

## Prerequisites

- Node.js v20.19.4 or higher (use `nvm use` to switch to the correct version)
- npm or yarn
- Expo Go app on your mobile device (for testing)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

## Project Structure

```
ReactNativeExamples/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Main landing page
│   │   └── ExampleScreen.js   # Placeholder for example screens
│   └── navigation/
│       └── AppNavigator.js    # Stack navigation setup
├── App.js                     # Main app entry point
├── babel.config.js            # Babel configuration
├── .nvmrc                     # Node version specification
└── package.json               # Project dependencies
```

## Navigation

The app uses React Navigation with a stack navigator. The navigation includes:

- Menu screen (main navigation hub)
- Home screen
- Placeholder screens for future examples (Example 1-5)

## Adding New Examples

To add new examples from the vanillaJSExamples folder:

1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `src/navigation/AppNavigator.js`
3. Implement the example functionality

## Running the App

1. Make sure you're using the correct Node version:

```bash
nvm use
```

2. Start the Expo development server:

```bash
npm start
```

3. Scan the QR code with Expo Go app on your phone or press 'w' to run in web browser

## Navigation Flow

The app starts with a Menu screen that lists all available examples. Users can navigate to:

- Home screen - Welcome page with instructions
- Example screens - Placeholder screens ready for implementation

## Dependencies

- React Navigation (Stack Navigator)
- React Native Screens
- React Native Safe Area Context

## Notes

- The app uses a simple stack navigation instead of drawer navigation to avoid complexity
- Each example screen receives its name as a parameter for dynamic titles
- The navigation is ready to be extended with actual example implementations
