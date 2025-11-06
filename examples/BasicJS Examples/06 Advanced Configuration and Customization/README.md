# Advanced Configuration and Customization

This example demonstrates how to customize the appearance of Zogo 360 using custom CSS themes, specifically implementing light and dark modes.

## What This Example Shows

- How to apply custom CSS themes
- How to implement light and dark modes using CSS variables
- How to handle CSS customization events
- Additional customization options (shown as comments)

## Requirements

- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **setCustomCSS()**: Apply inline CSS to customize the appearance
- **CSS Variables**: Override Zogo's design tokens for comprehensive theming
- **Event Handling**: Monitor CSS loading status

## CSS Theme Implementation

### Understanding Zogo's CSS Variables

Zogo 360 uses CSS custom properties (variables) for consistent theming. The key variables for creating light/dark modes include:

```css
/* Primary brand colors */
--brand-primary: #1c64f2;
--tints-primary-1: #ebf5ff;
--tints-primary-2: #c3ddfd;
--tints-primary-3: #76a9fa;
--shades-primary-1: #233876;
--shades-primary-2: #1a223a;

/* Semantic colors */
--brand-green: #04cd92;
--tints-green-1: #e9faf5;
--shades-green-1: #148060;

--brand-gold: #faca15;
--tints-gold-1: #fefae8;
--shades-gold-1: #886e0c;

--brand-orange: #ff5a1f;
--tints-orange-1: #fff3ee;
--shades-orange-1: #bf4417;

--utility-red: #ed3731;
--utility-red-tint-1: #fef0ef;
--utility-red-shade-1: #c51711;

/* Neutral colors (grayscale) */
--neutral-white: #ffffff;
--neutral-100: #f6f6f6;
--neutral-200: #ececec;
--neutral-300: #dcdcdc;
--neutral-400: #acacac;
--neutral-500: #8c8c8c;
--neutral-600: #6f6f6f;
--neutral-700: #484848;
--neutral-800: #313131;

/* Warm neutrals */
--neutral-warm-100: #faf9f5;
--neutral-warm-200: #f5f3eb;
--neutral-warm-300: #eeebdd;
```

### Light Mode Implementation

The light mode uses the default color values, ensuring optimal readability with dark text on light backgrounds:

```javascript
const lightTheme = {
  css: `
    :root {
      /* Standard light mode colors */
      --brand-primary: #1c64f2;
      --neutral-white: #ffffff;
      --neutral-800: #313131;
      /* ... other variables ... */
    }
    
    body {
      background-color: var(--neutral-white) !important;
      color: var(--neutral-800) !important;
    }
  `,
  priority: "inline",
};
```

### Dark Mode Implementation

The dark mode inverts the color scale while maintaining brand consistency:

```javascript
const darkTheme = {
  css: `
    :root {
      /* Inverted color scale for dark mode */
      --brand-primary: #76a9fa;  /* Lighter shade for visibility */
      --neutral-white: #1a1a1a;  /* Dark background */
      --neutral-800: #f6f6f6;    /* Light text */
      /* ... other inverted variables ... */
    }
    
    body {
      background-color: var(--neutral-white) !important;
      color: var(--neutral-800) !important;
    }
    
    /* Component-specific adjustments */
    .card {
      background-color: var(--neutral-200) !important;
      border-color: var(--neutral-300) !important;
    }
  `,
  priority: "inline",
};
```

## How to Use

### Basic Implementation

```javascript
// Get reference to Zogo element
const zogoElement = document.getElementById("zogo-element");

// Apply light mode
zogoElement.setCustomCSS(lightThemeCSS, null, "inline");

// Apply dark mode
zogoElement.setCustomCSS(darkThemeCSS, null, "inline");

// Reset to default
zogoElement.setCustomCSS("", null, "inline");
```

### Implementing User Preferences

```javascript
// Save user preference
function saveThemePreference(theme) {
  localStorage.setItem("zogo-theme", theme);
  applyTheme(theme);
}

// Load saved preference on initialization
const savedTheme = localStorage.getItem("zogo-theme") || "default";
applyTheme(savedTheme);
```

### Detecting System Preferences

```javascript
// Check if user prefers dark mode
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  applyTheme("dark");
}

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    applyTheme(e.matches ? "dark" : "light");
  });
```

## Additional Customization Options

The example includes commented-out code demonstrating:

### 1. Sound Customization

- Replace default sounds with custom audio files
- Mute specific sounds by providing empty URLs
- Useful for creating branded audio experiences or accessibility

### 2. External CSS Loading

- Load themes from external CSS files
- Easier theme management and updates
- Allows for dynamic theme switching without code changes

These features are available but commented out to keep the example focused on CSS theming.

## Event Handling

Listen for CSS application events:

```javascript
zogoElement.addEventListener("message", function (event) {
  switch (event.detail.type) {
    case "CUSTOM_CSS_APPLIED":
      console.log("Theme applied successfully");
      break;
    case "CUSTOM_CSS_ERROR":
      console.error("Failed to apply theme:", event.detail.payload.error);
      break;
  }
});
```

## Best Practices

### 1. Color Contrast

- Maintain WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Test themes with contrast checking tools
- Consider users with visual impairments

### 2. Consistency

- Keep UI patterns familiar across themes
- Maintain brand identity while adapting colors
- Test all interactive states (hover, focus, active)

### 3. Performance

- Keep CSS concise and efficient
- Use CSS variables for easy maintenance
- Avoid complex selectors that might impact performance

### 4. Testing

- Test themes on different devices and screen sizes
- Verify all UI components display correctly
- Check for any hard-coded colors that might not adapt

## Common Use Cases

### 1. User Preference

Allow users to choose their preferred theme:

- Light mode for daytime use
- Dark mode for low-light environments
- System preference matching

### 2. Accessibility

Provide theme options for different needs:

- High contrast mode for better visibility
- Reduced eye strain with dark mode
- Consistent experience across your application

### 3. Brand Consistency

Match Zogo 360 to your application's theme:

- Seamless visual integration
- Consistent user experience
- Professional appearance

## Troubleshooting

### Theme Not Applying?

1. Check browser console for errors
2. Verify CSS syntax is correct
3. Ensure `!important` is used where needed
4. Look for `CUSTOM_CSS_ERROR` events

### Colors Look Wrong?

1. Verify all related variables are updated
2. Check for hard-coded colors in Zogo's styles
3. Test in different browsers
4. Ensure color values are valid

### Performance Issues?

1. Keep custom CSS under 10KB
2. Use efficient selectors
3. Avoid excessive `!important` usage
4. Test on minimum supported devices
