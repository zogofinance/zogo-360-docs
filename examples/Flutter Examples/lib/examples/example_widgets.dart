import 'package:flutter/material.dart';

/// Common page shell used by examples that only need an explanatory banner.
class ExampleScaffold extends StatelessWidget {
  const ExampleScaffold({
    super.key,
    required this.title,
    required this.description,
    required this.child,
  });

  final String title;
  final String description;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Column(
        children: [
          ControlPanel(child: Text(description)),
          Expanded(child: child),
        ],
      ),
    );
  }
}

/// Visually separates native Flutter controls from the Zogo WebView.
class ControlPanel extends StatelessWidget {
  const ControlPanel({super.key, required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).colorScheme.surfaceContainerLow,
      child: Padding(padding: const EdgeInsets.all(16), child: child),
    );
  }
}

class CatalogItem {
  const CatalogItem({required this.id, required this.title, this.description});

  final String id;
  final String title;
  final String? description;
}

/// Native catalog shared by the module and skill deep-link examples.
class CatalogPage extends StatelessWidget {
  const CatalogPage({
    super.key,
    required this.title,
    required this.introduction,
    required this.items,
    required this.onSelected,
  });

  final String title;
  final String introduction;
  final List<CatalogItem> items;
  final ValueChanged<CatalogItem> onSelected;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(introduction, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 16),
          for (final item in items)
            Card(
              child: ListTile(
                contentPadding: const EdgeInsets.all(16),
                title: Text(item.title),
                subtitle: item.description == null
                    ? Text('ID: ${item.id}')
                    : Text(item.description!),
                trailing: const Icon(Icons.play_arrow),
                onTap: () => onSelected(item),
              ),
            ),
        ],
      ),
    );
  }
}
