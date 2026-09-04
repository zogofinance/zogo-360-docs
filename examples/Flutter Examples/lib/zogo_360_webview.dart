import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const initialZogoToken = String.fromEnvironment('ZOGO_TOKEN');
const _zogoOrigin = 'https://360.zogo.com';

/// The initialization values accepted by the Zogo 360 iframe.
class Zogo360Config {
  const Zogo360Config({
    required this.token,
    this.widgetType = 'full_experience',
    this.moduleId,
    this.skillId,
  });

  final String token;
  final String widgetType;
  final String? moduleId;
  final String? skillId;

  Map<String, dynamic> toPayload() => {
    'user_auth_token': token,
    'widget_type': widgetType,
    if (moduleId != null) 'module_id': moduleId,
    if (skillId != null) 'skill_id': skillId,
  };
}

/// A decoded message emitted by the Zogo iframe.
class Zogo360Message {
  const Zogo360Message({required this.type, required this.payload});

  final String type;
  final Map<String, dynamic> payload;
}

/// Lets an example initialize Zogo manually or send optional protocol messages.
class Zogo360Controller {
  VoidCallback? _initialize;
  void Function(String, Map<String, dynamic>)? _sendMessage;

  void initialize() => _initialize?.call();

  void sendMessage(String type, Map<String, dynamic> payload) {
    _sendMessage?.call(type, payload);
  }
}

/// Native WKWebView/Android WebView wrapper for the Zogo iframe protocol.
///
/// Zogo runs in a cross-origin iframe. The small HTML document below forwards
/// iframe messages to Flutter through [addJavaScriptChannel], while Flutter
/// replies through [runJavaScript]. Keeping this bridge here means the example
/// screens only need to describe their initialization behavior.
class Zogo360WebView extends StatefulWidget {
  const Zogo360WebView({
    super.key,
    required this.config,
    this.controller,
    this.autoInitialize = true,
    this.onMessage,
    this.onStatusChanged,
  });

  final Zogo360Config config;
  final Zogo360Controller? controller;
  final bool autoInitialize;
  final ValueChanged<Zogo360Message>? onMessage;
  final ValueChanged<String>? onStatusChanged;

  @override
  State<Zogo360WebView> createState() => _Zogo360WebViewState();
}

class _Zogo360WebViewState extends State<Zogo360WebView> {
  late final WebViewController _webViewController;
  var _initializationRequested = false;
  var _initializeWhenReady = false;
  var _didInitialize = false;

  @override
  void initState() {
    super.initState();
    widget.controller?._initialize = _requestInitialization;
    widget.controller?._sendMessage = _sendMessage;

    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'NativeInterface',
        onMessageReceived: _handleJavaScriptMessage,
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onWebResourceError: (error) {
            if (error.isForMainFrame == true) {
              _setStatus('Unable to load Zogo 360');
            }
          },
        ),
      )
      ..loadHtmlString(_zogoHtml);
  }

  void _handleJavaScriptMessage(JavaScriptMessage message) {
    try {
      Object? decoded = jsonDecode(message.message);
      if (decoded is String) {
        decoded = jsonDecode(decoded);
      }
      if (decoded is! Map) {
        return;
      }

      final data = Map<String, dynamic>.from(decoded);
      final rawPayload = data['payload'];
      final payload = rawPayload is Map
          ? Map<String, dynamic>.from(rawPayload)
          : <String, dynamic>{};
      final zogoMessage = Zogo360Message(
        type: data['type']?.toString() ?? 'UNKNOWN',
        payload: payload,
      );
      widget.onMessage?.call(zogoMessage);

      switch (zogoMessage.type) {
        case 'IFRAME_LOADED':
          _setStatus('Waiting for Zogo 360');
        case 'CONTAINER_READY':
          _setStatus('Container ready');
        case 'REQUEST_INITIALIZATION':
          _initializationRequested = true;
          if (widget.autoInitialize || _initializeWhenReady) {
            _initialize();
          } else {
            _setStatus('Ready to initialize');
          }
        case 'INITIALIZATION_COMPLETE':
          _setStatus('Ready');
        case 'AUTH_TOKEN_PROCESSED':
          _setStatus(
            zogoMessage.payload['success'] == true
                ? 'Authenticated'
                : 'Authentication failed',
          );
        case 'INITIALIZATION_ERROR':
        case 'ERROR':
          _setStatus('Zogo 360 error');
      }
    } on FormatException {
      // The iframe occasionally emits non-protocol browser messages.
    }
  }

  void _requestInitialization() {
    if (_initializationRequested) {
      _initialize();
    } else {
      _initializeWhenReady = true;
      _setStatus('Waiting for Zogo 360');
    }
  }

  void _initialize() {
    if (_didInitialize) {
      return;
    }
    _didInitialize = true;
    _setStatus('Initializing');
    _sendMessage('INITIALIZE', widget.config.toPayload());
  }

  void _sendMessage(String type, Map<String, dynamic> payload) {
    final message = jsonEncode({'type': type, 'payload': payload});
    _webViewController.runJavaScript("window.postMessage($message, '*');");
  }

  void _setStatus(String status) => widget.onStatusChanged?.call(status);

  @override
  Widget build(BuildContext context) {
    return WebViewWidget(controller: _webViewController);
  }

  @override
  void dispose() {
    widget.controller?._initialize = null;
    widget.controller?._sendMessage = null;
    super.dispose();
  }
}

const _zogoHtml =
    '''
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <style>
      html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; }
      iframe { width: 100%; height: 100%; border: 0; }
    </style>
  </head>
  <body>
    <iframe id="zogo360-iframe" src="$_zogoOrigin/" allow="camera; microphone; geolocation"></iframe>
    <script>
      const iframe = document.getElementById('zogo360-iframe');

      iframe.addEventListener('load', function() {
        NativeInterface.postMessage(JSON.stringify({type: 'IFRAME_LOADED'}));
      });

      window.addEventListener('message', function(event) {
        if (event.source === iframe.contentWindow) {
          // Never accept iframe messages from an unexpected origin.
          if (event.origin !== '$_zogoOrigin') return;
          NativeInterface.postMessage(JSON.stringify(event.data));
        } else if (event.source === window) {
          iframe.contentWindow.postMessage(event.data, '$_zogoOrigin');
        }
      });
    </script>
  </body>
</html>
''';
