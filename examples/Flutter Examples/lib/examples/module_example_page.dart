import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';
import 'deep_link_page.dart';
import 'example_widgets.dart';

/// Equivalent to BasicJS example 4: choose and open one documented module.
class ModuleExamplePage extends StatelessWidget {
  const ModuleExamplePage({super.key, required this.token});

  final String token;

  @override
  Widget build(BuildContext context) {
    return CatalogPage(
      title: 'Module Deep Links',
      introduction: 'Choose a single module to open directly.',
      items: const [
        CatalogItem(id: '994850', title: 'The Product Life Cycle'),
        CatalogItem(id: '1008545', title: 'Investing vs. Savings Goals'),
      ],
      onSelected: (item) => openDeepLink(
        context,
        title: item.title,
        config: Zogo360Config(
          token: token,
          widgetType: 'deep_link',
          moduleId: item.id,
        ),
      ),
    );
  }
}
