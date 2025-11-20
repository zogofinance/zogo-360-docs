# Zogo 360 Integration Documentation

Welcome to the Zogo 360 Integration documentation. This repository contains comprehensive guides, examples, and resources for integrating Zogo 360 into your applications across multiple platforms.

## Getting Started

### Step 0: Obtain Your Authentication Token

**Important:** For security reasons, authentication tokens must be generated on your backend server, not in client-side code.

To obtain a token, make a POST request to the Zogo API from your backend:

**Endpoint:** `POST https://api.zogo.com/sdk/user`

**Headers:**

- Authorization: Basic authentication using the username and password provided by Zogo

**Request Body:**

```json
{
  "auth": {
    "type": "token"
  },
  "user_info": {
    "external_id": "unique_user_id_123",
    "display_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "dob": "01/15/1990",
    "email": "john.doe@example.com",
    "locale": "en-US",
    "is_test_user": false
  }
}
```

**Required Fields:**

- `auth.type`: Must be set to `"token"`
- `user_info.external_id`: Your system's unique identifier for the user
- `user_info.display_name`: The user's display name

**Optional Fields:**

- `first_name`, `last_name`: User's name components
- `dob`: Date of birth (MM/DD/YYYY format)
- `email`: User's email address
- `locale`: Language preference (defaults to "en-US" if not specified)
- `is_test_user`: Set to `true` for testing mode, `false` for production

The API will return a token that you can then pass to your frontend application.

## Platform Integration Guides

Choose your platform to get started with integration:

### 📱 Mobile Platforms

- [**React Native Integration Guide**](examples/README_RN.md) - Complete guide for integrating Zogo 360 into React Native applications

### 🌐 Web Platforms

- [**JavaScript/HTML Integration Guide**](examples/README_JS.md) - Integration guide for vanilla JavaScript, HTML, and web applications
- [**React Examples**](examples/React%20Examples/) - Sample implementations for React applications
- [**Angular Examples**](examples/Angular%20Examples/) - Sample implementations for Angular applications

## Configuration & Advanced Topics

### 🔧 Portal Configuration

- [**Portal Configuration Guide**](Additional%20Resources/Portal%20Configuration.md) - Detailed guide on configuring the Zogo 360 portal settings, customization options, and administrative features

### 📡 Event Handling

- [**Zogo 360 Events Reference**](Additional%20Resources/Zogo%20360%20Events.md) - Comprehensive list of all events emitted by Zogo 360, including event payloads and handling examples

## Example Projects

Explore our example implementations to see Zogo 360 integration in action:

### Basic JavaScript Examples

Located in `examples/BasicJS Examples/`:

1. **Basic Web Example** - Simple integration with minimal setup
2. **Delayed Initialization Example** - Control when Zogo 360 loads
3. **Event Listeners Example** - Handle Zogo 360 events
4. **Deep Link Module Example** - Link directly to specific modules
5. **Deep Link Skill Example** - Link directly to specific skills
6. **Advanced Configuration and Customization** - Custom CSS and sounds

### React Examples

Located in `examples/React Examples/`:

1. **Basic Web Example** - React component integration
2. **Delayed Initialization Example** - Conditional loading in React
3. **Event Listeners Example** - React hooks for event handling
4. **Deep Link Module Example** - React Router integration
5. **Deep Link Skill Example** - Dynamic skill navigation
6. **Advanced Configuration and Customization** - Theming and customization

### Angular Examples

Located in `examples/Angular Examples/`:

1. **Basic Web Example** - Angular component integration
2. **Delayed Initialization Example** - Lazy loading with Angular
3. **Event Listeners Example** - RxJS event streams
4. **Deep Link Module Example** - Angular routing integration
5. **Deep Link Skill Example** - Dynamic navigation
6. **Advanced Configuration and Customization** - Angular services for customization

### React Native Examples

Located in `examples/ReactNative Examples/`:

- Complete mobile app with navigation
- Token management with Context API
- All integration examples in a mobile format
- See the [React Native README](examples/README_RN.md) for detailed documentation

## Quick Links

- **CDN URL**: `https://sdk-cdn.zogo.com/zogo-360-integration-latest.min.js`
- **API Endpoint**: `https://api.zogo.com/sdk/user`
- **Support**: Contact your Zogo representative
- **JavaScript Guide**: [Full JavaScript Integration Documentation](examples/README_JS.md)
- **React Native Guide**: [Full React Native Integration Documentation](examples/README_RN.md)
- **Portal Configuration**: [Administrative Settings Guide](Additional%20Resources/Portal%20Configuration.md)
- **Events Reference**: [Complete Events Documentation](Additional%20Resources/Zogo%20360%20Events.md)

## Requirements

- **Web**: Modern browsers with JavaScript enabled
- **React Native**: React Native 0.60+ with react-native-webview
- **Authentication**: Backend server for secure token generation

## Security Best Practices

1. **Never expose API credentials in client-side code**
2. **Generate tokens on your backend server only**
3. **Validate message origins when handling events**
4. **Use HTTPS for all communications**
5. **Implement proper token refresh mechanisms**

---

© 2025 Zogo. All rights reserved.
