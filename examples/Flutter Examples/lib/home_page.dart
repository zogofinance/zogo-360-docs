import 'package:flutter/material.dart';

import 'example_pages.dart';
import 'zogo_360_webview.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late final TextEditingController _tokenController;
  var _hideToken = true;

  @override
  void initState() {
    super.initState();
    _tokenController = TextEditingController(text: initialZogoToken);
  }

  void _submitToken() {
    FocusManager.instance.primaryFocus?.unfocus();
    final hasToken = _tokenController.text.trim().isNotEmpty;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          hasToken
              ? 'Token is ready. Choose an example below.'
              : 'Enter a Zogo user token first.',
        ),
      ),
    );
  }

  void _openExample(ZogoExample example) {
    final token = _tokenController.text.trim();
    FocusManager.instance.primaryFocus?.unfocus();
    if (token.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a Zogo user token first.')),
      );
      return;
    }

    Navigator.of(
      context,
    ).push(MaterialPageRoute<void>(builder: (_) => example.buildPage(token)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Zogo 360 Flutter Examples')),
      body: CustomScrollView(
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Card(
                color: Theme.of(context).colorScheme.primaryContainer,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Authentication',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Use a backend-generated user token. It stays in memory and is never logged.',
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: _tokenController,
                        obscureText: _hideToken,
                        autocorrect: false,
                        enableSuggestions: false,
                        textInputAction: TextInputAction.done,
                        onSubmitted: (_) => _submitToken(),
                        decoration: InputDecoration(
                          filled: true,
                          fillColor: Theme.of(context).colorScheme.surface,
                          border: const OutlineInputBorder(),
                          labelText: 'Zogo user token',
                          suffixIcon: IconButton(
                            onPressed: () =>
                                setState(() => _hideToken = !_hideToken),
                            tooltip: _hideToken ? 'Show token' : 'Hide token',
                            icon: Icon(
                              _hideToken
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerRight,
                        child: FilledButton.icon(
                          onPressed: _submitToken,
                          icon: const Icon(Icons.check),
                          label: const Text('Submit token'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
            sliver: SliverList.separated(
              itemCount: ZogoExample.values.length,
              separatorBuilder: (_, _) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final example = ZogoExample.values[index];
                return Card(
                  clipBehavior: Clip.antiAlias,
                  child: ListTile(
                    minTileHeight: 88,
                    leading: CircleAvatar(child: Icon(example.icon)),
                    title: Text(example.title),
                    subtitle: Text(example.description),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => _openExample(example),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _tokenController.dispose();
    super.dispose();
  }
}
