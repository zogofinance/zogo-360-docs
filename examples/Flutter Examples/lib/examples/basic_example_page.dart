import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';
import 'example_widgets.dart';

/// Equivalent to BasicJS example 1: initialize the full experience immediately.
class BasicExamplePage extends StatefulWidget {
  const BasicExamplePage({super.key, required this.token});

  final String token;

  @override
  State<BasicExamplePage> createState() => _BasicExamplePageState();
}

class _BasicExamplePageState extends State<BasicExamplePage> {
  var _status = 'Loading container';

  @override
  Widget build(BuildContext context) {
    return ExampleScaffold(
      title: 'Basic Web Example',
      description:
          'Zogo initializes automatically with widget_type: full_experience.\nStatus: $_status',
      child: Zogo360WebView(
        config: Zogo360Config(token: widget.token),
        onStatusChanged: (status) {
          if (mounted) {
            setState(() => _status = status);
          }
        },
      ),
    );
  }
}
