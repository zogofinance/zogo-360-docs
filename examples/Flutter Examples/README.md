# Zogo 360 Flutter Example App

This mobile app demonstrates all six Zogo 360 examples in Flutter using the
official [`webview_flutter`](https://pub.dev/packages/webview_flutter) plugin.
It uses `WKWebView` on iOS and the system WebView on Android.

## Included Examples

1. **Basic Web Example** — automatic full-experience initialization
2. **Delayed Initialization** — initialization after explicit user action
3. **Event Listeners** — live event logging and external URL handling
4. **Module Deep Links** — direct navigation to documented module IDs
5. **Skill Deep Links** — direct navigation to documented skill IDs
6. **Advanced Customization** — runtime light, dark, and default CSS themes

Each example page is kept in its own file under [`lib/examples`](lib/examples).
The reusable WebView and JavaScript message bridge are in
[`lib/zogo_360_webview.dart`](lib/zogo_360_webview.dart).

## Requirements

- Flutter 3.44 or newer
- Xcode and CocoaPods for iOS development
- Android Studio and an Android SDK for Android development
- A backend-generated Zogo user authentication token

## Run the App

```bash
flutter pub get
flutter run
```

Enter a valid Zogo user token on the home screen and choose an example. The
token remains in memory and is never logged or committed to source control.

During development, you can prefill the token and open a specific route:

```bash
flutter run \
  --dart-define=ZOGO_TOKEN=your-user-token \
  --dart-define=ZOGO_ROUTE=/events
```

Available routes are `/basic`, `/delayed`, `/events`, `/module`, `/skill`, and
`/advanced`.

For implementation details, message flow, security guidance, and integration
snippets, see the [Flutter Integration Guide](../README_FLUTTER.md).
