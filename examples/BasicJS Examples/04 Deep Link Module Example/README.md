# Deep Link Module Example

This example demonstrates how to use Zogo 360's deep linking feature to open specific learning modules directly, and how to properly handle the exit flow when users complete or leave a module.

## What This Example Shows

- How to use the `widget_type: 'deep_link'` configuration
- How to pass a specific `module_id` to open a module directly
- How to handle the `EXIT_REQUESTED` event properly
- How to integrate module completion into your application flow

## Requirements

- A valid Zogo 360 authentication token
- Valid module IDs (this example uses real module IDs)
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep Link Widget Type**: Opens a specific module instead of the full Zogo experience
- **Module ID Parameter**: Directs users to a specific learning module
- **Exit Event Handling**: Properly returns users to your application
- **Dynamic Initialization**: Initializes with different modules based on user selection

## How Deep Linking Works

When you initialize Zogo 360 with `widget_type: 'deep_link'` and a `module_id`, the component:

1. Skips the Zogo home page and navigation
2. Opens directly to the specified module
3. Focuses the user on completing that specific content
4. Sends an `EXIT_REQUESTED` event when the user finishes or exits

## Example Module IDs

This example includes two real Zogo modules:

- **994850**: "The Product Life Cycle" - Learn about how products evolve in the market
- **1008545**: "Investing vs. Savings Goals" - Understand the difference between saving and investing

## Exit Handler Implementation

The exit handler is crucial for deep link integrations because it:

1. Returns users to your application when they're done
2. Lets you track module completion
3. Allows you to update user progress or unlock rewards

### Exit Event Payload

When a user exits, you'll receive:

```javascript
{
  type: 'EXIT_REQUESTED',
  payload: {
    source: string,  // Why they're exiting
    context: {       // Additional information
      currentPage: string,
      moduleId: string,
      progress: number
    }
  }
}
```

### Exit Sources

- **`end_of_module`**: User completed the entire module successfully
- **`back_button`**: User clicked back/exit without completing
- **`exit_button`**: User explicitly clicked an exit button

## Integration Patterns

### 1. Course Catalog Integration

```javascript
// Display your course catalog
const courses = [
  { id: "994850", name: "The Product Life Cycle", points: 100 },
  { id: "1008545", name: "Investing vs. Savings Goals", points: 150 },
];

courses.forEach((course) => {
  const button = createCourseButton(course);
  button.onclick = () => openZogoModule(course.id);
});
```

### 2. Progress Tracking

```javascript
function handleZogoExit(exitData) {
  if (exitData.source === "end_of_module") {
    // Update user's progress
    updateUserProgress({
      moduleId: exitData.context.moduleId,
      completed: true,
      completedAt: new Date(),
    });

    // Award points or badges
    awardPoints(getModulePoints(exitData.context.moduleId));
  }
}
```

### 3. Sequential Learning Paths

```javascript
const learningPath = ["994850", "1008545", "1234567"];
let currentIndex = 0;

function handleZogoExit(exitData) {
  if (exitData.source === "end_of_module") {
    currentIndex++;
    if (currentIndex < learningPath.length) {
      // Open next module automatically
      openZogoModule(learningPath[currentIndex]);
    } else {
      // Learning path complete
      showCompletionCertificate();
    }
  }
}
```

### 4. Gamification Integration

```javascript
function handleZogoExit(exitData) {
  if (exitData.source === "end_of_module") {
    // Show completion animation
    showConfetti();

    // Update leaderboard
    updateLeaderboard(userId, moduleId);

    // Check for achievements
    checkAchievements(userId, moduleId);
  }
}
```

## Best Practices

### 1. Always Handle Exit Events

Deep link modules don't have navigation - the exit handler is the only way users return to your app.

### 2. Save State Before Opening

```javascript
function openZogoModule(moduleId) {
  // Save current state
  saveAppState();

  // Track module start
  analytics.track("module_started", { moduleId });

  // Open module
  zogoElement.initialize({
    user_auth_token: token,
    widget_type: "deep_link",
    module_id: moduleId,
  });
}
```

### 3. Provide Context on Return

```javascript
function handleZogoExit(exitData) {
  // Hide Zogo
  zogoContainer.style.display = "none";
  appContent.style.display = "block";

  // Show appropriate message
  if (exitData.source === "end_of_module") {
    showMessage("Great job! You earned 100 points!");
  } else {
    showMessage("Module saved. You can continue later.");
  }
}
```

### 4. Handle Errors Gracefully

```javascript
zogoElement.addEventListener("message", function (event) {
  if (event.detail.type === "INITIALIZATION_ERROR") {
    // Module might not exist or user lacks access
    showError("Unable to load module. Please try again.");
    returnToApp();
  }
});
```

## Common Use Cases

### Educational Apps

- Link specific lessons from your curriculum
- Track completion for grades or certificates
- Enforce sequential learning

### Banking Apps

- Offer financial literacy modules for specific products
- Require module completion before account features
- Provide educational content for regulatory compliance

### Employee Training

- Assign specific modules to employees
- Track completion for compliance
- Link modules to job roles or departments

### Rewards Programs

- Offer points for module completion
- Unlock features after education
- Create learning challenges

## Testing Your Integration

1. **Test with invalid module IDs** to ensure error handling works
2. **Test all exit scenarios** (completion, back button, etc.)
3. **Test offline behavior** - what happens if the network fails?
4. **Test rapid switching** between modules
5. **Test browser back button** behavior

## Security Considerations

- Validate module IDs on your backend before passing to Zogo
- Don't expose all module IDs to users if some require special access
- Track module starts and completions on your backend for integrity
- Consider rate limiting to prevent abuse

## Analytics Integration

Track these events for insights:

```javascript
// Module started
analytics.track("zogo_module_started", {
  moduleId: moduleId,
  moduleName: getModuleName(moduleId),
  timestamp: Date.now(),
});

// Module completed
analytics.track("zogo_module_completed", {
  moduleId: exitData.context.moduleId,
  completionTime: calculateCompletionTime(),
  exitSource: exitData.source,
});

// Module abandoned
analytics.track("zogo_module_abandoned", {
  moduleId: exitData.context.moduleId,
  progress: exitData.context.progress,
  timeSpent: calculateTimeSpent(),
});
```

## Troubleshooting

**Module won't load?**

- Verify the module ID is correct
- Check that the user's token has access to the module
- Look for `INITIALIZATION_ERROR` messages

**Exit handler not firing?**

- Ensure you're listening for the `message` event
- Check that you're filtering for `EXIT_REQUESTED` type
- Verify the event listener is added before initialization

**Users getting stuck?**

- Always provide a manual exit option in your UI
- Consider adding a timeout for module loading
- Monitor for users who don't complete modules
