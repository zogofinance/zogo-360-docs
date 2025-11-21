# Delayed Initialization Example - React Native Implementation

> **Implementation File:** [`/src/screens/DelayedInitializationExample.js`](../src/screens/DelayedInitializationExample.js)

This example demonstrates how to manually control when Zogo 360 initializes, rather than having it start automatically.

## What it does

1. **Shows the WebView immediately** but in an uninitialized state
2. **Displays a button interface** above the WebView for user control
3. **Configures Zogo360** on component mount but doesn't initialize
4. **Waits for user action** to send the INITIALIZE message
5. **Initializes only when triggered** by the user clicking the button

## Key Implementation Details

### User-Triggered Initialization

```javascript
const handleInitialize = () => {
  setShowWebView(true);
  // The actual initialization will happen when we receive webview_ready
};
```

### Conditional Rendering

The component conditionally renders either the button interface or the WebView:

```javascript
{!showWebView ? (
  // Show button interface
) : (
  // Show WebView
)}
```

### Delayed INITIALIZE Message

The INITIALIZE message is only sent after:

1. User clicks the button
2. WebView is created and loaded
3. `webview_ready` message is received

## Use Cases in React Native

This pattern is useful for:

1. **User Consent Required**

   - Privacy regulations compliance (GDPR, CCPA)
   - Terms of service acceptance
   - Age verification

2. **Performance Optimization**

   - Improve initial screen load time
   - Reduce memory usage until needed
   - Progressive enhancement approach

3. **Authentication Flow**

   - Wait for user to log in first
   - Fetch token from backend before initializing
   - Multi-step verification process

4. **Conditional Access**

   - Premium features for paid users
   - Different experiences for different user roles
   - Feature flags or A/B testing

5. **User-Triggered Experience**
   - "Click to start" interactions
   - Modal or bottom sheet implementations
   - Tab-based interfaces where Zogo is not the default view

## Comparison to Vanilla JS

The vanilla JS example uses:

```html
<zogo-360 id="zogo-container" width="100%" height="600px" auto-init="false">
</zogo-360>
```

And initializes with:

```javascript
zogoElement.initialize({
  user_auth_token: "YOUR_AUTH_TOKEN_HERE",
});
```

In React Native, we achieve the same delayed initialization by:

- Not rendering the WebView component until user action
- Sending the INITIALIZE message only after WebView is ready
- Using React state to control the UI flow

## File Location

The implementation can be found at:
`/src/screens/DelayedInitializationExample.js`
