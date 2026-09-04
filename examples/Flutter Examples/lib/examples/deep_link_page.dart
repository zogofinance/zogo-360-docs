import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';

/// Runs a module or skill and returns Zogo's EXIT_REQUESTED source to its catalog.
class DeepLinkPage extends StatelessWidget {
  const DeepLinkPage({super.key, required this.title, required this.config});

  final String title;
  final Zogo360Config config;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Zogo360WebView(
        config: config,
        onMessage: (message) {
          if (message.type == 'EXIT_REQUESTED') {
            Navigator.of(
              context,
            ).pop(message.payload['source']?.toString() ?? 'unknown');
          }
        },
      ),
    );
  }
}

Future<void> openDeepLink(
  BuildContext context, {
  required String title,
  required Zogo360Config config,
}) async {
  final exitSource = await Navigator.of(context).push<String>(
    MaterialPageRoute<String>(
      builder: (_) => DeepLinkPage(title: title, config: config),
    ),
  );
  if (context.mounted && exitSource != null) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('Zogo requested exit: $exitSource')));
  }
}
