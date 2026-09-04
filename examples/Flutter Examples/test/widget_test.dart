import 'package:flutter_test/flutter_test.dart';
import 'package:zogo_360_flutter_example/example_pages.dart';
import 'package:zogo_360_flutter_example/main.dart';
import 'package:zogo_360_flutter_example/zogo_360_webview.dart';

void main() {
  test('app exposes all six documented examples', () {
    expect(const Zogo360ExampleApp(), isA<Zogo360ExampleApp>());
    expect(ZogoExample.values, hasLength(6));
    expect(
      ZogoExample.values.map((example) => example.title),
      containsAll([
        '1. Basic Web Example',
        '2. Delayed Initialization',
        '3. Event Listeners',
        '4. Deep Link to a Module',
        '5. Deep Link to a Skill',
        '6. Advanced Customization',
      ]),
    );
  });

  test('deep-link configuration uses the documented message payload', () {
    const config = Zogo360Config(
      token: 'test-token',
      widgetType: 'deep_link',
      moduleId: '994850',
    );

    expect(config.toPayload(), {
      'user_auth_token': 'test-token',
      'widget_type': 'deep_link',
      'module_id': '994850',
    });
  });
}
