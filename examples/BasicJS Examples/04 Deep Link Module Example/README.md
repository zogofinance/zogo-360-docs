# Deep Link Module Example

This example demonstrates how to use Zogo 360's deep-linking feature to open a specific learning module and handle the exit flow when a user completes or leaves it.

## What This Example Shows

- How to use the `widget_type: 'deep_link'` configuration
- How to pass a `module_id`
- How to handle the `EXIT_REQUESTED` window message
- How to retain module context in the parent application

## Requirements

- A valid Zogo 360 authentication token
- A valid module ID that the user can access
- A modern web browser

## How Deep Linking Works

When Zogo 360 is initialized with `widget_type: 'deep_link'` and a `module_id`, it:

1. Skips the normal Zogo landing-page flow.
2. Opens the requested module.
3. Sends an `EXIT_REQUESTED` message to the parent window when the user exits or completes the deep-linked flow.
4. Does not close or hide itself. The parent application must handle the message.

## Example Module IDs

- **994850**: The Product Life Cycle
- **1008545**: Investing vs. Savings Goals

Confirm that these modules are available to the authenticated user before relying on them in an integration.

## Opening a Module

Retain the selected module ID in the parent application because the exit payload does not include it.

```javascript
let activeModuleId = null;

function openZogoModule(moduleId) {
  activeModuleId = moduleId;
  saveAppState();

  analytics.track('zogo_module_started', {
    moduleId,
    timestamp: Date.now(),
  });

  zogoElement.initialize({
    user_auth_token: token,
    widget_type: 'deep_link',
    module_id: moduleId,
  });
}
```

## Exit Handler Implementation

Zogo sends `EXIT_REQUESTED` using `window.parent.postMessage()`. Listen for the browser's `message` event and read the message from `event.data`.

```javascript
window.addEventListener('message', (event) => {
  // Replace this with the exact trusted Zogo origin.
  if (event.origin !== ZOGO_ORIGIN) return;

  const message = event.data;
  if (message?.type !== 'EXIT_REQUESTED') return;

  handleZogoExit({
    moduleId: activeModuleId,
    ...message.payload,
  });
});
```

### Exit Event Payload

```javascript
{
  type: 'EXIT_REQUESTED',
  payload: {
    timestamp: 1724784000000,
    source: 'learn_exit_button'
  }
}
```

The payload does not currently include `moduleId`, `currentPage`, completion progress, or other module context. The parent application must retain any context it needs when initializing Zogo.

### Exit Sources

Current sources include:

- `learn_exit_button`: The user clicked the X button.
- `deep_link_intro_exit`: The deep-link introduction requested an exit.
- `end_of_module_continue`: A module deep link was completed and continued.
- `module_complete_exit_requested`: A skill deep-link flow completed its final module.
- `end_of_module_default`: End-of-module navigation did not provide a recognized destination.
- `badge_continue`: The user continued after receiving a badge.

Additional end-of-module sources may be forwarded from navigation data, so integrations should not treat this list as an exhaustive enum.

## Hiding Zogo's X Button

The parent application can inject CSS after the Zogo iframe is ready by sending a `CUSTOM_CSS` message. Hide both desktop and mobile versions of the Learn exit button:

```javascript
function hideZogoExitButton(zogoIframe) {
  zogoIframe.contentWindow.postMessage(
    {
      type: 'CUSTOM_CSS',
      payload: {
        css: `
          .learn-back-button-left,
          .learn-back-button-mobile {
            display: none !important;
          }
        `,
      },
    },
    ZOGO_ORIGIN,
  );
}
```

Send this only after the iframe has emitted `CONTAINER_READY`. Zogo acknowledges the inline injection with:

```javascript
{
  type: 'CUSTOM_CSS_APPLIED',
  payload: {
    success: true,
    timestamp: 1724784000000,
    source: 'inline'
  }
}
```

Hiding the X removes the visible manual exit action, but it does not change completion-related `EXIT_REQUESTED` messages. The parent application must still handle those messages and should provide another accessible way to leave the experience when appropriate.

## Integration Patterns

### Course Catalog

```javascript
const courses = [
  { id: '994850', name: 'The Product Life Cycle' },
  { id: '1008545', name: 'Investing vs. Savings Goals' },
];

courses.forEach((course) => {
  const button = createCourseButton(course);
  button.onclick = () => openZogoModule(course.id);
});
```

### Progress Tracking

Do not infer authoritative completion merely because the SDK requested an exit. Use completion-specific sources and confirm completion with backend data when it affects rewards, access, or compliance.

```javascript
const completionSources = new Set([
  'end_of_module_continue',
  'module_complete_exit_requested',
  'badge_continue',
]);

function handleZogoExit(exitData) {
  const completed = completionSources.has(exitData.source);

  if (completed) {
    updateUserProgress({
      moduleId: exitData.moduleId,
      completed: true,
      completedAt: new Date(exitData.timestamp),
    });
  }

  zogoContainer.style.display = 'none';
  appContent.style.display = 'block';
}
```

### Sequential Learning Paths

```javascript
const learningPath = ['994850', '1008545', '1234567'];
let currentIndex = 0;

function handleZogoExit(exitData) {
  const completed =
    exitData.source === 'end_of_module_continue' ||
    exitData.source === 'module_complete_exit_requested';

  if (!completed) {
    returnToApp();
    return;
  }

  currentIndex++;

  if (currentIndex < learningPath.length) {
    openZogoModule(learningPath[currentIndex]);
  } else {
    showCompletionCertificate();
  }
}
```

### Gamification

```javascript
function handleZogoExit(exitData) {
  if (!completionSources.has(exitData.source)) {
    returnToApp();
    return;
  }

  showConfetti();
  updateLeaderboard(userId, exitData.moduleId);
  checkAchievements(userId, exitData.moduleId);
  returnToApp();
}
```

## Best Practices

### Always Handle Exit Messages

Deep-link mode sends an exit request instead of navigating elsewhere. The parent application must hide, close, or remove the Zogo container.

### Validate Message Origins

Always verify `event.origin` before processing messages from an embedded iframe. Use the exact expected Zogo origin rather than accepting every origin.

### Register Before Initialization

Attach the `message` listener before initializing the Zogo element so an early initialization or exit message cannot be missed.

### Save Parent State

Save the parent application's navigation and UI state before opening Zogo so it can restore the correct screen when `EXIT_REQUESTED` arrives.

## Error Handling

Initialization errors are also delivered through `window.postMessage()`:

```javascript
window.addEventListener('message', (event) => {
  if (event.origin !== ZOGO_ORIGIN) return;

  const message = event.data;

  if (message?.type === 'INITIALIZATION_ERROR') {
    showError('Unable to load module. Please try again.');
    returnToApp();
  }
});
```

## Common Use Cases

### Educational Applications

- Link specific lessons from a curriculum
- Track completion for grades or certificates
- Enforce sequential learning

### Banking Applications

- Offer financial-literacy modules for specific products
- Require verified module completion before enabling account features
- Provide educational content for regulatory compliance

### Employee Training

- Assign modules to employees
- Track verified completion for compliance
- Link modules to job roles or departments

### Rewards Programs

- Offer points for verified module completion
- Unlock features after education
- Create learning challenges

## Testing Your Integration

1. Test an invalid or inaccessible module ID.
2. Test X-button exits and completion exits independently.
3. Verify that the parent hides or removes Zogo after `EXIT_REQUESTED`.
4. Test offline and interrupted-request behaviour.
5. Test rapid switching between modules.
6. Confirm that messages from unexpected origins are ignored.

## Security Considerations

- Validate the sender's origin for every window message.
- Validate module IDs before passing them to Zogo.
- Do not expose restricted module IDs unnecessarily.
- Verify completion on the backend before granting valuable rewards or access.
- Never expose authentication tokens in logs or analytics.

## Analytics

The exit message does not supply module details or progress. Combine it with context retained by the parent application.

```javascript
function trackZogoExit(exitData) {
  analytics.track('zogo_module_exit', {
    moduleId: exitData.moduleId,
    exitSource: exitData.source,
    sdkTimestamp: exitData.timestamp,
  });
}
```

If progress or completion time is required, measure it in the parent application or obtain authoritative completion data from the backend.

## Troubleshooting

**Module will not load**

- Verify that the module ID is valid.
- Confirm that the user's token can access the module.
- Look for an `INITIALIZATION_ERROR` window message.

**Exit handler does not fire**

- Listen for the window `message` event.
- Read the message from `event.data`, not `event.detail`.
- Register the listener before initialization.
- Confirm that the trusted-origin check matches the Zogo iframe origin.
- Filter for `event.data.type === 'EXIT_REQUESTED'`.

**Clicking X appears to do nothing**

Zogo only sends `EXIT_REQUESTED`; it does not close itself. Confirm that the parent application handles the message and hides or removes the Zogo container.
