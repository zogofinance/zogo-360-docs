# Delayed Initialization Example - React

This example demonstrates how to manually control when Zogo 360 initializes in a React application, rather than having it start automatically when the component mounts.

## What This Example Shows

- How to disable auto-initialization in React
- How to use React refs to access the Zogo 360 element
- How to use the `initialize()` function from a React event handler
- How to trigger initialization based on user action

## Requirements

- Node.js and npm installed
- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Manual initialization**: Setting `auto-init="false"` prevents automatic startup
- **React refs**: Using `useRef` to get a reference to the custom element
- **Initialize function**: Using `element.initialize()` to start Zogo 360
- **Configuration object**: Passing authentication token via JavaScript

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
7. Click the "Initialize Zogo 360" button to start

## Why Use Delayed Initialization?

There are several scenarios where you might want to control when Zogo 360 starts:

### 1. User Consent Required

You may need to get user consent before loading third-party content:

- Privacy regulations compliance (GDPR, CCPA)
- Terms of service acceptance
- Age verification

### 2. Performance Optimization

Delay loading until actually needed:

- Improve initial page load time
- Reduce bandwidth for users who might not use the feature
- Progressive enhancement approach

### 3. Authentication Flow

Wait for authentication to complete:

- User needs to log in first
- Token needs to be fetched from your backend
- Multi-step verification process

### 4. Conditional Access

Load based on user privileges or subscription:

- Premium features for paid users
- Different experiences for different user roles
- Feature flags or A/B testing

### 5. User-Triggered Experience

Let users decide when to start:

- "Click to start" interactions
- Modal or popup implementations
- Tab-based interfaces where Zogo is not the default view

## Project Structure

```
├── public/
│   └── index.html          # HTML template with Zogo 360 script
├── src/
│   ├── App.js             # Main React component with delayed initialization
│   ├── App.css            # Component styles including button styling
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## Key Code

The implementation uses React hooks and refs:

```jsx
function App() {
  const zogoRef = useRef(null);

  const initializeZogo = () => {
    if (zogoRef.current) {
      zogoRef.current.initialize({
        user_auth_token: "YOUR_AUTH_TOKEN_HERE",
      });
    }
  };

  return (
    <div className="App">
      <button onClick={initializeZogo} className="init-button">
        Initialize Zogo 360
      </button>

      <zogo-360
        ref={zogoRef}
        id="zogo-container"
        width="100%"
        height="600px"
        auto-init="false"
      />
    </div>
  );
}
```

## Example Use Cases in React

**After Login:**

```jsx
const [token, setToken] = useState(null);
const zogoRef = useRef(null);

useEffect(() => {
  // After successful login
  fetch("/api/login", { method: "POST", body: credentials })
    .then((response) => response.json())
    .then((data) => {
      setToken(data.zogoToken);
      if (zogoRef.current) {
        zogoRef.current.initialize({
          user_auth_token: data.zogoToken,
        });
      }
    });
}, [credentials]);
```

**With User Consent:**

```jsx
const [hasConsent, setHasConsent] = useState(false);

const handleConsent = () => {
  setHasConsent(true);
  if (zogoRef.current) {
    zogoRef.current.initialize({
      user_auth_token: "TOKEN_HERE",
    });
  }
};
```

**Performance-Based Loading:**

```jsx
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && zogoRef.current) {
      zogoRef.current.initialize({
        user_auth_token: "TOKEN_HERE",
      });
      observer.disconnect();
    }
  });

  if (zogoRef.current) {
    observer.observe(zogoRef.current);
  }

  return () => observer.disconnect();
}, []);
```

## Notes

- The `useRef` hook is essential for accessing DOM properties of custom elements in React
- Make sure the Zogo 360 script is loaded before attempting to initialize
- The `auto-init="false"` attribute is crucial to prevent automatic initialization
