import 'package:flutter/material.dart';

import '../zogo_360_webview.dart';
import 'deep_link_page.dart';
import 'example_widgets.dart';

/// Equivalent to BasicJS example 5: choose and open a complete learning skill.
class SkillExamplePage extends StatelessWidget {
  const SkillExamplePage({super.key, required this.token});

  final String token;

  @override
  Widget build(BuildContext context) {
    return CatalogPage(
      title: 'Skill Deep Links',
      introduction:
          'Choose a complete learning path containing multiple modules.',
      items: const [
        CatalogItem(
          id: '1',
          title: 'Choose a Financial Institution',
          description: 'Learn how to evaluate banks and credit unions.',
        ),
        CatalogItem(
          id: '3',
          title: 'Apply for Credit',
          description: 'Understand credit applications and approval factors.',
        ),
      ],
      onSelected: (item) => openDeepLink(
        context,
        title: item.title,
        config: Zogo360Config(
          token: token,
          widgetType: 'deep_link',
          skillId: item.id,
        ),
      ),
    );
  }
}
