# Zogo 360 React Native Implementation Guide

This guide provides comprehensive instructions for implementing the Zogo 360 React Native package in your application. The package enables seamless integration of Zogo's financial education platform into React Native apps.

## Package Overview

The `zogo-360-react-native` package provides two main components:

- **Zogo360**: Configuration and utility module for authentication and settings
- **Zogo360WebView**: A specialized WebView component for displaying Zogo 360 content

## Installation

Install the package using npm or yarn:

```bash
npm install zogo-360-react-native
```

### Required Dependencies

The package requires the following peer dependencies:

```bash
npm install react-native-webview
```

## Basic Implementation

### 1. Import the Package

```javascript
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";
```

### 2. Configure Authentication

Before using the WebView, configure Zogo360 with your authentication token:

```javascript
useEffect(() => {
  Zogo360.configure({
    token: "your-authentication-token-here",
  });
}, [token]);
```

### 3. Implement the WebView

Create a component with the Zogo360WebView and handle the initialization:

```javascript
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Zogo360, Zogo360WebView } from "zogo-360-react-native";

const ZogoIntegration = () => {
  const webViewRef = useRef(null);
  const token = "your-authentication-token";

  useEffect(() => {
    Zogo360.configure({
      token: token,
    });
  }, [token]);

  const handleMessage = (data) => {
    try {
      const message = JSON.parse(data);

      // Handle initialization request
      if (message.type === "REQUEST_INITIALIZATION") {
        webViewRef.current?.sendMessage("INITIALIZE", {
          user_auth_token: token,
          widget_type: "full_experience",
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webViewContainer}>
        <Zogo360WebView
          ref={webViewRef}
          onMessage={handleMessage}
          style={styles.webView}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
```

## Message Communication

The Zogo360WebView communicates through a message-based system. Here are the key message types:

### Incoming Messages (from WebView)

- `REQUEST_INITIALIZATION`: WebView is ready for initialization
- `INITIALIZATION_COMPLETE`: Zogo 360 has been successfully initialized
- `OPEN_URL`: Request to open an external URL
- `PLAY_SOUND`: Request to play a sound
- `NAVIGATION_COMPLETE`: Navigation within Zogo 360 completed
- `ERROR` / `INITIALIZATION_ERROR`: Error occurred
- `EXIT_REQUESTED`: User requested to exit

### Outgoing Messages (to WebView)

- `INITIALIZE`: Send authentication and configuration data

## Widget Types

When initializing, you can specify different widget types:

- `full_experience`: Complete Zogo 360 experience
- `module`: Specific educational module
- `skill`: Individual skill or lesson

## Advanced Features

### Event Listeners

Handle various events from the WebView:

```javascript
const handleMessage = (data) => {
  const message = JSON.parse(data);

  switch (message.type) {
    case "OPEN_URL":
      // Handle external URL requests
      if (message.payload?.url) {
        Linking.openURL(message.payload.url);
      }
      break;

    case "ERROR":
      // Handle errors
      console.error("Error:", message.payload?.message);
      break;
  }
};
```

### Deep Linking

Navigate directly to specific modules or skills:

```javascript
// Deep link to a specific module
webViewRef.current?.sendMessage("INITIALIZE", {
  user_auth_token: token,
  widget_type: "module",
  module_id: "specific-module-id",
});

// Deep link to a specific skill
webViewRef.current?.sendMessage("INITIALIZE", {
  user_auth_token: token,
  widget_type: "skill",
  skill_id: "specific-skill-id",
});
```

### Custom Configuration

Pass additional configuration options during initialization:

```javascript
webViewRef.current?.sendMessage("INITIALIZE", {
  user_auth_token: token,
  widget_type: "full_experience",
  theme: "dark",
  language: "es",
  custom_styles: {
    primaryColor: "#007bff",
    fontFamily: "Arial",
  },
});
```

## Example Implementations

Explore our comprehensive example implementations to see the package in action:

### 1. [Basic Web Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/BasicWebExample.js)

Simple integration showing the basic setup and initialization flow.

### 2. [Delayed Initialization Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/DelayedInitializationExample.js)

Demonstrates how to initialize Zogo 360 after user interaction or specific conditions are met.

### 3. [Event Listeners Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/EventListenersExample.js)

Shows comprehensive event handling with console logging for debugging.

### 4. [Deep Link Module Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/DeepLinkModuleExample.js)

Navigate directly to specific educational modules.

### 5. [Deep Link Skill Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/DeepLinkSkillExample.js)

Navigate directly to individual skills or lessons.

### 6. [Advanced Configuration Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/AdvancedConfigurationExample.js)

Demonstrates custom theming, styling, and advanced configuration options.

### 7. [User Data Example](https://github.com/your-repo/examples/ReactNative%20Examples/src/screens/UserDataExample.js)

Shows how to pass and handle user-specific data.

## Running the Examples

To run the example React Native app:

1. Navigate to the examples directory:

```bash
cd examples/ReactNative\ Examples
```

2. Install dependencies:

```bash
npm install
```

3. Start the Expo development server:

```bash
npm start
```
