# User Data Example

> **Implementation File:** [`/src/screens/UserDataExample.js`](../src/screens/UserDataExample.js)

This example demonstrates how to use the `getUserData` function to fetch and display various types of user data from the Zogo API.

## Overview

The `getUserData` function allows you to fetch different types of user data including:

- Module history and current module progress
- Skill history and current skill progress
- Achievement data (current and historical)
- Reward history

## Key Features

### 1. Data Type Selection

The example provides buttons for each available data type:

- **Module History** - Shows all modules the user has completed
- **Current Module** - Displays the user's current module progress
- **Skill History** - Lists all skills the user has worked on
- **Current Skill** - Shows the current skill being practiced
- **Current Achievements** - Displays available and in-progress achievements
- **Achievement History** - Shows completed achievements
- **Reward History** - Lists redeemed rewards

### 2. Visual Data Representation

Each data type is displayed with appropriate visual elements:

- Progress bars for completion status
- Points earned vs. available
- Accuracy percentages
- Completion dates
- Interactive CTAs (Call-to-Action buttons)

### 3. Error Handling

The example includes proper error handling:

- Alerts when authentication token is missing
- Error messages for failed API calls
- Loading states during data fetching

## Implementation Details

### Fetching Data

```javascript
const fetchUserData = async (type) => {
  try {
    const data = await getUserData(type, token);
    setUserData(data);
  } catch (error) {
    Alert.alert("Error", `Failed to fetch ${type} data`);
  }
};
```

### Rendering Module/Skill Data

The example shows progress visualization with:

- Progress bars showing completion percentage
- Points earned out of total available
- Accuracy metrics
- Action buttons for continuing or reviewing

### Rendering Achievement Data

Achievements are displayed with:

- Achievement name and description
- Progress towards completion (e.g., 3/5 logins)
- Points available for completion
- Visual indicators for completed achievements

### Rendering Reward Data

Rewards show:

- Reward name and description
- Type and delivery method
- Point cost
- Redemption date

## Use Cases

### 1. Progress Dashboard

Use module and skill data to create a comprehensive progress dashboard showing:

- Overall learning progress
- Areas that need improvement
- Completed vs. in-progress content

### 2. Gamification Features

Achievement data can power:

- Achievement badges and trophies
- Progress notifications
- Motivational prompts to complete achievements

### 3. Reward Center

Reward history can be used for:

- Displaying earned rewards
- Creating a reward redemption interface
- Showing reward value and history

## Best Practices

1. **Cache Data**: Consider caching frequently accessed data to reduce API calls
2. **Refresh Strategy**: Implement pull-to-refresh or automatic refresh intervals
3. **Empty States**: Always handle cases where no data is available
4. **Loading States**: Show loading indicators during API calls
5. **Error Recovery**: Provide retry options when API calls fail

## Visual Examples

The example includes various CTAs that could trigger actions like:

- "Continue Learning" - Deep link to current module
- "Review Module" - Navigate to completed module review
- "Practice Again" - Restart a skill practice session
- "Share Achievement" - Social sharing functionality
- "View Details" - Show detailed reward information

## Code Example

```javascript
import { getUserData } from "zogo-360-react-native";

// Fetch module history
const moduleHistory = await getUserData("module_history", authToken);

// Display progress for each module
moduleHistory.modules.forEach((module) => {
  console.log(`${module.name}: ${module.progress * 100}% complete`);
  console.log(`Points: ${module.points_earned}/${module.points_available}`);
});

// Fetch current achievements
const achievements = await getUserData("current_achievements", authToken);

// Show achievement progress
achievements.achievements.forEach((achievement) => {
  const percentage = achievement.progress * 100;
  console.log(`${achievement.name}: ${percentage}% complete`);
});
```

## Navigation

From the main examples screen, tap on "User Data Example" to see this implementation in action. Make sure you have set an authentication token in the Token Context before testing the API calls.
