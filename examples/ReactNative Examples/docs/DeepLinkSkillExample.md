# Deep Link Skill Example

> **Implementation File:** [`/src/screens/DeepLinkSkillExample.js`](../src/screens/DeepLinkSkillExample.js)

This example demonstrates how to use Zogo 360's deep linking feature to open complete skills (collections of modules) rather than individual modules.

## Key Features

- **Skill-based Deep Linking**: Opens complete learning paths instead of individual modules
- **Progress Tracking**: Tracks which skills have been completed
- **Exit Handling**: Manages return flow after skill completion or early exit
- **Visual Feedback**: Shows completed skills with different styling

## Implementation Details

### Skill vs Module Deep Linking

The main difference is using `skill_id` instead of `module_id`:

```javascript
// For skills
webViewRef.current?.sendMessage("INITIALIZE", {
  user_auth_token: "YOUR_TOKEN",
  widget_type: "deep_link",
  skill_id: skillId, // Using skill_id for complete learning paths
});
```

### Skills Used

1. **Skill ID: 1** - "Choose a Financial Institution"

   - Covers how to evaluate banks and credit unions
   - 5 modules, ~25 minutes

2. **Skill ID: 3** - "Apply for Credit"
   - Teaches the credit application process
   - 7 modules, ~35 minutes

### State Management

- `showZogo`: Controls whether to show the app content or Zogo WebView
- `currentSkillId`: Tracks which skill is currently being viewed
- `completedSkills`: Array of completed skill IDs for visual feedback

### Exit Handling

The example handles different exit scenarios:

- **Skill Completion**: Shows congratulations message and marks skill as completed
- **Early Exit**: User can exit without completing the skill
- **Back Button**: Custom back button to return to skill list

## Usage

1. Select a skill from the list
2. The app switches to show the Zogo 360 WebView
3. Complete all modules in the skill or use the back button
4. Upon completion, the skill is marked as completed
5. Completed skills show with a green checkmark and disabled state

## Best Practices

- Show skill metadata (modules count, estimated time)
- Provide clear visual feedback for completed skills
- Handle exit events appropriately
- Consider implementing progress persistence
- Add prerequisite checking for advanced skills
