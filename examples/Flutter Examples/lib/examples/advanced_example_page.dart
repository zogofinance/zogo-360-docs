import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';
import 'example_widgets.dart';

/// Equivalent to BasicJS example 6: apply CSS variables while Zogo is running.
class AdvancedExamplePage extends StatefulWidget {
  const AdvancedExamplePage({super.key, required this.token});

  final String token;

  @override
  State<AdvancedExamplePage> createState() => _AdvancedExamplePageState();
}

class _AdvancedExamplePageState extends State<AdvancedExamplePage> {
  final _controller = Zogo360Controller();
  var _ready = false;
  var _selectedTheme = 'Default';
  var _result = 'Waiting for initialization';

  void _applyTheme(String name, String css) {
    setState(() {
      _selectedTheme = name;
      _result = 'Applying $name theme…';
    });
    _controller.sendMessage('CUSTOM_CSS', {'css': css});
  }

  void _handleMessage(Zogo360Message message) {
    switch (message.type) {
      case 'INITIALIZATION_COMPLETE':
        setState(() {
          _ready = true;
          _result = 'Ready to customize';
        });
      case 'CUSTOM_CSS_APPLIED':
        setState(() => _result = '$_selectedTheme theme applied');
      case 'CUSTOM_CSS_ERROR':
        setState(
          () =>
              _result = 'Theme error: ${message.payload['error'] ?? 'Unknown'}',
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Advanced Customization')),
      body: Column(
        children: [
          ControlPanel(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'CSS theme',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _ThemeButton(
                      label: 'Default',
                      selected: _selectedTheme == 'Default',
                      onPressed: _ready
                          ? () => _applyTheme('Default', '')
                          : null,
                    ),
                    _ThemeButton(
                      label: 'Light',
                      selected: _selectedTheme == 'Light',
                      onPressed: _ready
                          ? () => _applyTheme('Light', _lightTheme)
                          : null,
                    ),
                    _ThemeButton(
                      label: 'Dark',
                      selected: _selectedTheme == 'Dark',
                      onPressed: _ready
                          ? () => _applyTheme('Dark', _darkTheme)
                          : null,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(_result, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          Expanded(
            child: Zogo360WebView(
              config: Zogo360Config(token: widget.token),
              controller: _controller,
              onMessage: _handleMessage,
            ),
          ),
        ],
      ),
    );
  }
}

class _ThemeButton extends StatelessWidget {
  const _ThemeButton({
    required this.label,
    required this.selected,
    required this.onPressed,
  });

  final String label;
  final bool selected;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return selected
        ? FilledButton(onPressed: onPressed, child: Text(label))
        : OutlinedButton(onPressed: onPressed, child: Text(label));
  }
}

// These mirror the CSS-variable approach in the BasicJS advanced example.
const _lightTheme = '''
:root {
  --brand-primary: #1c64f2;
  --tints-primary-1: #ebf5ff;
  --tints-primary-2: #c3ddfd;
  --neutral-white: #ffffff;
  --neutral-100: #f6f6f6;
  --neutral-200: #ececec;
  --neutral-700: #484848;
  --neutral-800: #313131;
}
body { background-color: var(--neutral-white) !important; color: var(--neutral-800) !important; }
''';

const _darkTheme = '''
:root {
  --brand-primary: #76a9fa;
  --tints-primary-1: #1a223a;
  --tints-primary-2: #233876;
  --neutral-white: #1a1a1a;
  --neutral-100: #242424;
  --neutral-200: #2d2d2d;
  --neutral-700: #dcdcdc;
  --neutral-800: #f6f6f6;
}
body { background-color: var(--neutral-white) !important; color: var(--neutral-800) !important; }
.card, .module-card { background-color: var(--neutral-200) !important; color: var(--neutral-800) !important; }
.navbar { background-color: var(--neutral-100) !important; }
''';
