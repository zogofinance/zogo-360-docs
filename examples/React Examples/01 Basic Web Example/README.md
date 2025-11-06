# Basic Web Example - React

This example demonstrates the absolute minimum implementation of Zogo 360 in a React application.

## What This Example Shows

- How to include the Zogo 360 package via CDN in a React app
- How to use the `<zogo-360>` custom element in a React component
- Auto-initialization with default settings in a React environment

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Auto-initialization**: The component automatically initializes when the React component mounts
- **Default dimensions**: Uses 100% width and 600px height
- **CDN delivery**: Loads the package from Zogo's CDN via the HTML template

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

## What Happens

When you run this example:

1. React loads and renders the App component
2. The browser loads the Zogo 360 package from the CDN (included in `public/index.html`)
3. The package registers the `<zogo-360>` custom element
4. React renders the custom element with the provided attributes
5. The element automatically initializes using the provided token
6. An iframe is created and displays the Zogo 360 interface

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main React component with Zogo 360 element
│   ├── App.css            # Component styles
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Code

The implementation is straightforward in React:

```jsx
function App() {
  return (
    <div className="App">
      <zogo-360 token="YOUR_AUTH_TOKEN_HERE" width="100%" height="600px" />
    </div>
  );
}
```

## Notes

- Custom elements like `<zogo-360>` work seamlessly in React
- The Zogo 360 script must be loaded before React attempts to render the component
- Make sure to include the script tag in your HTML template, not as a React import
