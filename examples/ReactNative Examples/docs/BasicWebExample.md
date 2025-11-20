# Basic Web Example - React Native Implementation

> **Implementation File:** [`/src/screens/BasicWebExample.js`](../src/screens/BasicWebExample.js)

This example demonstrates the most basic implementation of Zogo 360 in a React Native application.

## What it does

1. **Configures Zogo360** with an authentication token when the component mounts
2. **Renders the Zogo360WebView** component in full screen
3. **Listens for the `webview_ready` message** and automatically sends the INITIALIZE message
4. **Logs all messages** from Zogo360 to the console for debugging

## Key Implementation Details

### Configuration

```javascript
Zogo360.configure({
  token: "your-auth-token-here",
});
```

### Initialization

When the WebView reports it's ready, we automatically initialize it:

```javascript
if (type === "webview_ready") {
  webViewRef.current?.sendMessage("INITIALIZE", {
    user_auth_token: "your-auth-token-here",
    widget_type: "full_experience",
  });
}
```

### Message Handling

All messages from the WebView are logged:

```javascript
const handleMessage = (type, data) => {
  console.log("Message from Zogo360:", type, data);
  // Handle specific message types here
};
```

## Comparison to Vanilla JS

The vanilla JS example uses:

```html
<zogo-360 token="YOUR_AUTH_TOKEN_HERE" width="100%" height="600px"></zogo-360>
```

In React Native, we achieve the same result with:

- `Zogo360.configure()` for setting the token
- `<Zogo360WebView>` component for rendering
- `sendMessage("INITIALIZE", ...)` for initialization
- `onMessage` prop for handling communication

## File Location

The implementation can be found at:
`/src/screens/BasicWebExample.js`
