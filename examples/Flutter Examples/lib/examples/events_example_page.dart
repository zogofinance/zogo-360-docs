import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../zogo_360_webview.dart';

/// Equivalent to BasicJS example 3: observe and act on every Zogo event.
class EventsExamplePage extends StatefulWidget {
  const EventsExamplePage({super.key, required this.token});

  final String token;

  @override
  State<EventsExamplePage> createState() => _EventsExamplePageState();
}

class _EventsExamplePageState extends State<EventsExamplePage> {
  final _messages = <Zogo360Message>[];

  void _recordMessage(Zogo360Message message) {
    setState(() {
      _messages.insert(0, message);
      if (_messages.length > 50) {
        _messages.removeLast();
      }
    });

    // Match the BasicJS openurl listener by handing external links to iOS/Android.
    if (message.type == 'OPEN_URL') {
      final url = Uri.tryParse(message.payload['url']?.toString() ?? '');
      if (url != null) {
        unawaited(_openExternalUrl(url));
      }
    }
  }

  Future<void> _openExternalUrl(Uri url) async {
    final opened = await launchUrl(url, mode: LaunchMode.externalApplication);
    if (!opened && mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Could not open $url')));
    }
  }

  void _showMessage(Zogo360Message message) {
    showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(message.type),
        content: SingleChildScrollView(
          child: SelectableText(
            const JsonEncoder.withIndent('  ').convert(message.payload),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Event Listeners')),
      body: Column(
        children: [
          Expanded(
            flex: 3,
            child: Zogo360WebView(
              config: Zogo360Config(token: widget.token),
              onMessage: _recordMessage,
            ),
          ),
          const Divider(height: 1),
          SizedBox(
            height: 220,
            child: SafeArea(
              top: false,
              child: Column(
                children: [
                  ListTile(
                    dense: true,
                    title: const Text('Live event console'),
                    subtitle: Text('${_messages.length} messages received'),
                    trailing: IconButton(
                      onPressed: _messages.isEmpty
                          ? null
                          : () => setState(_messages.clear),
                      tooltip: 'Clear events',
                      icon: const Icon(Icons.delete_outline),
                    ),
                  ),
                  Expanded(
                    child: _messages.isEmpty
                        ? const Center(child: Text('Waiting for Zogo events…'))
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                            itemCount: _messages.length,
                            separatorBuilder: (_, _) => const Divider(),
                            itemBuilder: (context, index) {
                              final message = _messages[index];
                              return ListTile(
                                dense: true,
                                contentPadding: EdgeInsets.zero,
                                title: Text(
                                  message.type,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                subtitle: message.payload.isEmpty
                                    ? null
                                    : Text(
                                        jsonEncode(message.payload),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: Theme.of(
                                          context,
                                        ).textTheme.bodySmall,
                                      ),
                                onTap: () => _showMessage(message),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
