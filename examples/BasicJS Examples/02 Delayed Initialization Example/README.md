# Delayed Initialization Example

This example demonstrates how to manually control when Zogo 360 initializes, rather than having it start automatically when the page loads.

## What This Example Shows

- How to disable auto-initialization
- How to use the `initialize()` function
- How to trigger initialization based on user action

## Requirements

- A valid Zogo 360 authentication token
- A modern web browser (Chrome 54+, Firefox 63+, Safari 10.1+, Edge 79+)

## Features Used

- **Manual initialization**: Setting `auto-init="false"` prevents automatic startup
- **Initialize function**: Using `element.initialize()` to start Zogo 360
- **Configuration object**: Passing authentication token via JavaScript

## How to Use

1. Replace `YOUR_AUTH_TOKEN_HERE` with your actual authentication token
2. Open the HTML file in a web browser
3. Click the "Initialize Zogo 360" button to start

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

## Example Use Cases

**After Login:**

```javascript
// After successful login
fetch("/api/login", { method: "POST", body: credentials })
  .then((response) => response.json())
  .then((data) => {
    const zogoElement = document.getElementById("zogo-container");
    zogoElement.initialize({
      user_auth_token: data.zogoToken,
    });
  });
```

**With User Consent:**

```javascript
if (userAcceptedTerms && userAge >= 18) {
  const zogoElement = document.getElementById("zogo-container");
  zogoElement.initialize({
    user_auth_token: "TOKEN_HERE",
  });
}
```

**Performance-Based Loading:**

```javascript
// Load when user scrolls to the section
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    const zogoElement = document.getElementById("zogo-container");
    zogoElement.initialize({
      user_auth_token: "TOKEN_HERE",
    });
    observer.disconnect();
  }
});
observer.observe(document.getElementById("zogo-section"));
```
