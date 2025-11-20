# Event Listeners Example - React Native Implementation

> **Implementation File:** [`/src/screens/EventListenersExample.js`](../src/screens/EventListenersExample.js)

This example demonstrates how to listen for and handle events emitted by the Zogo 360 component, with a visual console output displayed on screen.

## What it does

1. **Split-screen layout** with WebView on top (2/3 of screen) and console output on bottom (1/3 of screen)
2. **Visual console output** showing all messages in real-time
3. **Auto-scrolling logs** to always show the latest messages
4. **Handles specific event types**:
   - `webview_ready` - Triggers initialization
   - `zogo360:initialized` - Logs initialization config
   - `open_url`/`openurl` - Opens external URLs
   - `play_sound`/`playsound` - Logs sound requests

## Key Implementation Details

### Visual Console

The example includes a dark-themed console at the bottom of the screen that displays all events:

```javascript
const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  const id = `${Date.now()}-${Math.random()}`;
  setLogs((prev) => [...prev, { id, message, timestamp }]);
  // Auto-scroll to bottom
  setTimeout(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, 100);
};
```

### Message Handling

All messages are both logged to the developer console AND displayed on screen:

```javascript
const handleMessage = (type, data) => {
  // Log to console and visual display
  const logMessage = `Message received: ${type} ${JSON.stringify(data)}`;
  console.log(logMessage);
  addLog(logMessage);

  // Handle specific message types...
};
```

## Layout

The screen is divided into two sections:

1. **Top Section (2/3)**: Zogo360 WebView
2. **Bottom Section (1/3)**: Console output with:
   - Dark theme for console appearance
   - Timestamp for each log entry
   - Auto-scrolling to show latest messages
   - Log counter in the header

## Comparison to Vanilla JS

The vanilla JS example logs to the browser console:

```javascript
zogoElement.addEventListener("message", function (event) {
  console.log("Message received:", event.detail.type, event.detail.payload);
});
```

In React Native, we:

- Log to the developer console (same as vanilla JS)
- ALSO display logs on screen for easier mobile debugging
- Use React Native's `Linking` API instead of `window.open`

## Key Features

1. **On-Screen Console**: See all events without needing to connect to a debugger
2. **Timestamped Logs**: Each message shows when it was received
3. **Auto-Scrolling**: Always see the latest messages
4. **Dark Theme**: Console-like appearance for the log viewer
5. **Log Counter**: Shows total number of messages received

## Use Cases

This example is particularly useful for:

1. **Mobile Debugging**: See console output directly on the device
2. **Understanding Event Flow**: Visual representation of all communication
3. **Demo/Presentation**: Show event handling to stakeholders
4. **Development**: Quick debugging without external tools

## Console Output Example

The on-screen console will show messages like:

```
[5:23:45 PM] Message received: webview_ready {"loaded":true}
[5:23:45 PM] WebView ready - sending INITIALIZE message
[5:23:46 PM] Message received: DEBUG_INFO {...}
[5:23:47 PM] Message received: zogo360:initialized {"config":{...}}
```

## File Location

The implementation can be found at:
`/src/screens/EventListenersExample.js`
