# Event Listeners Example

This example demonstrates how to listen for and handle events emitted by the Zogo 360 component.

## What This Example Shows

- How to listen for Zogo 360 events
- What events are available
- How to handle each event type
- Real-world use cases for each event

## Requirements

- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Available Events

### 1. `zogo360:initialized`

**Description**: This event fires when the Zogo 360 component has been successfully initialized with your configuration. It indicates that the component has processed your authentication token and any custom settings, and is ready for user interaction.

**When to use:**

- Display a success message to users
- Hide loading indicators or splash screens
- Enable UI elements that depend on Zogo being ready
- Log successful initialization for analytics
- Trigger any post-initialization setup in your application

**Event data:**

```javascript
event.detail.config; // The complete configuration object that was used
// Includes: user_auth_token, customCSS, customSounds, etc.
```

**Example:**

```javascript
zogoElement.addEventListener("zogo360:initialized", function (event) {
  console.log("Zogo 360 is ready with config:", event.detail.config);
  document.getElementById("loading-spinner").style.display = "none";
  document.getElementById("zogo-status").textContent = "Ready!";
});
```

### 2. `message`

**Description**: This is the primary communication channel between the Zogo 360 iframe and your page. All detailed status updates, state changes, and system messages come through this event. Understanding these messages allows you to deeply integrate Zogo into your application.

**When to use:**

- Monitor the complete lifecycle of Zogo 360
- Handle specific user actions like exit requests
- Track navigation between different sections
- Debug integration issues
- Build custom UI that responds to Zogo's state

**Event structure:**

```javascript
event.detail = {
  type: string, // The message type (see comprehensive list below)
  payload: object, // Message-specific data
  origin: string, // Origin of the message for security validation
};
```

#### Key Message Types:

##### Initialization Messages

**`CONTAINER_READY`**

- **Description**: The iframe container has loaded and is ready to receive initialization data. This is typically the first message you'll receive.
- **Payload**:
  ```javascript
  {
    timestamp: number,        // When the container became ready
    capabilities: string[],   // Features supported by this version
    version: string,         // Zogo 360 version number
    availablePages: string[] // Pages user can navigate to
  }
  ```
- **Use case**: Know when it's safe to send initialization data or check version compatibility

**`REQUEST_INITIALIZATION`**

- **Description**: The iframe is actively requesting initialization configuration. This happens if auto-initialization is delayed.
- **Payload**: `{ timestamp: number }`
- **Use case**: Respond by initializing the component if you haven't already

**`INITIALIZATION_COMPLETE`**

- **Description**: All initialization steps have finished successfully. Zogo 360 is fully operational.
- **Payload**:
  ```javascript
  {
    success: boolean,     // Always true for this message
    timestamp: number,    // Completion time
    results: {           // Details about what was initialized
      auth: boolean,
      css: boolean,
      sounds: boolean,
      // ... other components
    }
  }
  ```
- **Use case**: Enable features that require full initialization, start user tutorials

**`INITIALIZATION_ERROR`**

- **Description**: Something went wrong during initialization. This could be an invalid token, network error, or configuration issue.
- **Payload**:
  ```javascript
  {
    error: string,      // Human-readable error message
    timestamp: number,  // When error occurred
    details?: object    // Additional error context
  }
  ```
- **Use case**: Show error messages, retry initialization, or contact support

##### User Action Messages

**`EXIT_REQUESTED`**

- **Description**: The user has indicated they want to leave Zogo 360. This could be from clicking a back button, exit button, or completing a module.
- **Payload**:
  ```javascript
  {
    source: string,    // Where the exit was triggered from:
                      // 'back_button' - User clicked back
                      // 'exit_button' - User clicked exit
                      // 'end_of_module' - Module completed
    context?: {       // Additional context about the exit
      currentPage: string,
      moduleId?: string,
      progress?: number
    }
  }
  ```
- **Use case**: Hide Zogo 360, return to your app, save user progress, show completion messages

##### Navigation Messages

**`NAVIGATION_COMPLETE`**

- **Description**: The user has successfully navigated to a new page within Zogo 360.
- **Payload**:
  ```javascript
  {
    page: string,      // Page name (HOME, LEARN, MARKETPLACE, etc.)
    success: boolean,  // Navigation succeeded
    path: string,      // URL path within Zogo
    timestamp: number, // When navigation completed
    previousPage?: string // Where they came from
  }
  ```
- **Use case**: Update breadcrumbs, track user journey, adjust your UI to match

**`NAVIGATION_ERROR`**

- **Description**: Navigation to a requested page failed. This might happen if the user lacks permissions or the page doesn't exist.
- **Payload**:
  ```javascript
  {
    page: string,      // Attempted page
    error: string,     // Why it failed
    timestamp: number,
    fallbackPage?: string // Where user was redirected instead
  }
  ```
- **Use case**: Show error notifications, log issues, guide user to available content

##### Authentication Messages

**`AUTH_TOKEN_PROCESSED`**

- **Description**: The authentication token has been validated and processed. This confirms the user's identity within Zogo.
- **Payload**:
  ```javascript
  {
    success: boolean,   // Token was valid
    error?: string,     // Error message if failed
    timestamp: number,
    userId?: string     // User identifier if successful
  }
  ```
- **Use case**: Confirm user authentication, handle invalid tokens, proceed with personalized content

##### Customization Messages

**`CUSTOM_CSS_APPLIED`**

- **Description**: Custom CSS has been successfully applied to Zogo 360's interface.
- **Payload**:
  ```javascript
  {
    success: boolean,
    timestamp: number,
    source: 'inline' | 'remote', // How CSS was applied
    cssLength?: number  // Size of CSS applied
  }
  ```
- **Use case**: Confirm branding applied, log customization success

**`CUSTOM_SOUNDS_LOADED`**

- **Description**: Custom sound effects have been loaded and are ready to play.
- **Payload**:
  ```javascript
  {
    soundNames: string[], // Names of sounds loaded
    success: boolean,
    timestamp: number,
    totalSounds: number   // How many sounds loaded
  }
  ```
- **Use case**: Enable sound controls, show audio settings

### 3. `openurl`

**Description**: Zogo 360 needs to open an external URL. This could be for terms of service, external resources, or partner websites. By default, these would open in a new tab, but you can customize this behavior.

**When to use:**

- Open links in a modal or iframe instead of new tabs
- Track which external resources users access
- Validate URLs for security
- Show warnings before leaving your site
- Log external link clicks for analytics

**Event data:**

```javascript
event.detail = {
    url: string,        // The full URL to open
    target?: string,    // Suggested target (_blank, _self, etc.)
    context?: string    // Why this URL is being opened
}
```

**Example implementations:**

```javascript
// Simple new tab
zogoElement.addEventListener("openurl", function (event) {
  window.open(event.detail.url, "_blank");
});

// With confirmation
zogoElement.addEventListener("openurl", function (event) {
  if (confirm(`Open ${event.detail.url} in a new tab?`)) {
    window.open(event.detail.url, "_blank");
  }
});

// In a modal
zogoElement.addEventListener("openurl", function (event) {
  showModalWithIframe(event.detail.url);
});
```

### 4. `playsound`

**Description**: Zogo 360 wants to play a sound effect. This could be for achievements, notifications, or interactive feedback. The component delegates sound playing to your application so you can respect user preferences and use your own audio system.

**When to use:**

- Implement a mute/unmute feature
- Use your application's audio system
- Apply volume controls
- Track which sounds are played
- Replace with custom sound effects

**Event data:**

```javascript
event.detail = {
    name: string,       // Sound identifier (e.g., 'achievement', 'notification')
    url?: string,       // URL to the sound file
    volume?: number,    // Suggested volume (0-1)
    loop?: boolean      // Whether to loop the sound
}
```

**Example implementations:**

```javascript
// Basic implementation
zogoElement.addEventListener("playsound", function (event) {
  const audio = new Audio(event.detail.url);
  audio.play();
});

// With volume control
zogoElement.addEventListener("playsound", function (event) {
  if (userSettings.soundEnabled) {
    const audio = new Audio(event.detail.url);
    audio.volume = userSettings.volume * (event.detail.volume || 1);
    audio.play();
  }
});
```

## Complete Example: Handling All Events

```javascript
const zogoElement = document.getElementById("zogo-container");

// Track initialization
zogoElement.addEventListener("zogo360:initialized", function (event) {
  console.log("✅ Zogo initialized with:", event.detail.config);
  hideLoadingScreen();
});

// Handle all messages
zogoElement.addEventListener("message", function (event) {
  const { type, payload } = event.detail;

  console.log(`📨 Message: ${type}`, payload);

  // Handle specific message types
  switch (type) {
    case "EXIT_REQUESTED":
      handleUserExit(payload.source, payload.context);
      break;

    case "NAVIGATION_COMPLETE":
      updateBreadcrumbs(payload.page);
      trackPageView(payload.page, payload.path);
      break;

    case "INITIALIZATION_ERROR":
      showErrorMessage(`Initialization failed: ${payload.error}`);
      break;

    case "AUTH_TOKEN_PROCESSED":
      if (!payload.success) {
        handleAuthError(payload.error);
      }
      break;
  }
});

// Handle external URLs
zogoElement.addEventListener("openurl", function (event) {
  console.log("🔗 Opening URL:", event.detail.url);

  // Check if URL is trusted
  if (isTrustedDomain(event.detail.url)) {
    window.open(event.detail.url, "_blank");
  } else {
    showWarning(`External link: ${event.detail.url}`);
  }
});

// Handle sounds
zogoElement.addEventListener("playsound", function (event) {
  console.log("🔊 Playing sound:", event.detail.name);

  if (audioManager.isEnabled()) {
    audioManager.play(event.detail.url, event.detail.volume);
  }
});
```

## Best Practices

1. **Always log events during development** to understand the flow
2. **Handle errors gracefully** - especially initialization and authentication errors
3. **Respect user preferences** for sounds and external links
4. **Track important events** for analytics and debugging
5. **Test edge cases** like network failures and invalid tokens
6. **Don't assume event order** - be prepared for events in any sequence
7. **Validate message origins** in production for security

## Debugging Tips

- Use `console.log` liberally to see all events and their payloads
- Check the browser's Network tab to see iframe communication
- Look for `INITIALIZATION_ERROR` messages if things aren't working
- Monitor `AUTH_TOKEN_PROCESSED` to ensure authentication succeeds
- Watch for `CONTAINER_READY` before attempting any operations
