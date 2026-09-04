import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';
import 'example_widgets.dart';

/// Equivalent to BasicJS example 2: wait for an explicit Initialize tap.
class DelayedExamplePage extends StatefulWidget {
  const DelayedExamplePage({super.key, required this.token});

  final String token;

  @override
  State<DelayedExamplePage> createState() => _DelayedExamplePageState();
}

class _DelayedExamplePageState extends State<DelayedExamplePage> {
  final _controller = Zogo360Controller();
  var _status = 'Loading container';
  var _started = false;

  void _initialize() {
    setState(() => _started = true);
    _controller.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Delayed Initialization')),
      body: Column(
        children: [
          ControlPanel(
            child: Row(
              children: [
                Expanded(child: Text('Status: $_status')),
                FilledButton.icon(
                  onPressed: _started ? null : _initialize,
                  icon: const Icon(Icons.play_arrow),
                  label: Text(_started ? 'Started' : 'Initialize'),
                ),
              ],
            ),
          ),
          Expanded(
            child: Zogo360WebView(
              config: Zogo360Config(token: widget.token),
              controller: _controller,
              autoInitialize: false,
              onStatusChanged: (status) {
                if (mounted) {
                  setState(() => _status = status);
                }
              },
            ),
          ),
        ],
      ),
    );
  }
}
