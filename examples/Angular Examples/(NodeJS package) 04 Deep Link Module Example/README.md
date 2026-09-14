# Deep Link Module Example - Angular Implementation

This example demonstrates how to integrate Zogo 360 with deep linking to specific modules in an Angular application, allowing users to jump directly to specific educational content.

## What This Example Shows

- How to implement deep linking to specific Zogo 360 modules
- How to manage navigation between your Angular app and Zogo 360
- How to handle exit events when users complete or leave modules
- How to track module completion and update UI accordingly

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Deep linking**: Direct navigation to specific modules using module IDs
- **Dynamic initialization**: Initialize Zogo with different configurations
- **Exit handling**: Proper handling of module completion and early exits
- **State management**: Track which modules have been completed
- **Angular routing**: Integration with Angular's navigation system

## Module IDs Used

- **994850**: The Product Life Cycle
- **1008545**: Investing vs. Savings Goals

## Project Structure

```
04 Deep Link Module Example/
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
6. Click on any module button to launch Zogo 360 with that specific module

## What Happens

When you run this example:

1. The main application displays a list of available modules
2. When a user clicks a module button:
   - The app content is hidden
   - Zogo 360 is initialized with deep link configuration
   - The specific module is loaded automatically
3. When the user exits Zogo 360:
   - The exit event is captured with exit reason
   - The app content is shown again
   - If the module was completed, the UI updates to show completion

## Key Differences from Basic JS Example

- **Component-based architecture**: Module selection and Zogo display are managed by Angular components
- **TypeScript interfaces**: Module data is strongly typed
- **Angular animations**: Smooth transitions between app and Zogo views
- **Service architecture**: Module data could be managed by Angular services

## Code Highlights

```typescript
// Initialize with deep link to specific module
openZogoModule(moduleId: string): void {
  this.showZogo = true;

  const zogoElement = this.zogoContainer.nativeElement;
  zogoElement.initialize({
    user_auth_token: this.authToken,
    widget_type: 'deep_link',
    module_id: moduleId
  });
}

// Handle module completion
handleZogoExit(exitData: any): void {
  if (exitData.source === 'end_of_module') {
    this.markModuleComplete(this.currentModuleId);
  }
}
```

## Exit Sources

The example handles different exit scenarios:

- **end_of_module**: User completed the entire module
- **back_button**: User clicked back without completing
- **exit_button**: User clicked exit button
- **error**: An error occurred

## Notes

- Module IDs are specific to your Zogo 360 implementation
- The example tracks completion status in component state (could use a service for persistence)
- Deep linking requires the `widget_type: 'deep_link'` configuration
- Only one module can be active at a time
