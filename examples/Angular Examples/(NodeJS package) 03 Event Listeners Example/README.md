# Event Listeners Example - Angular Implementation

This example demonstrates how to listen for and handle various events from Zogo 360 in an Angular application.

## What This Example Shows

- How to set up event listeners for Zogo 360 events in Angular
- How to use Angular's event binding syntax with custom elements
- How to handle different types of Zogo 360 events
- How to display event information in the Angular component

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Event listeners**: Captures various Zogo 360 events
- **Angular event binding**: Uses Angular's event syntax for custom elements
- **Real-time event logging**: Displays events as they occur
- **TypeScript interfaces**: Defines event types for better type safety

## Events Captured

1. **zogo360:initialized** - Fired when Zogo 360 is successfully initialized
2. **message** - General messages from Zogo 360
3. **openurl** - URL open requests from Zogo 360
4. **playsound** - Sound play requests from Zogo 360

## Project Structure

```
03 Event Listeners Example/
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
6. Interact with Zogo 360 and watch the event log update in real-time

## What Happens

When you run this example:

1. Angular bootstraps the application
2. The AppComponent renders with event listeners attached to the Zogo 360 element
3. As you interact with Zogo 360, events are captured and logged
4. The event log displays in a scrollable area below the Zogo component
5. Each event shows a timestamp, type, and relevant data

## Key Differences from Basic JS Example

- **Angular event binding**: Uses `(eventName)` syntax instead of addEventListener
- **Component methods**: Event handlers are component methods with proper typing
- **Data binding**: Event log is bound to component array and updates automatically
- **TypeScript interfaces**: Events are typed for better development experience

## Code Highlights

```typescript
// Event handler in component
onZogoMessage(event: CustomEvent): void {
  const eventData = {
    timestamp: new Date(),
    type: event.detail.type,
    payload: event.detail.payload
  };
  this.eventLog.push(eventData);
}
```

```html
<!-- Event binding in template -->
<zogo-360
  (message)="onZogoMessage($event)"
  (openurl)="onOpenUrl($event)"
  (playsound)="onPlaySound($event)"
>
</zogo-360>
```

## Notes

- Events are captured using Angular's event binding syntax
- The component maintains an array of events for display
- Custom event types can be defined using TypeScript interfaces
- The event log has a maximum size to prevent memory issues
- URL open requests are logged but not automatically opened (for security)
