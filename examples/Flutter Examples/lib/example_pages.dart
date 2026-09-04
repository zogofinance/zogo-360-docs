import 'package:flutter/material.dart';

import 'examples/advanced_example_page.dart';
import 'examples/basic_example_page.dart';
import 'examples/delayed_example_page.dart';
import 'examples/events_example_page.dart';
import 'examples/module_example_page.dart';
import 'examples/skill_example_page.dart';

/// Registry used by the home menu and named development routes.
enum ZogoExample {
  basic(
    routeName: '/basic',
    title: '1. Basic Web Example',
    description: 'Automatically initialize the complete Zogo 360 experience.',
    icon: Icons.play_circle_outline,
  ),
  delayed(
    routeName: '/delayed',
    title: '2. Delayed Initialization',
    description: 'Wait for explicit user consent before initializing Zogo.',
    icon: Icons.timer_outlined,
  ),
  events(
    routeName: '/events',
    title: '3. Event Listeners',
    description:
        'Inspect initialization, navigation, URL, sound, and error events.',
    icon: Icons.list_alt,
  ),
  module(
    routeName: '/module',
    title: '4. Deep Link to a Module',
    description:
        'Open one of the example modules directly and handle its exit.',
    icon: Icons.menu_book_outlined,
  ),
  skill(
    routeName: '/skill',
    title: '5. Deep Link to a Skill',
    description: 'Launch a complete multi-module learning skill.',
    icon: Icons.school_outlined,
  ),
  advanced(
    routeName: '/advanced',
    title: '6. Advanced Customization',
    description: 'Apply light, dark, or default CSS while Zogo is running.',
    icon: Icons.palette_outlined,
  );

  const ZogoExample({
    required this.routeName,
    required this.title,
    required this.description,
    required this.icon,
  });

  final String routeName;
  final String title;
  final String description;
  final IconData icon;

  Widget buildPage(String token) => switch (this) {
    basic => BasicExamplePage(token: token),
    delayed => DelayedExamplePage(token: token),
    events => EventsExamplePage(token: token),
    module => ModuleExamplePage(token: token),
    skill => SkillExamplePage(token: token),
    advanced => AdvancedExamplePage(token: token),
  };
}
