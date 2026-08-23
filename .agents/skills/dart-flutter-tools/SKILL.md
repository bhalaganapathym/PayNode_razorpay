---
name: dart-flutter-tools
description: Dart and Flutter mobile & desktop cross-platform application development tools and patterns.
---

# Dart & Flutter Engineering Skill

Workflows, design patterns, and debugging guidelines for building production-grade Flutter cross-platform applications.

## Key Focus Areas
1. **Architecture & State Management**: BLoC, Riverpod, and Provider patterns.
2. **Payment Integrations**: Razorpay Flutter SDK checkout integration and webhook verification.
3. **Responsive UI**: Adaptive layouts for iOS, Android, macOS, and Windows.
4. **Networking**: Clean HTTP/Dio client layers with interceptors, token refresh, and retry policies.

## Razorpay Flutter Payment Flow Example

```dart
import 'package:flutter/material.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';

class PaymentScreen extends StatefulWidget {
  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late Razorpay _razorpay;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  void openCheckout(String orderId, int amountPaise) {
    var options = {
      'key': 'rzp_test_xxxx',
      'amount': amountPaise,
      'name': 'PayNode Store',
      'order_id': orderId,
      'description': 'Autonomous Commerce Order',
      'timeout': 180,
      'prefill': {'contact': '9876543210', 'email': 'buyer@paynode.ai'}
    };

    try {
      _razorpay.open(options);
    } catch (e) {
      debugPrint('Error: $e');
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    debugPrint("Payment Success: ${response.paymentId}");
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    debugPrint("Payment Error: ${response.code} - ${response.message}");
  }

  void _handleExternalWallet(ExternalWalletResponse response) {}

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('PayNode Mobile Checkout')),
      body: Center(child: Text('Razorpay Rails Active')),
    );
  }
}
```
