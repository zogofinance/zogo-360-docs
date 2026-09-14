# Advanced Configuration and Customization - Angular Implementation

This example demonstrates advanced configuration options and customization capabilities of Zogo 360 in an Angular application, including theme switching, custom CSS, and dynamic configuration.

## What This Example Shows

- How to implement theme switching (light/dark mode) in Angular
- How to apply custom CSS dynamically using Angular methods
- How to use Angular services for configuration management
- How to handle CSS customization events
- How to create a configuration UI with Angular components

## Requirements

- Node.js and npm installed
- Angular CLI (install with `npm install -g @angular/cli`)
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Theme Management**: Switch between predefined light and dark themes
- **Custom CSS**: Apply custom styles dynamically to Zogo 360
- **Configuration Service**: Angular service to manage themes and settings
- **Event Handling**: Listen for CSS application success/error events
- **Reactive Forms**: Configuration controls using Angular forms

## Advanced Features (Commented in Code)

- **Custom Sounds**: Replace or mute Zogo 360 sound effects
- **External CSS**: Load themes from external URLs
- **Configuration Persistence**: Save user preferences

## Project Structure

```
06 Advanced Configuration and Customization/
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
│       ├── app.component.css
│       └── services/
│           └── theme.service.ts
```

## How to Use

1. Navigate to this directory in your terminal
2. Install dependencies:
   ```bash
   npm install
   ```
3. Replace the token in `app.component.ts` with your actual authentication token (or use the provided test token)
4. Run the development server:
   ```bash
   ng serve
   ```
5. Open your browser to `http://localhost:4200`
6. Use the theme controls to switch between light and dark modes

## What Happens

When you run this example:

1. The application loads with Zogo 360 using the default theme
2. Theme selection buttons are displayed above Zogo 360
3. When you click a theme button:
   - The theme service updates the current theme
   - Custom CSS is applied to Zogo 360
   - The UI confirms successful theme application
4. CSS application events are logged to the console

## Key Differences from Basic JS Example

- **Angular Service Architecture**: Theme management in a dedicated service
- **Component-based Controls**: Theme controls as Angular components
- **RxJS Observables**: Reactive theme state management
- **TypeScript Interfaces**: Strongly typed theme configurations
- **Dependency Injection**: Clean separation of concerns

## Code Highlights

```typescript
// Theme service for managing configurations
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<Theme>('default');

  applyTheme(theme: Theme): void {
    this.currentTheme$.next(theme);
  }
}

// Component method to apply theme
applyTheme(themeName: string): void {
  const theme = this.themeService.getTheme(themeName);
  if (theme && this.zogoElement) {
    this.zogoElement.nativeElement.setCustomCSS(
      theme.css,
      null,
      theme.priority
    );
  }
}
```

## Theme Structure

Each theme contains:

- **css**: The CSS string to apply
- **priority**: How the CSS should be applied ('inline' or 'url')
- **name**: Display name for the theme

## CSS Variables

The themes use CSS custom properties (variables) for easy customization:

- Brand colors (primary, green, gold, orange)
- Neutral colors (grays and whites)
- Utility colors (red for errors)
- Tints and shades for each color

## Advanced Customization Options

### Custom Sounds (Commented Example)

```typescript
// Mute all sounds
setCustomSounds([
  { name: "achievement", url: "" },
  { name: "notification", url: "" },
]);
```

### External CSS (Commented Example)

```typescript
// Load CSS from URL
setCustomCSS(null, "https://example.com/theme.css", "url");
```

## Notes

- The example includes a test authentication token for demonstration
- Theme changes are applied immediately without reinitializing Zogo 360
- Custom CSS has priority over default styles
- Consider implementing theme persistence using localStorage
- The theme service could be extended to support user-created themes
