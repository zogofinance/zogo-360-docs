# Deep Link Skill Example - Angular Implementation

This example demonstrates how to integrate Zogo 360 with deep linking to specific skills in an Angular application. Skills are collections of related modules that form a learning path.

## What This Example Shows

- How to implement deep linking to specific Zogo 360 skills
- How to create a skill selection interface in Angular
- How to track skill completion and progress
- How to handle different exit scenarios for skills
- How to provide visual feedback for completed skills

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep linking to skills**: Direct navigation using skill IDs
- **Progress tracking**: Visual indicators for completed skills
- **Exit handling**: Different handling for completion vs early exit
- **Angular Material-like design**: Card-based UI with hover effects
- **Completion animations**: Visual feedback when skills are completed

## Skill IDs Used

- **1**: Choose a Financial Institution
- **3**: Apply for Credit

## Project Structure

```
05 Deep Link Skill Example/
├── README.md
├── package.json
├── angular.json
├── tsconfig.json
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   └── app/
│       ├── app.module.ts
│       ├── app.component.ts
│       ├── app.component.html
│       └── app.component.css
```

## How to Use

1. Navigate to this directory in your terminal
2. Install dependencies:
   ```bash
   npm install
   ```
3. Replace `YOUR_AUTH_TOKEN_HERE` in `app.component.ts` with your actual authentication token
4. Run the development server:
   ```bash
   ng serve
   ```
5. Open your browser to `http://localhost:4200`
6. Click on any skill card to start that skill path

## What Happens

When you run this example:

1. The main application displays skill cards in a grid layout
2. Each card shows:
   - Skill title and description
   - Completion status
   - Action button
3. When a user clicks "Start Skill":
   - The app content is hidden
   - Zogo 360 is initialized with skill deep link
   - The skill modules are loaded in sequence
4. When the user completes or exits:
   - Exit event is captured with reason
   - UI updates based on completion status
   - Completion message is shown if applicable

## Key Differences from Module Example

- **Skills vs Modules**: Skills contain multiple modules in a learning path
- **Extended completion time**: Skills take longer as they include multiple modules
- **Progress persistence**: More important to track partial progress
- **Different UI design**: Card-based layout optimized for skill selection

## Code Highlights

```typescript
// Skill interface with metadata
interface Skill {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  moduleCount: number;
  completed: boolean;
}

// Initialize with skill deep link
openZogoSkill(skillId: string): void {
  zogoElement.initialize({
    user_auth_token: this.authToken,
    widget_type: 'deep_link',
    skill_id: skillId  // Note: skill_id instead of module_id
  });
}
```

## Exit Handling

The example handles various exit scenarios:

- **end_of_module**: User completed the entire skill (all modules)
- **back_button**: User navigated back without completing
- **exit_button**: User explicitly exited
- **error**: An error occurred during skill execution

## Skill Completion

When a skill is completed:

1. The skill is marked as complete in the UI
2. The button changes to show completion status
3. A congratulations message is displayed
4. The skill card shows a completion badge

## Notes

- Skill IDs are specific to your Zogo 360 implementation
- Skills may contain multiple modules that users complete in sequence
- Progress within a skill is typically tracked by Zogo 360
- Consider implementing persistence (localStorage/backend) for completion status
- The example includes estimated time and module count for better UX
