# Deep Link Module Example - React

This example demonstrates how to deep link directly to specific Zogo 360 modules from within a React application, allowing users to jump straight into targeted learning content.

## What This Example Shows

- How to initialize Zogo 360 with deep link configuration in React
- How to pass module IDs to open specific content
- How to handle the transition between your app and Zogo 360
- How to handle exit events when users complete or leave modules

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- Valid module IDs from your Zogo 360 content library
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep linking**: Using `widget_type: "deep_link"` with `module_id`
- **Dynamic initialization**: Initializing with different module IDs based on user selection
- **Exit handling**: Detecting when users complete or exit modules
- **State management**: Managing UI transitions between app content and Zogo 360

## How to Use

1. Clone or download this example
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Replace `YOUR_AUTH_TOKEN_HERE` in `src/App.js` with your actual authentication token
5. Optionally, update the module IDs in the `modules` array with your own content
6. Start the development server:
   ```bash
   npm start
   ```
7. Open your browser to `http://localhost:3000`
8. Click on any module to launch it in Zogo 360

## Deep Link Configuration

The key to deep linking is the initialization configuration:

```javascript
zogoElement.initialize({
  user_auth_token: "YOUR_AUTH_TOKEN_HERE",
  widget_type: "deep_link",
  module_id: moduleId,
});
```

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main React component with deep linking logic
│   ├── App.css            # Component styles with module cards
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Implementation Details

### Module Selection UI

The app displays available modules as cards:

```jsx
const modules = [
  {
    id: "994850",
    name: "The Product Life Cycle",
    description: "Learn about the stages products go through...",
  },
  {
    id: "1008545",
    name: "Investing vs. Savings Goals",
    description: "Understand the differences between investing...",
  },
];
```

### State Management

The app manages two states:

- `showZogo`: Controls whether to show app content or Zogo 360
- `currentModule`: Tracks which module is currently open

### Exit Handling

The app listens for exit events and responds appropriately:

```jsx
const handleZogoExit = (exitData) => {
  setShowZogo(false);

  if (exitData.source === "end_of_module") {
    // Module was completed
    alert(`Congratulations! You completed "${currentModule.name}".`);
  } else if (exitData.source === "back_button") {
    // User exited early
    console.log("User exited early");
  }
};
```

## Exit Event Sources

When users exit Zogo 360, the `EXIT_REQUESTED` event includes a source:

- `end_of_module`: User completed the entire module
- `back_button`: User clicked the back button
- `exit_button`: User clicked an exit button (if available)
- `browser_back`: User used browser navigation

## Use Cases

### Learning Management System (LMS)

Integrate specific modules into your curriculum:

```jsx
const curriculum = [
  { week: 1, moduleId: "994850", required: true },
  { week: 2, moduleId: "1008545", required: true },
  { week: 3, moduleId: "1012340", required: false },
];
```

### Personalized Learning Paths

Recommend modules based on user progress:

```jsx
const getRecommendedModules = (userProfile) => {
  if (userProfile.level === "beginner") {
    return beginnerModules;
  } else if (userProfile.interests.includes("investing")) {
    return investmentModules;
  }
  // ... more logic
};
```

### Gamification

Track module completions for rewards:

```jsx
const handleModuleComplete = (moduleId) => {
  updateUserProgress(moduleId);
  checkForAchievements();
  awardPoints(100);
};
```

## Best Practices

1. **Validate Module IDs**: Ensure module IDs exist before attempting to open them
2. **Handle Loading States**: Show a loading indicator while Zogo 360 initializes
3. **Save Progress**: Track which modules users have started or completed
4. **Provide Context**: Show module descriptions so users know what they're starting
5. **Handle Errors**: Gracefully handle cases where modules fail to load

## Module ID Management

To get valid module IDs:

1. Contact your Zogo 360 account manager
2. Use the Zogo 360 admin dashboard
3. Check your content library documentation

## Notes

- Module IDs are specific to your organization's content library
- Deep linking requires proper authentication
- Users can navigate away from the specified module once inside Zogo 360
- Consider implementing module prerequisites in your app logic
