# Deep Link Module Example - React Native Implementation

> **Implementation File:** [`/src/screens/DeepLinkModuleExample.js`](../src/screens/DeepLinkModuleExample.js)

This example demonstrates how to use Zogo 360's deep linking feature to open specific learning modules directly and handle the exit flow when users complete or leave a module.

## What it does

1. **Shows a module selection screen** with two example modules
2. **Opens modules in deep link mode** using `widget_type: "deep_link"`
3. **Handles exit events** to return users to the app
4. **Shows different alerts** based on completion status
5. **Provides a back button** for manual navigation

## Key Implementation Details

### Module Configuration

The example uses two real Zogo modules:

```javascript
const modules = [
  { id: "994850", name: "The Product Life Cycle" },
  { id: "1008545", name: "Investing vs. Savings Goals" },
];
```

### Deep Link Initialization

When opening a module, we use special initialization parameters:

```javascript
webViewRef.current?.sendMessage("INITIALIZE", {
  user_auth_token: "your-token-here",
  widget_type: "deep_link", // This enables deep link mode
  module_id: currentModuleId, // The specific module to open
});
```

### Exit Handling

The app handles exit events to return users to the module list:

```javascript
const handleZogoExit = (exitData) => {
  // Hide Zogo and show app content
  setShowZogo(false);

  // Handle different exit scenarios
  if (exitData.source === "end_of_module") {
    // Module was completed
    Alert.alert("Congratulations!", "You completed the module.");
  } else if (exitData.source === "back_button") {
    // User clicked back without completing
    console.log("User exited early");
  }
};
```

## UI Flow

1. **Module Selection Screen**:

   - Shows available modules with names and IDs
   - Tap a module to open it
   - Info box explains how it works

2. **Module View**:
   - Full-screen WebView with the module
   - Back button in header for manual exit
   - Automatic handling of exit events

## Comparison to Vanilla JS

The vanilla JS example toggles visibility between app content and Zogo:

```javascript
// Hide app content and show Zogo
appContent.style.display = "none";
zogoContainer.style.display = "block";
```

In React Native, we use state to control which view is shown:

```javascript
const [showZogo, setShowZogo] = useState(false);

// Conditional rendering
if (showZogo) {
  return <Zogo360WebView />;
}
return <ModuleSelectionScreen />;
```

## Exit Event Sources

The example handles different exit sources:

1. **`end_of_module`**: User completed the entire module
2. **`back_button`**: User clicked back without completing
3. **`exit_button`**: User clicked an exit button in the module

## Use Cases

This pattern is perfect for:

1. **Educational Apps**: Link specific lessons from your curriculum
2. **Banking Apps**: Offer financial literacy modules for products
3. **Employee Training**: Assign specific modules to employees
4. **Rewards Programs**: Offer points for module completion

## Best Practices

1. **Always provide a manual exit**: The header back button ensures users can always return
2. **Handle all exit scenarios**: Different exit sources may require different handling
3. **Track module starts and completions**: For analytics and progress tracking
4. **Show loading states**: While the module is initializing

## Integration Ideas

### Progress Tracking

```javascript
if (exitData.source === "end_of_module") {
  // Update user's progress
  updateUserProgress({
    moduleId: exitData.context.moduleId,
    completed: true,
    completedAt: new Date(),
  });
}
```

### Sequential Learning

```javascript
const learningPath = ["994850", "1008545", "1234567"];
// After completion, open next module automatically
```

### Gamification

```javascript
if (exitData.source === "end_of_module") {
  // Award points
  awardPoints(100);
  // Check achievements
  checkAchievements(userId, moduleId);
}
```

## File Location

The implementation can be found at:
`/src/screens/DeepLinkModuleExample.js`
