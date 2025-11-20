# Zogo 360 Platform-Agnostic Integration Guide

This guide provides instructions for integrating Zogo 360 into any platform (Swift, Kotlin, Flutter, etc.) by implementing a WebView-based solution with proper message passing.

## Overview

Zogo 360 is a web-based SDK that runs inside an iframe. To integrate it into your native application, you need to:

1. Create a WebView component that loads the Zogo 360 iframe
2. Implement bidirectional message passing between your app and the iframe
3. Handle initialization and configuration
4. Optionally implement API calls for user data

## Core Components

### 1. WebView Container

You'll need to create a WebView that loads an HTML page containing the Zogo 360 iframe. The WebView should:

- Support JavaScript execution
- Allow cross-origin communication
- Handle postMessage events

**HTML Template:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <style>
      body,
      html {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    </style>
  </head>
  <body>
    <iframe
      id="zogo360-iframe"
      src="https://360.zogo.com/"
      allow="camera; microphone; geolocation"
    ></iframe>
    <script>
      // Listen for messages from the iframe
      window.addEventListener("message", function (event) {
        // Forward messages to your native app
        // The method depends on your platform (e.g., webkit.messageHandlers for iOS)
        if (window.NativeInterface && window.NativeInterface.postMessage) {
          window.NativeInterface.postMessage(JSON.stringify(event.data));
        }
      });

      // Listen for messages from your native app
      window.addEventListener("message", function (event) {
        if (event.source === window) {
          // Forward to iframe
          document
            .getElementById("zogo360-iframe")
            .contentWindow.postMessage(event.data, "*");
        }
      });
    </script>
  </body>
</html>
```

### 2. Configuration Options

Your integration should support the following configuration options:

```typescript
interface Zogo360Config {
  token: string; // Required: Authentication token
  customLegacyBaseURL?: string; // Optional: Override legacy API URL (default: https://api.zogofinance.com)
  customBaseURL?: string; // Optional: Override API URL (default: https://api.zogo.com)
  customWebViewURL?: string; // Optional: Override WebView URL (default: https://360.zogo.com)
  customCSS?: any; // Optional: Custom CSS configuration
  customSounds?: any; // Optional: Custom sound configuration
}
```

### 3. Message Protocol

#### Incoming Messages (from Zogo 360 iframe)

Your app should handle these message types:

- `REQUEST_INITIALIZATION`: The iframe is ready and requesting initialization
- `CONTAINER_READY`: The iframe container is ready
- `REQUEST_CUSTOM_CSS`: Request for custom CSS configuration
- `REQUEST_CUSTOM_SOUNDS`: Request for custom sound configuration
- `PLAY_SOUND`: Request to play a sound
- `OPEN_URL`: Request to open a URL
- Other custom messages

#### Outgoing Messages (to Zogo 360 iframe)

Your app should send these message types:

- `INITIALIZE`: Send initialization data with token and configuration
- `CUSTOM_CSS`: Send custom CSS configuration
- `CUSTOM_SOUNDS`: Send custom sound configuration
- `NAVIGATE_TO`: Navigate to a specific page within Zogo 360

**Message Format:**

```json
{
  "type": "MESSAGE_TYPE",
  "payload": {
    // Message-specific data
  }
}
```

### 4. Initialization Flow

1. Create and load the WebView with the HTML template
2. Wait for `REQUEST_INITIALIZATION` message from the iframe
3. Send `INITIALIZE` message with configuration:

```json
{
  "type": "INITIALIZE",
  "payload": {
    "token": "your-auth-token",
    "customBaseURL": "https://api.zogo.com",
    "customLegacyBaseURL": "https://api.zogofinance.com",
    "customCSS": {
      /* CSS config */
    },
    "customSounds": {
      /* Sounds config */
    }
  }
}
```

### 5. Platform-Specific Implementation

#### iOS (Swift)

```swift
import WebKit

class Zogo360WebView: WKWebView {
    private var configuration: Zogo360Config

    init(configuration: Zogo360Config) {
        self.configuration = configuration

        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.userContentController.add(self, name: "NativeInterface")

        super.init(frame: .zero, configuration: webConfiguration)

        loadHTMLString(htmlTemplate, baseURL: nil)
    }

    func userContentController(_ userContentController: WKUserContentController,
                             didReceive message: WKScriptMessage) {
        // Handle messages from JavaScript
        if let messageBody = message.body as? String,
           let data = messageBody.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            handleMessage(json)
        }
    }

    private func sendMessage(type: String, payload: [String: Any]) {
        let message = ["type": type, "payload": payload]
        if let jsonData = try? JSONSerialization.data(withJSONObject: message),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            evaluateJavaScript("window.postMessage(\(jsonString), '*')")
        }
    }
}
```

#### Android (Kotlin)

```kotlin
class Zogo360WebView(context: Context, private val config: Zogo360Config) : WebView(context) {

    init {
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true

        addJavascriptInterface(NativeInterface(), "NativeInterface")
        loadDataWithBaseURL(null, htmlTemplate, "text/html", "UTF-8", null)
    }

    inner class NativeInterface {
        @JavascriptInterface
        fun postMessage(message: String) {
            // Parse and handle message
            val json = JSONObject(message)
            handleMessage(json)
        }
    }

    private fun sendMessage(type: String, payload: JSONObject) {
        val message = JSONObject().apply {
            put("type", type)
            put("payload", payload)
        }

        post {
            evaluateJavascript("window.postMessage($message, '*')", null)
        }
    }
}
```

#### Flutter

```dart
import 'package:webview_flutter/webview_flutter.dart';

class Zogo360WebView extends StatefulWidget {
  final Zogo360Config config;

  Zogo360WebView({required this.config});

  @override
  _Zogo360WebViewState createState() => _Zogo360WebViewState();
}

class _Zogo360WebViewState extends State<Zogo360WebView> {
  late WebViewController _controller;

  @override
  Widget build(BuildContext context) {
    return WebView(
      initialUrl: 'about:blank',
      javascriptMode: JavascriptMode.unrestricted,
      onWebViewCreated: (WebViewController controller) {
        _controller = controller;
        _controller.loadHtmlString(htmlTemplate);
      },
      javascriptChannels: {
        JavascriptChannel(
          name: 'NativeInterface',
          onMessageReceived: (JavascriptMessage message) {
            handleMessage(jsonDecode(message.message));
          },
        ),
      },
    );
  }

  void sendMessage(String type, Map<String, dynamic> payload) {
    final message = jsonEncode({
      'type': type,
      'payload': payload,
    });

    _controller.evaluateJavascript("window.postMessage($message, '*')");
  }
}
```

#### Tabris.js

```javascript
import { WebView, app } from "tabris";

class Zogo360WebView {
  constructor(config) {
    this.config = config;
    this.webView = new WebView({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      html: this.getHtmlTemplate(),
    }).onMessage((event) => this.handleMessage(event.data));

    // Initialize when ready
    this.webView.onLoad(() => {
      this.setupMessageHandling();
    });
  }

  getHtmlTemplate() {
    return `<!DOCTYPE html>
      <html>
      <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <style>
              body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
              iframe { width: 100%; height: 100%; border: none; }
          </style>
      </head>
      <body>
          <iframe id="zogo360-iframe" src="${
            this.config.customWebViewURL || "https://360.zogo.com/"
          }"
                  allow="camera; microphone; geolocation"></iframe>
          <script>
              // Bridge between iframe and Tabris
              window.addEventListener('message', function(event) {
                  // Forward to Tabris
                  window.parent.postMessage(event.data, '*');
              });
              
              // Listen for messages from Tabris
              window.addEventListener('message', function(event) {
                  if (event.source === window.parent) {
                      document.getElementById('zogo360-iframe').contentWindow.postMessage(event.data, '*');
                  }
              });
          </script>
      </body>
      </html>`;
  }

  handleMessage(message) {
    try {
      const data = typeof message === "string" ? JSON.parse(message) : message;

      switch (data.type) {
        case "REQUEST_INITIALIZATION":
          this.sendMessage("INITIALIZE", {
            token: this.config.token,
            customBaseURL: this.config.customBaseURL,
            customLegacyBaseURL: this.config.customLegacyBaseURL,
            customCSS: this.config.customCSS,
            customSounds: this.config.customSounds,
          });
          break;
        // Handle other message types
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }

  sendMessage(type, payload) {
    const message = JSON.stringify({ type, payload });
    this.webView.postMessage(message, "*");
  }

  appendTo(parent) {
    this.webView.appendTo(parent);
    return this;
  }
}

// Usage
const zogo360 = new Zogo360WebView({
  token: "your-auth-token",
  customBaseURL: "https://api.zogo.com",
}).appendTo(app.contentView);
```

### 6. API Integration

To fetch user data, implement HTTP requests to the Zogo API:

**Endpoint:** `GET {baseURL}/sdk/user/data/{type}`

**Headers:**

- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Example Request:**

```http
GET https://api.zogo.com/sdk/user/data/profile
Authorization: Bearer your-auth-token
Content-Type: application/json
```

### 7. Common Issues and Solutions

**Issue:** Messages not being received

- **Solution:** Ensure JavaScript is enabled and message handlers are properly registered

**Issue:** Initialization failing

- **Solution:** Verify token is valid and being sent in the correct format

**Issue:** WebView not loading

- **Solution:** Check network permissions and ensure URLs are accessible

## Example Implementation Flow

```
1. App starts → Create WebView with HTML template
2. WebView loads → iframe sends REQUEST_INITIALIZATION
3. App receives message → Send INITIALIZE with token and config
4. iframe initializes → Sends CONTAINER_READY
5. App ready to interact → Can send/receive messages as needed
```

For Zogo 360 specific questions, contact Zogo support.
