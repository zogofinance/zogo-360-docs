# Zogo 360 Integration Documentation

## Introduction

The Zogo 360 Integration package provides a simple way to embed Zogo 360 functionality into any website using a custom HTML element. This package handles all the complexity of integration, allowing you to add Zogo 360 to your site with just two lines of code.

## What is Zogo 360 Integration?

The Zogo 360 Integration is a JavaScript package that:

- Provides a custom HTML element `<zogo-360>` that can be placed anywhere on your page
- Automatically handles authentication using your provided token
- Manages all communication between your website and Zogo 360 Integration

## Basic Frontend Implementation

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

### Step 1: Include the Package

Add this script tag to your HTML page:

```html
<script src="https://sdk-cdn.zogo.com/zogo-360-integration-latest.min.js"></script>
```

### Step 2: Add the Zogo 360 Element

Place the `<zogo-360>` element where you want Zogo 360 to appear:

```html
<zogo-360 token="YOUR_AUTH_TOKEN_HERE" width="100%" height="600px"> </zogo-360>
```

That's all you need. The package will automatically initialize and display Zogo 360 when the page loads.

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://sdk-cdn.zogo.com/zogo-360-integration-latest.min.js"></script>
  </head>
  <body>
    <zogo-360 token="YOUR_AUTH_TOKEN_HERE" width="100%" height="600px">
    </zogo-360>
  </body>
</html>
```

## Element Attributes

The `<zogo-360>` element accepts these attributes:

- **token** (required for auto-initialization) - Your authentication token. This attribute is only required when using automatic initialization. When using delayed initialization with `auto-init="false"`, the token is passed via the `initialize()` method instead.
- **width** - Width of the component (e.g., "100%", "800px")
- **height** - Height of the component (e.g., "600px", "100vh")
- **auto-init** - Controls automatic initialization (defaults to "true"). Set to "false" for delayed/manual initialization.

### Delayed Initialization (Recommended)

Delayed initialization is the recommended approach as it allows you to:

- Control exactly when Zogo 360 loads, improving initial page load performance
- Implement custom loading states and transitions
- Initialize Zogo 360 only when needed (e.g., after user authentication or interaction)
- Provide a better user experience with your own loading indicators

When using delayed initialization, you don't need to include the token attribute on the element. Instead:

1. Add `auto-init="false"` to the `<zogo-360>` element
2. Call the `initialize()` method programmatically with the token when ready:

```javascript
const zogoElement = document.getElementById("zogo-container");
zogoElement.initialize({
  user_auth_token: "YOUR_AUTH_TOKEN_HERE",
});
```

Example:

```html
<zogo-360
  id="zogo-container"
  width="100%"
  height="600px"
  auto-init="false"
></zogo-360>
```

For more detailed examples of delayed initialization, see the framework-specific examples in the `examples` directory.

## Event Handling and Communication

The Zogo 360 Integration communicates with your application through message events. You can listen for these events to track user actions, handle navigation, and customize the experience.

### Setting Up Event Listeners

Add an event listener to handle messages from Zogo 360:

```javascript
window.addEventListener("message", (event) => {
  // Verify the origin for security (adjust domain as needed)
  if (!event.origin.includes("zogo.com")) {
    return;
  }

  const { type, payload } = event.data;

  switch (type) {
    case "CONTAINER_READY":
      console.log("Zogo 360 is ready for initialization");
      break;
    case "INITIALIZATION_COMPLETE":
      console.log("Initialization successful", payload);
      break;
    case "EXIT_REQUESTED":
      console.log("User wants to exit", payload);
      // Handle exit - especially useful when deep linking to specific modules/skills
      // Close modal, hide overlay, return to your app's main interface, etc.
      break;
    case "NAVIGATION_COMPLETE":
      console.log("User navigated to:", payload.page);
      break;
    // Add more cases as needed
  }
});
```

### Common Event Types

#### Initialization Events

- **CONTAINER_READY** - Zogo 360 has loaded and is ready for initialization
- **INITIALIZATION_COMPLETE** - Initialization was successful
- **INITIALIZATION_ERROR** - Initialization failed

#### User Action Events

- **EXIT_REQUESTED** - User wants to exit the current flow (particularly useful when deep linking to specific skills or modules from CTAs in your app)
  - `payload.source`: 'back_button', 'exit_button', or 'end_of_module'
  - This event allows you to gracefully return users to your app after they complete or exit a deep-linked module/skill
- **NAVIGATION_COMPLETE** - User navigated to a new page
  - `payload.page`: The page navigated to
  - `payload.path`: The actual path

#### Status Events

- **AUTH_TOKEN_PROCESSED** - Authentication token validation complete
- **APP_STATUS** - General status updates
- **OPEN_URL** - Request to open an external URL

### Sending Messages to Zogo 360

You can also send messages to control Zogo 360:

```javascript
const zogoElement = document.querySelector("zogo-360");
const iframe = zogoElement.shadowRoot.querySelector("iframe");

// Navigate to a specific page
iframe.contentWindow.postMessage(
  {
    type: "NAVIGATE_TO",
    payload: {
      page: "LEARN", // Available pages: HOME, LEARN, CATEGORIES, MY_SKILLS, etc.
      params: {
        moduleId: 123, // Optional parameters
      },
    },
  },
  "*"
);

// Request current navigation state
iframe.contentWindow.postMessage(
  {
    type: "REQUEST_NAVIGATION_STATE",
  },
  "*"
);
```

### Example: Complete Event Handling Implementation

```javascript
class Zogo360Handler {
  constructor() {
    this.zogoElement = document.getElementById("zogo-container");
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("message", (event) => {
      if (!event.origin.includes("zogo.com")) return;

      const { type, payload } = event.data;

      switch (type) {
        case "CONTAINER_READY":
          this.handleReady();
          break;
        case "INITIALIZATION_COMPLETE":
          this.handleInitComplete(payload);
          break;
        case "EXIT_REQUESTED":
          this.handleExit(payload);
          break;
        case "NAVIGATION_COMPLETE":
          this.handleNavigation(payload);
          break;
        case "AUTH_TOKEN_PROCESSED":
          this.handleAuth(payload);
          break;
      }
    });
  }

  handleReady() {
    console.log("Zogo 360 ready - initializing...");
    // If using delayed initialization, call initialize() here
    this.zogoElement.initialize({
      user_auth_token: "YOUR_TOKEN_HERE",
    });
  }

  handleInitComplete(payload) {
    if (payload.success) {
      console.log("Zogo 360 initialized successfully");
      // Show the Zogo interface, hide loading spinner, etc.
    }
  }

  handleExit(payload) {
    console.log(`Exit requested from: ${payload.source}`);

    // This is especially important when deep linking to specific modules/skills
    // from CTAs (Call-to-Actions) within your application

    if (payload.source === "end_of_module") {
      // User completed the module - show success message
      alert("Module completed!");
      // Track completion in your analytics
    }

    // Return user to your app's interface
    // Examples: close modal, hide overlay, navigate to dashboard
    this.zogoElement.style.display = "none";

    // If you opened Zogo in a modal after a CTA click:
    // this.closeModal();
    // this.returnToDashboard();
  }

  handleNavigation(payload) {
    console.log(`User navigated to: ${payload.page}`);
    // Update your UI, analytics, etc.
  }

  handleAuth(payload) {
    if (!payload.success) {
      console.error("Authentication failed:", payload.error);
      // Handle auth failure
    }
  }
}

// Initialize the handler
const zogo360Handler = new Zogo360Handler();
```

### Security Best Practices

1. **Always verify the message origin** - Check that messages come from the expected Zogo domain
2. **Validate message structure** - Ensure the message has the expected type and payload
3. **Use specific origins** - When posting messages, use the specific Zogo origin instead of "\*"
4. **Sanitize data** - Validate and sanitize any data before using it in your application

For more detailed event documentation and advanced use cases, see the examples in the `examples` directory, particularly the Event Listeners examples for each framework.

## Advanced Customizations

Zogo 360 supports extensive customization options to match your brand and enhance the user experience. You can customize both the visual appearance with CSS and the audio feedback with custom sounds.

### Custom CSS

You can apply custom CSS to style the Zogo 360 interface to match your brand. There are two ways to apply custom CSS:

#### Method 1: During Initialization

Include custom CSS in the initialization configuration:

```javascript
zogoElement.initialize({
  user_auth_token: "YOUR_TOKEN_HERE",
  customCSS: {
    css: `
      /* Inline CSS */
      body {
        font-family: 'Your-Brand-Font', sans-serif;
      }
      .primary-button {
        background-color: #your-brand-color;
      }
    `,
    url: "https://your-cdn.com/custom-zogo-styles.css", // Remote CSS file
    priority: "inline", // "inline" or "remote" - which takes precedence
  },
});
```

#### Method 2: Via Message After Initialization

Send a CUSTOM_CSS message to apply styles dynamically:

```javascript
const iframe = zogoElement.shadowRoot.querySelector("iframe");
iframe.contentWindow.postMessage(
  {
    type: "CUSTOM_CSS",
    payload: {
      css: "/* Your custom CSS */",
      url: "https://your-cdn.com/styles.css",
    },
  },
  "*"
);
```

#### CSS Customization Events

Listen for these events to track CSS application:

- **CUSTOM_CSS_APPLIED** - CSS was successfully applied
- **CUSTOM_CSS_ERROR** - CSS failed to load (check payload.error)

### Custom Sounds

Replace default sound effects with your own audio files to create a unique experience:

#### Method 1: During Initialization

```javascript
zogoElement.initialize({
  user_auth_token: "YOUR_TOKEN_HERE",
  customSounds: {
    sounds: [
      {
        name: "correct-sound",
        media_url: "https://your-cdn.com/sounds/success.mp3",
      },
      {
        name: "incorrect-sound",
        media_url: "https://your-cdn.com/sounds/error.mp3",
      },
      {
        name: "quiz-interstitial",
        media_url: "https://your-cdn.com/sounds/transition.mp3",
      },
    ],
    muteDefault: false, // Set to true to mute default sounds not replaced
  },
});
```

#### Method 2: Via Message After Initialization

```javascript
const iframe = zogoElement.shadowRoot.querySelector("iframe");
iframe.contentWindow.postMessage(
  {
    type: "CUSTOM_SOUNDS",
    payload: {
      sounds: [
        {
          name: "correct-sound",
          media_url: "https://your-cdn.com/sounds/ding.mp3",
        },
      ],
    },
  },
  "*"
);
```

#### Available Sound Names

Sounds available for customization:

- `correct-sound` - Played when user answers correctly
- `incorrect-sound` - Played when user answers incorrectly
- `quiz-interstitial` - Played during quiz transitions
- `reward-redemption` - Played when redeeming rewards
- `test-results` - Played when showing test results
- `trivia-start` - Played when starting trivia
- `coin-count` - Played during coin counting animations
- `objective-claim` - Played when claiming objectives

#### Sound Customization Events

- **CUSTOM_SOUNDS_LOADED** - Sounds were successfully loaded
- **CUSTOM_SOUNDS_ERROR** - Sounds failed to load (check payload.error)

### Complete Customization Example

```javascript
class CustomizedZogo360 {
  constructor() {
    this.zogoElement = document.getElementById("zogo-container");
    this.setupEventListeners();
  }

  initialize() {
    this.zogoElement.initialize({
      user_auth_token: "YOUR_TOKEN_HERE",

      // Custom styling
      customCSS: {
        css: `
          /* Override primary colors */
          :root {
            --primary-color: #2c5aa0;
            --secondary-color: #f39c12;
          }
          
          /* Custom fonts */
          body {
            font-family: 'Roboto', sans-serif;
          }
          
          /* Style buttons */
          .btn-primary {
            background-color: var(--primary-color);
            border-radius: 25px;
            transition: all 0.3s ease;
          }
          
          .btn-primary:hover {
            transform: scale(1.05);
          }
        `,
        priority: "inline",
      },

      // Custom sounds
      customSounds: {
        sounds: [
          {
            name: "correct-sound",
            media_url: "https://cdn.example.com/sounds/success-chime.mp3",
          },
          {
            name: "incorrect-sound",
            media_url: "https://cdn.example.com/sounds/gentle-error.mp3",
          },
          {
            name: "trivia-start",
            media_url: "https://cdn.example.com/sounds/game-start.mp3",
          },
          {
            name: "coin-count",
            media_url: "https://cdn.example.com/sounds/coin-clink.mp3",
          },
        ],
        muteDefault: false,
      },
    });
  }

  setupEventListeners() {
    window.addEventListener("message", (event) => {
      if (!event.origin.includes("zogo.com")) return;

      const { type, payload } = event.data;

      switch (type) {
        case "CUSTOM_CSS_APPLIED":
          console.log("Custom styles applied successfully");
          break;
        case "CUSTOM_CSS_ERROR":
          console.error("Failed to apply custom CSS:", payload.error);
          break;
        case "CUSTOM_SOUNDS_LOADED":
          console.log("Custom sounds loaded successfully");
          break;
        case "CUSTOM_SOUNDS_ERROR":
          console.error("Failed to load custom sounds:", payload.error);
          break;
      }
    });
  }
}

// Initialize with customizations
const customZogo = new CustomizedZogo360();
customZogo.initialize();
```

### Best Practices for Customization

1. **Test thoroughly** - Ensure your custom CSS doesn't break core functionality
2. **Use CSS variables** - Target CSS custom properties when available for cleaner overrides
3. **Optimize media files** - Keep sound files small for faster loading (preferably under 100KB)
4. **Provide fallbacks** - Ensure the experience works even if custom assets fail to load
5. **Respect accessibility** - Maintain contrast ratios and don't remove focus indicators
6. **Host assets on CDN** - Use a reliable CDN for CSS and sound files to ensure fast loading

For more examples of advanced customization, see the "Advanced Configuration and Customization" examples in the `examples` directory for each framework.

## Fetching User Progress Data

The Zogo 360 Integration package provides a `getUserData()` function that allows you to fetch user progress data from your backend. This is particularly useful for creating targeted CTAs (Call-to-Actions) within your app to encourage users to engage with Zogo 360 content.

### Setting Up

Before using `getUserData()`, you must configure the base URL and token:

```javascript
// Set the base URL for API calls
Zogo360.setCustomBaseURL("https://api.zogo.com");

// Set the authentication token
Zogo360.setToken("YOUR_AUTH_TOKEN_HERE");
```

### Using getUserData()

The `getUserData()` function accepts a `type` parameter to specify what kind of data to fetch:

```javascript
async function fetchUserProgress() {
  try {
    // Fetch user module completion data
    const moduleData = await Zogo360.getUserData("modules");

    // Example response:
    // {
    //   "completed_modules": 15,
    //   "total_modules": 50,
    //   "completion_percentage": 30,
    //   "last_completed": "2024-01-15T10:30:00Z"
    // }

    // Create targeted CTAs based on progress
    if (moduleData.completion_percentage < 50) {
      showCTA("You're 30% complete! Continue learning to unlock rewards!");
    } else if (moduleData.completion_percentage < 100) {
      showCTA(
        `Only ${
          moduleData.total_modules - moduleData.completed_modules
        } modules left!`
      );
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}
```

### Available Data Types and Response Formats

#### `module_history`

Returns the user's module completion history:

```javascript
const moduleHistory = await Zogo360.getUserData("module_history");
// Response:
{
  "modules": [
    {
      "id": 1,
      "name": "Introduction to Banking",
      "progress": 1.0,  // 0-1 scale (1.0 = 100% complete)
      "points_earned": 50,
      "points_available": 50,
      "accuracy": 0.85,  // 85% accuracy
      "date_completed": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### `current_module`

Returns the user's current active module:

```javascript
const currentModule = await Zogo360.getUserData("current_module");
// Response:
{
  "module": {
    "id": 2,
    "name": "Credit Card Basics",
    "progress": 0.5,  // 50% complete
    "points_earned": 20,
    "points_available": 50,
    "accuracy": 0.7
  }
}
```

#### `skill_history`

Returns the user's skill completion history:

```javascript
const skillHistory = await Zogo360.getUserData("skill_history");
// Response:
{
  "skills": [
    {
      "id": 1,
      "name": "Budgeting Master",
      "progress": 1.0,
      "points_earned": 100,
      "points_available": 100,
      "accuracy": 0.9,
      "date_completed": "2024-01-10T14:20:00Z"
    }
  ]
}
```

#### `current_skill`

Returns the user's current active skill:

```javascript
const currentSkill = await Zogo360.getUserData("current_skill");
// Response:
{
  "skill": {
    "id": 2,
    "name": "Investment Fundamentals",
    "progress": 0.3,
    "points_earned": 30,
    "points_available": 100,
    "accuracy": 0.8
  }
}
```

#### `current_achievements`

Returns available and latest achievements:

```javascript
const achievements = await Zogo360.getUserData("current_achievements");
// Response:
{
  "achievements": [
    {
      "id": 1,
      "name": "3 Day Streak",
      "sub_text": "Complete modules 3 days in a row",
      "points_available": 50,
      "progress": 0.67,  // 2 out of 3 days
      "current_metric_value": 2,
      "complete_metric_value": 3
    }
  ]
}
```

#### `achievements_history`

Returns completed achievements history:

```javascript
const achievementHistory = await Zogo360.getUserData("achievements_history");
// Response:
{
  "achievements": [
    {
      "id": 1,
      "name": "First Module Complete",
      "sub_text": "Complete your first module",
      "points_available": 25,
      "progress": 1.0,
      "current_metric_value": 1,
      "complete_metric_value": 1,
      "date_complete": "2024-01-05T09:15:00Z"
    }
  ]
}
```

#### `reward_history`

Returns user's reward redemption history:

````javascript
const rewardHistory = await Zogo360.getUserData("reward_history");
// Response:
{
  "rewards": [
    {
      "name": "Amazon Gift Card",
      "type": "gift_card",
      "delivery_type": "email",
      "image": "https://cdn.zogo.com/rewards/amazon-gc.png",
      "description": "$5 Amazon Gift Card",
      "cost": 5000,
      "redemption_date": "2024-01-20T16:45:00Z"
    }
  ]
}
```

### Example: Dynamic CTA Implementation

```javascript
class Zogo360CTAManager {
  constructor() {
    this.setupConfig();
    this.checkUserProgress();
  }

  setupConfig() {
    Zogo360.setCustomBaseURL("https://api.zogo.com");
    Zogo360.setToken(this.getAuthToken()); // Get token from your auth system
  }

  async checkUserProgress() {
    try {
      // Fetch multiple data types
      const [currentModule, currentAchievements, rewardHistory] = await Promise.all([
        Zogo360.getUserData("current_module"),
        Zogo360.getUserData("current_achievements"),
        Zogo360.getUserData("reward_history")
      ]);

      // Create personalized CTAs
      this.createPersonalizedCTA(currentModule, currentAchievements, rewardHistory);

    } catch (error) {
      console.error("Error fetching user progress:", error);
      // Show generic CTA as fallback
      this.showGenericCTA();
    }
  }

  createPersonalizedCTA(currentModule, currentAchievements, rewardHistory) {
    const ctaContainer = document.getElementById("zogo-cta");

    // Module progress CTA
    if (currentModule.module && currentModule.module.progress > 0 && currentModule.module.progress < 1) {
      const percentComplete = Math.round(currentModule.module.progress * 100);
      const remainingPoints = currentModule.module.points_available - currentModule.module.points_earned;

      ctaContainer.innerHTML = `
        <div class="cta-card progress-cta">
          <h3>📚 Continue "${currentModule.module.name}"</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentComplete}%"></div>
          </div>
          <p>${percentComplete}% complete - Earn ${remainingPoints} more points!</p>
          <button onclick="openZogo360()">Resume Module</button>
        </div>
      `;
      return;
    }

    // Achievement progress CTA
    const nearCompleteAchievement = currentAchievements.achievements?.find(
      a => a.progress > 0.5 && a.progress < 1
    );

    if (nearCompleteAchievement) {
      const percentComplete = Math.round(nearCompleteAchievement.progress * 100);
      ctaContainer.innerHTML = `
        <div class="cta-card achievement-cta">
          <h3>🏆 Almost there!</h3>
          <p>"${nearCompleteAchievement.name}" - ${nearCompleteAchievement.sub_text}</p>
          <p>${nearCompleteAchievement.current_metric_value} / ${nearCompleteAchievement.complete_metric_value} complete</p>
          <button onclick="openZogo360()">Complete Achievement</button>
        </div>
      `;
      return;
    }

    // Reward milestone CTA
    if (rewardHistory.rewards && rewardHistory.rewards.length > 0) {
      const totalRedeemed = rewardHistory.rewards.reduce((sum, r) => sum + r.cost, 0);
      ctaContainer.innerHTML = `
        <div class="cta-card rewards-cta">
          <h3>🎁 Reward Champion!</h3>
          <p>You've redeemed ${totalRedeemed.toLocaleString()} points worth of rewards!</p>
          <p>Keep learning to earn more!</p>
          <button onclick="openZogo360()">Earn More Points</button>
        </div>
      `;
      return;
    }

    // Default CTA for new users
    this.showGenericCTA();
  }

  showGenericCTA() {
    const ctaContainer = document.getElementById("zogo-cta");
    ctaContainer.innerHTML = `
      <div class="cta-card default-cta">
        <h3>Start Your Financial Learning Journey</h3>
        <p>Learn, earn points, and unlock rewards!</p>
        <button onclick="openZogo360()">Get Started</button>
      </div>
    `;
  }

  getAuthToken() {
    // Implement your token retrieval logic
    return localStorage.getItem("zogo_auth_token");
  }
}

// Initialize CTA manager
const ctaManager = new Zogo360CTAManager();

// Function to open Zogo 360
function openZogo360() {
  const zogoElement = document.getElementById("zogo-container");
  zogoElement.style.display = "block";
  zogoElement.initialize({
    user_auth_token: localStorage.getItem("zogo_auth_token"),
  });
}

// Function to open Zogo 360 directly to rewards
function openZogo360ToRewards() {
  const zogoElement = document.getElementById("zogo-container");
  zogoElement.style.display = "block";
  zogoElement.initialize({
    user_auth_token: localStorage.getItem("zogo_auth_token"),
    widget_type: "deep_link",
    initial_page: "MARKETPLACE",
  });
}
```

### Error Handling

The `getUserData()` function will throw errors in these cases:

1. **Base URL not set**: Call `setCustomBaseURL()` first
2. **Token not set**: Call `setToken()` first
3. **Network errors**: Handle with try/catch
4. **Invalid data type**: Check available data types
5. **Authentication failures**: Token may be expired

### Best Practices

1. **Cache data appropriately** - Don't fetch on every page load
2. **Handle errors gracefully** - Always provide fallback CTAs
3. **Respect rate limits** - Implement appropriate throttling
4. **Update CTAs dynamically** - Refresh after user completes activities
5. **A/B test CTAs** - Experiment with different messages and designs
6. **Track CTA performance** - Monitor click-through rates

This feature enables you to create a more engaging experience by showing users personalized prompts based on their actual progress, encouraging continued engagement with Zogo 360 content.
````
