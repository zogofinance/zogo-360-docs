# Basic Web Example - Angular Implementation

This example demonstrates the absolute minimum implementation of Zogo 360 in an Angular application.

## What This Example Shows

- How to include the Zogo 360 package in an Angular project
- How to create a simple Angular component that uses the `<zogo-360>` element
- Auto-initialization with default settings in Angular

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Auto-initialization**: The component automatically initializes when the page loads
- **Default dimensions**: Uses 100% width and 600px height
- **Angular component architecture**: Demonstrates proper Angular integration

## Project Structure

```
01 Basic Web Example/
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
6. Zogo 360 will automatically load and display

## What Happens

When you run this example:

1. Angular bootstraps the application
2. The AppComponent loads with the Zogo 360 script included
3. The `<zogo-360>` custom element is rendered in the template
4. The element automatically initializes using the provided token
5. An iframe is created and displays the Zogo 360 interface

## Key Differences from Basic JS Example

- **Component-based architecture**: The Zogo 360 element is encapsulated in an Angular component
- **TypeScript support**: Full type safety (though Zogo 360 types are declared as `any` for simplicity)
- **Angular lifecycle**: The component follows Angular's lifecycle hooks
- **Build process**: Uses Angular CLI's build system instead of serving raw HTML

## Notes

- The Zogo 360 script is loaded in `index.html` to ensure it's available globally
- The custom element is used directly in the Angular template
- No special Angular wrapper is needed - the web component works natively
