# Zogo 360 Integration Message Event Handling Guide

This guide documents all message events that the Zogo 360 Integration sends to parent applications and how to handle them.

## Setting Up Event Listeners

To integrate with the Zogo 360, set up a message event listener in your parent application:

```javascript
window.addEventListener("message", (event) => {
  // Verify the origin for security
  if (event.origin !== "https://your-zogo-domain.com") {
    return;
  }

  // Handle the message based on type
  const { type, payload } = event.data;

  switch (type) {
    case "CONTAINER_READY":
      handleContainerReady(payload);
      break;
    case "EXIT_REQUESTED":
      handleExitRequest(payload);
      break;
    // ... handle other message types
  }
});
```

## Sending Messages to the Zogo 360 Integration

To send messages to the Zogo 360 Integration:

```javascript
const zogoIntegration = document.getElementById("zogo-360-integration");
zogoIntegration.contentWindow.postMessage(
  {
    type: "MESSAGE_TYPE",
    payload: {
      /* your data */
    },
  },
  "https://your-zogo-domain.com"
);
```

## Message Types Reference

### Initialization Events

#### CONTAINER_READY

**When Received**: When the Zogo 360 Integration has loaded and is ready for initialization
**Response Action**: Send an `INITIALIZE` message with configuration

```javascript
function handleContainerReady(payload) {
  // payload contains:
  // - timestamp: when the integration became ready
  // - capabilities: array of supported features
  // - version: integration version
  // - availablePages: navigation options

  // Send initialization config
  sendToZogo360({
    type: "INITIALIZE",
    payload: {
      user_auth_token: "user-token",
      widget_type: "full_experience", // or 'deep_link'
      // ... other config
    },
  });
}
```

#### REQUEST_INITIALIZATION

**When Received**: When the Zogo 360 Integration needs initialization data
**Response Action**: Send `INITIALIZE` message with configuration

#### INITIALIZATION_COMPLETE

**When Received**: After successful initialization
**Response Action**: Enable user interaction, show the integration

```javascript
function handleInitComplete(payload) {
  // payload.success: boolean
  // payload.results: initialization results by component
  if (payload.success) {
    showZogo360Integration();
  }
}
```

#### INITIALIZATION_ERROR

**When Received**: When initialization fails  
**Response Action**: Handle error, possibly retry or show error message

```javascript
function handleInitError(payload) {
  console.error("Init failed:", payload.error);
  // Show error UI or retry
}
```

### Authentication Events

#### AUTH_TOKEN_PROCESSED

**When Received**: After authentication token validation  
**Response Action**: Handle success/failure accordingly

```javascript
function handleAuthProcessed(payload) {
  if (payload.success) {
    // User authenticated successfully
  } else {
    // Handle auth failure: payload.error
  }
}
```

### Navigation Events

#### NAVIGATION_COMPLETE

**When Received**: After successful page navigation  
**Response Action**: Update your UI if needed

```javascript
function handleNavComplete(payload) {
  // payload.page: which page was navigated to
  // payload.path: the actual path
  updateBreadcrumbs(payload.page);
}
```

#### NAVIGATION_ERROR

**When Received**: When navigation fails  
**Response Action**: Handle error, possibly retry

#### NAVIGATION_STATE

**When Received**: In response to `REQUEST_NAVIGATION_STATE`  
**Response Action**: Update UI to reflect current page

### User Action Events

#### EXIT_REQUESTED

**When Received**: When user wants to exit the current flow
**Response Action**: Close the integration, navigate away, or confirm exit

```javascript
function handleExitRequest(payload) {
  // payload.source: where exit was triggered from
  // - 'back_button': user clicked back
  // - 'exit_button': user clicked exit
  // - 'end_of_module': module completed

  if (payload.source === "end_of_module") {
    showCompletionMessage();
  }
  closeZogo360Integration();
}
```

#### OPEN_URL

**When Received**: When the Zogo 360 Integration needs to open an external URL
**Response Action**: Open URL in new tab/window

```javascript
function handleOpenUrl(payload) {
  window.open(payload.url, "_blank");
}
```

### Customization Events

#### CUSTOM_CSS_APPLIED

**When Received**: After custom CSS is applied  
**Response Action**: Log success or update UI

#### CUSTOM_CSS_ERROR

**When Received**: When CSS fails to load  
**Response Action**: Handle error, possibly retry

#### CUSTOM_SOUNDS_LOADED

**When Received**: After custom sounds are loaded  
**Response Action**: Log success

#### CUSTOM_SOUNDS_ERROR

**When Received**: When sounds fail to load  
**Response Action**: Handle error gracefully

### Status Events

#### APP_STATUS

**When Received**: General status updates  
**Response Action**: Update UI or log status

#### APP_DATA

**When Received**: When the Zogo 360 Integration sends data
**Response Action**: Process data as needed

## Messages to Send to the Zogo 360 Integration

### INITIALIZE

**When to Send**: After receiving `CONTAINER_READY`

```javascript
{
  type: 'INITIALIZE',
  payload: {
    user_auth_token: 'token',
    widget_type: 'full_experience', // or 'deep_link'
    module_id: 123, // if deep_link to module
    skill_id: 456, // if deep_link to skill
    customCSS: {
      css: 'body { background: #f0f0f0; }',
      url: 'https://cdn.example.com/custom.css',
      priority: 'inline' // or 'remote'
    },
    customSounds: {
      sounds: [
        { name: 'correct-sound', media_url: 'https://cdn.example.com/correct.mp3' }
      ],
      muteDefault: false
    },
    messaging: {
      welcomeMessage: 'Welcome!',
      completionMessage: 'Great job!'
    }
  }
}
```

### NAVIGATE_TO

**When to Send**: To navigate the Zogo 360 Integration to a specific page

```javascript
{
  type: 'NAVIGATE_TO',
  payload: {
    page: 'LEARN', // See available pages below
    params: {
      moduleId: 123,
      queryParams: { /* optional */ }
    }
  }
}
```

### REQUEST_NAVIGATION_STATE

**When to Send**: To get current page information

```javascript
{
  type: "REQUEST_NAVIGATION_STATE";
}
```

### CUSTOM_CSS

**When to Send**: To apply custom styling

```javascript
{
  type: 'CUSTOM_CSS',
  payload: {
    css: 'body { font-family: Arial; }',
    url: 'https://cdn.example.com/styles.css'
  }
}
```

### CUSTOM_SOUNDS

**When to Send**: To override default sounds

```javascript
{
  type: 'CUSTOM_SOUNDS',
  payload: {
    sounds: [
      { name: 'correct-sound', media_url: 'https://example.com/ding.mp3' },
      { name: 'incorrect-sound', media_url: 'https://example.com/buzz.mp3' }
    ]
  }
}
```

## Available Navigation Pages

- `HOME` - Main dashboard
- `LEARN` - Learning modules
- `CATEGORIES` - Browse categories
- `MY_SKILLS` - User's skills
- `LEADERBOARDS` - Competition rankings
- `TRIVIA_PARTY` - Daily trivia game
- `MARKETPLACE` - Rewards marketplace
- `ACHIEVEMENTS` - User achievements
- `SKILL_INTERSTITIAL` - Skill transition page

## Widget Types

- `full_experience` - Complete Zogo experience (default)
- `deep_link` - Direct access to specific module/skill (requires module_id or skill_id)

## Security Considerations

1. Always verify the message origin
2. Validate message structure before processing
3. Sanitize any data before using it
4. Use specific origin URLs instead of '\*' when posting messages

## Example Implementation

```javascript
class Zogo360Integration {
  constructor(integrationId, zogoOrigin) {
    this.integration = document.getElementById(integrationId);
    this.origin = zogoOrigin;
    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener("message", (event) => {
      if (event.origin !== this.origin) return;

      const { type, payload } = event.data;

      // Emit custom events for your app
      this.emit(`zogo:${type}`, payload);
    });
  }

  sendMessage(message) {
    this.integration.contentWindow.postMessage(message, this.origin);
  }

  initialize(config) {
    // Wait for ready signal
    this.once("zogo:CONTAINER_READY", () => {
      this.sendMessage({
        type: "INITIALIZE",
        payload: config,
      });
    });
  }
}

// Usage
const zogo360 = new Zogo360Integration(
  "zogo-360-integration",
  "https://app.zogo.com"
);
zogo360.initialize({
  user_auth_token: "user-token-here",
  widget_type: "full_experience",
});

zogo360.on("zogo:EXIT_REQUESTED", (payload) => {
  // Handle exit
});
```
