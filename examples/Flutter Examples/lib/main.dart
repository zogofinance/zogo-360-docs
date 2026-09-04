import 'package:flutter/material.dart';

import 'example_pages.dart';
import 'home_page.dart';
import 'zogo_360_webview.dart';

void main() {
  runApp(const Zogo360ExampleApp());
}

class Zogo360ExampleApp extends StatelessWidget {
  const Zogo360ExampleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Zogo 360 Flutter Examples',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1C64F2)),
        useMaterial3: true,
      ),
      home: const HomePage(),
      // ZOGO_ROUTE makes a single example easy to launch directly while developing.
      initialRoute: const String.fromEnvironment(
        'ZOGO_ROUTE',
        defaultValue: '/',
      ),
      routes: {
        for (final example in ZogoExample.values)
          example.routeName: (_) => example.buildPage(initialZogoToken),
      },
    );
  }
}
