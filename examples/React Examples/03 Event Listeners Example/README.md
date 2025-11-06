# Event Listeners Example - React

This example demonstrates how to listen for and handle various events emitted by Zogo 360 in a React application.

## What This Example Shows

- How to add event listeners to the Zogo 360 element in React
- How to handle different types of events (initialization, messages, URL requests, sound requests)
- How to properly clean up event listeners in React
- How to display event data in a real-time log

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Event listeners**: Capturing various Zogo 360 events
- **React hooks**: Using `useRef`, `useEffect`, and `useState`
- **Event log UI**: Real-time display of captured events
- **Cleanup**: Proper removal of event listeners to prevent memory leaks

## How to Use

1. Clone or download this example
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Replace `YOUR_AUTH_TOKEN_HERE` in `src/App.js` with your actual authentication token
5. Start the development server:
   ```bash
   npm start
   ```
6. Open your browser to `http://localhost:3000`
7. Interact with Zogo 360 to see events in the log panel

## Available Events

### `zogo360:initialized`

Fired when Zogo 360 has successfully initialized.

```javascript
event.detail.config; // Contains initialization configuration
```

### `message`

Generic message event for all communications from Zogo 360.

```javascript
event.detail.type; // Message type
event.detail.payload; // Message data
```

### `openurl`

Fired when Zogo 360 requests to open an external URL.

```javascript
event.detail.url; // The URL to open
```

### `playsound`

Fired when Zogo 360 requests to play a sound.

```javascript
event.detail; // Sound information
```

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main React component with event handling
│   ├── App.css            # Component styles with event log styling
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Code

The implementation uses React hooks for event handling:

```jsx
useEffect(() => {
  const zogoElement = zogoRef.current;
  if (!zogoElement) return;

  // Event handler functions
  const handleInitialized = (event) => {
    console.log("Zogo 360 initialized with config:", event.detail.config);
    addEvent("Initialized", event.detail.config);
  };

  const handleMessage = (event) => {
    console.log("Message received:", event.detail.type, event.detail.payload);
    addEvent(`Message: ${event.detail.type}`, event.detail.payload);
  };

  // Add event listeners
  zogoElement.addEventListener("zogo360:initialized", handleInitialized);
  zogoElement.addEventListener("message", handleMessage);

  // Cleanup function
  return () => {
    zogoElement.removeEventListener("zogo360:initialized", handleInitialized);
    zogoElement.removeEventListener("message", handleMessage);
  };
}, []);
```

## Common Event Types

When listening to the `message` event, you might encounter these types:

- `EXIT_REQUESTED` - User wants to exit Zogo 360
- `MODULE_COMPLETED` - User completed a module
- `SKILL_COMPLETED` - User completed a skill
- `POINTS_EARNED` - User earned points
- `ACHIEVEMENT_UNLOCKED` - User unlocked an achievement

## Best Practices

1. **Always clean up event listeners** - Use the cleanup function in `useEffect` to remove listeners
2. **Handle errors gracefully** - Wrap event handlers in try-catch blocks for production
3. **Log events during development** - Use console.log to understand event flow
4. **Check event.detail** - Always verify the structure of event data before using it

## Example Event Handling Patterns

### Handling Exit Requests

```jsx
if (event.detail.type === "EXIT_REQUESTED") {
  const exitData = event.detail.payload;
  if (exitData.source === "back_button") {
    // Handle back button exit
  } else if (exitData.source === "end_of_module") {
    // Handle module completion
  }
}
```

### Tracking User Progress

```jsx
if (event.detail.type === "MODULE_COMPLETED") {
  const moduleData = event.detail.payload;
  // Update your app's progress tracking
  updateUserProgress(moduleData.moduleId, moduleData.score);
}
```

### Custom Sound Handling

```jsx
const handlePlaySound = (event) => {
  const audio = new Audio(event.detail.url);
  audio.play().catch((error) => {
    console.error("Failed to play sound:", error);
  });
};
```

## Notes

- Event listeners must be added after the component mounts
- The Zogo 360 element must exist before adding listeners
- Some events may require specific user interactions to trigger
- Always test event handling across different browsers
