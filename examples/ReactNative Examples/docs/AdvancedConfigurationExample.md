# Advanced Configuration and Customization Example

> **Implementation File:** [`/src/screens/AdvancedConfigurationExample.js`](../src/screens/AdvancedConfigurationExample.js)

This example demonstrates how to customize the appearance of Zogo 360 using custom CSS themes, specifically implementing light and dark modes.

## Key Features

- **Custom CSS Themes**: Apply different color schemes to Zogo 360
- **Real-time Theme Switching**: Change themes without reloading
- **CSS Variables**: Override Zogo's design tokens for comprehensive theming
- **Theme Persistence**: Remember user's theme preference

## Implementation Details

### Theme Application

The example uses the `setCustomCSS` method to apply themes:

```javascript
webViewRef.current.setCustomCSS(theme.css, null, theme.priority);
```

### CSS Variables Used

Key CSS variables for theming include:

- **Primary Colors**: `--brand-primary`, `--tints-primary-*`, `--shades-primary-*`
- **Semantic Colors**: `--brand-green`, `--brand-gold`, `--brand-orange`
- **Neutral Colors**: `--neutral-white` through `--neutral-800`
- **Utility Colors**: `--utility-red` and variants

### Theme Definitions

1. **Default Theme**: Uses Zogo's standard styling (empty CSS string)
2. **Light Mode**: Standard color values for optimal readability
3. **Dark Mode**: Inverted color scale while maintaining brand consistency

### Dark Mode Specifics

The dark mode implementation:

- Inverts the neutral color scale
- Adjusts brand colors for visibility on dark backgrounds
- Adds component-specific overrides for cards, buttons, inputs, etc.
- Maintains proper contrast ratios for accessibility

## Additional Customization Options

The SDK also supports (shown in comments):

1. **Sound Customization**

   - Replace default sounds with custom audio files
   - Mute specific sounds by providing empty URLs

2. **External CSS Loading**
   - Load themes from external CSS files
   - Easier theme management and updates

## Usage

1. Wait for Zogo 360 to initialize
2. Select a theme from the available options
3. The theme is applied instantly to all Zogo 360 components
4. Theme selection persists for the session

## Best Practices

- **Color Contrast**: Maintain WCAG AA compliance (4.5:1 for normal text)
- **Consistency**: Keep UI patterns familiar across themes
- **Performance**: Keep CSS concise and use efficient selectors
- **Testing**: Verify all UI components display correctly in each theme

## Event Handling

The example listens for CSS-related events:

- `CUSTOM_CSS_APPLIED`: Confirms successful theme application
- `CUSTOM_CSS_ERROR`: Handles theme application failures
