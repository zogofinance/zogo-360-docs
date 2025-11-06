# Advanced Configuration and Customization Example - React

This example demonstrates advanced configuration options and customization capabilities of Zogo 360 in a React application, including theme switching, custom CSS, and configuration tracking.

## What This Example Shows

- How to apply custom CSS themes dynamically in React
- How to use the `setCustomCSS` method
- How to track customization events
- How to organize theme definitions in a modular way
- Best practices for advanced customization

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Dynamic theming**: Switch between light, dark, and default themes
- **Custom CSS injection**: Apply CSS variables and styles at runtime
- **Event tracking**: Monitor customization events and errors
- **Modular theme management**: Separate theme definitions in their own module

## How to Use

1. Clone or download this example
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Replace `YOUR_AUTH_TOKEN_HERE` in `src/App.js` with your actual authentication token
5. Start the development server:
   ```bash
   npm start
   ```
6. Open your browser to `http://localhost:3000`
7. Use the theme buttons to switch between different appearances

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main component with customization controls
│   ├── App.css            # Component styles for the control panel
│   ├── themes.js          # Theme definitions and configurations
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Implementation Details

### Theme Structure

Themes are defined in a separate module for better organization:

```javascript
export const themes = {
  light: {
    css: `/* CSS rules */`,
    priority: "inline",
  },
  dark: {
    css: `/* CSS rules */`,
    priority: "inline",
  },
};
```

### Applying Themes

```javascript
const applyTheme = (themeName) => {
  const theme = themes[themeName];
  if (theme && zogoRef.current) {
    zogoRef.current.setCustomCSS(theme.css, null, theme.priority);
  }
};
```

### CSS Variables

The themes use CSS custom properties for consistent theming:

```css
:root {
  --brand-primary: #1c64f2;
  --neutral-white: #ffffff;
  --neutral-800: #313131;
  /* ... more variables */
}
```

## Customization Options

### 1. CSS Customization

Three ways to apply custom CSS:

```javascript
// Inline CSS (highest priority)
zogoElement.setCustomCSS(cssString, null, "inline");

// External CSS URL
zogoElement.setCustomCSS(null, "https://example.com/theme.css", "url");

// Both (inline takes precedence)
zogoElement.setCustomCSS(cssString, urlString, "inline");
```

### 2. Sound Customization

Replace or mute sounds:

```javascript
// Mute all sounds
zogoElement.setCustomSounds([
  { name: "achievement", url: "" },
  { name: "notification", url: "" },
]);

// Custom sounds
zogoElement.setCustomSounds([
  { name: "achievement", url: "https://example.com/achievement.mp3" },
]);
```

### 3. Dynamic Theming

Examples of dynamic theme switching:

```javascript
// Time-based theming
const hour = new Date().getHours();
const theme = hour >= 18 || hour < 6 ? "dark" : "light";
applyTheme(theme);

// User preference
const userTheme = localStorage.getItem("preferredTheme") || "default";
applyTheme(userTheme);

// System preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(prefersDark ? "dark" : "light");
```

## Theme Development Tips

### 1. Use CSS Variables

Define reusable color schemes:

```css
:root {
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --danger: #dc3545;
}
```

### 2. Target Specific Components

```css
/* Target navigation */
.navbar {
  background-color: var(--primary);
}

/* Target cards */
.card,
.module-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### 3. Handle State Variations

```css
/* Hover states */
.btn:hover {
  transform: translateY(-2px);
}

/* Active states */
.btn:active {
  transform: translateY(0);
}

/* Disabled states */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

## Advanced Use Cases

### Brand Customization

Match your organization's brand:

```javascript
const brandTheme = {
  css: `
    :root {
      --brand-primary: ${brandColors.primary};
      --brand-secondary: ${brandColors.secondary};
    }
    .logo { content: url('${brandAssets.logo}'); }
  `,
  priority: "inline",
};
```

### Accessibility Themes

High contrast or large text themes:

```javascript
const highContrastTheme = {
  css: `
    * { 
      border-color: #000 !important;
      color: #000 !important;
      background: #fff !important;
    }
    button, a { 
      text-decoration: underline !important;
      font-weight: bold !important;
    }
  `,
};
```

### Seasonal Themes

Holiday or seasonal variations:

```javascript
const seasonalThemes = {
  winter: {
    /* snow effects, cool colors */
  },
  spring: {
    /* pastel colors, growth animations */
  },
  summer: {
    /* bright colors, sun motifs */
  },
  fall: {
    /* warm colors, leaf animations */
  },
};
```

## Best Practices

1. **Test across devices**: Ensure themes work on all screen sizes
2. **Maintain readability**: Check contrast ratios for accessibility
3. **Performance**: Minimize CSS size and complexity
4. **Fallbacks**: Provide sensible defaults for unsupported properties
5. **Documentation**: Document your CSS variables and their purposes

## Troubleshooting

### CSS Not Applying

- Check browser console for errors
- Verify CSS syntax is valid
- Ensure Zogo 360 is fully initialized before applying CSS

### Theme Persistence

Save user preferences:

```javascript
// Save
localStorage.setItem("zogoTheme", themeName);

// Load on init
const savedTheme = localStorage.getItem("zogoTheme");
if (savedTheme) applyTheme(savedTheme);
```

## Notes

- Custom CSS is applied to the iframe content
- Some styles may be overridden by inline styles
- Use `!important` sparingly and only when necessary
- Test thoroughly as updates to Zogo 360 may affect custom styles
