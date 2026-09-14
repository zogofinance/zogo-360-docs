# Delayed Initialization Example - Angular Implementation

This example demonstrates how to manually control when Zogo 360 initializes in an Angular application, rather than using auto-initialization.

## What This Example Shows

- How to disable auto-initialization of the Zogo 360 component
- How to programmatically initialize Zogo 360 using Angular methods
- How to use ViewChild to access the Zogo 360 element
- How to handle user-triggered initialization

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Manual initialization**: The component waits for user action before initializing
- **ViewChild decorator**: Angular's way to access DOM elements
- **Component state management**: Tracks initialization status
- **TypeScript integration**: Proper typing for the Zogo element

## Project Structure

```
02 Delayed Initialization Example/
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
6. Click the "Initialize Zogo 360" button to start the component

## What Happens

When you run this example:

1. Angular bootstraps the application
2. The AppComponent renders with the Zogo 360 element set to `auto-init="false"`
3. The component remains uninitialized until the user clicks the button
4. When clicked, the `initializeZogo()` method is called
5. The method uses ViewChild to access the native element and calls its `initialize()` method
6. Zogo 360 initializes with the provided configuration
7. The button becomes disabled to prevent re-initialization

## Key Differences from Basic JS Example

- **ViewChild decorator**: Uses Angular's ViewChild to access the DOM element
- **Component methods**: Initialization logic is encapsulated in component methods
- **State management**: Uses component properties to track initialization state
- **Type safety**: Includes TypeScript declarations for better development experience

## Code Highlights

```typescript
// Access the Zogo element using ViewChild
@ViewChild('zogoContainer', { static: false }) zogoContainer!: ElementRef;

// Initialize programmatically
initializeZogo(): void {
  const zogoElement = this.zogoContainer.nativeElement;
  zogoElement.initialize({
    user_auth_token: this.authToken
  });
  this.isInitialized = true;
}
```

## Notes

- The `auto-init="false"` attribute prevents automatic initialization
- ViewChild with `static: false` ensures the element is available after view initialization
- The component tracks initialization state to provide user feedback
- Error handling can be added to the initialization method for production use
