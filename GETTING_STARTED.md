# Getting Started with react-native-moniepoint-pos-sdk

This guide will help you quickly integrate Moniepoint POS SDK into your React Native application.

## 📋 Prerequisites

Before you begin, ensure you have:

1. ✅ React Native project (>= 0.70)
2. ✅ Moniepoint Maven repository credentials (username & password)
3. ✅ Moniepoint POS terminal for testing
4. ✅ Android development environment set up

## 🚀 Quick Start (5 Steps)

### Step 1: Install the Package

```bash
npm install react-native-moniepoint-pos-sdk
# or
yarn add react-native-moniepoint-pos-sdk
```

### Step 2: Add Maven Credentials

Edit or create `android/gradle.properties`:

```properties
# Moniepoint Configuration
moniepointRepoUrl=https://open-repository.moniepoint.com/repository/public
moniepointUsername=YOUR_USERNAME_HERE
moniepointPassword=YOUR_PASSWORD_HERE
moniepointSdkVersion=1.0.10
```

> ⚠️ **Security Note:** Add `gradle.properties` to your `.gitignore` to avoid committing credentials!

### Step 3: Initialize SDK in MainApplication

Edit `android/app/src/main/java/[your-package]/MainApplication.kt`:

```kotlin
import com.moniepointpossdk.MoniepointPosPackage
import com.moniepoint.paap.MoniepointPaapSdk
import com.moniepoint.paap.config.MoniepointPaapConfig

class MainApplication : Application(), ReactApplication {

  companion object {
    lateinit var moniepointPaapSdk: MoniepointPaapSdk
  }

  override fun onCreate() {
    super.onCreate()
    // ... your existing code ...
    
    // Initialize Moniepoint SDK
    val config = MoniepointPaapConfig.Builder()
      .enableSampleService(true)
      .enableCardPayment(true)
      .enablePosTransfer(true)
      .enablePrinting(true)
      .developerName("Your Company Name")  // Replace with your company name
      .build()
      
    moniepointPaapSdk = MoniepointPaapSdk.initialize(this, config)
  }

  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Add Moniepoint package
          add(MoniepointPosPackage(moniepointPaapSdk))
        }
      // ... rest of your configuration
    }
}
```

### Step 4: Initialize Card Payment in MainActivity

Edit `android/app/src/main/java/[your-package]/MainActivity.kt`:

```kotlin
class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Initialize card payment service
    val sdk = MainApplication.moniepointPaapSdk
    sdk.cardPaymentService.initializeCardPayment(this)
  }
}
```

### Step 5: Use in Your React Native Code

```typescript
import MoniepointPosSdk, { ReceiptItemType } from 'react-native-moniepoint-pos-sdk';

// Get terminal info
const terminal = await MoniepointPosSdk.getTerminalData();
console.log('Terminal:', terminal.terminalId);

// Process payment (amount in kobo)
const result = await MoniepointPosSdk.makeCardPayment('100000'); // ₦1,000

// Print receipt
await MoniepointPosSdk.printReceipt([
  { type: ReceiptItemType.TITLE, value: 'RECEIPT' },
  { type: ReceiptItemType.KEY_VALUE, key: 'Amount:', value: '₦1,000.00' },
]);
```

## ✅ Verification

Test your integration with this simple component:

```typescript
import React from 'react';
import { View, Button, Alert } from 'react-native';
import MoniepointPosSdk from 'react-native-moniepoint-pos-sdk';

export default function TestScreen() {
  const testIntegration = async () => {
    try {
      // Test 1: Get terminal data
      const terminal = await MoniepointPosSdk.getTerminalData();
      Alert.alert('Success', `Terminal ID: ${terminal.terminalId}`);
      
      // Test 2: Process small payment
      const result = await MoniepointPosSdk.makeCardPayment('100'); // ₦1
      Alert.alert('Payment Success', result);
      
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Test Integration" onPress={testIntegration} />
    </View>
  );
}
```

## 🐛 Troubleshooting

### Issue: "MoniepointPosModule is not available"

**Solution:**
1. Ensure you've added `MoniepointPosPackage` to `getPackages()` in MainApplication
2. Clean and rebuild: `cd android && ./gradlew clean && cd ..`
3. Reinstall the app

### Issue: Maven credentials error

**Solution:**
1. Double-check credentials in `gradle.properties`
2. Ensure the file is in the `android/` directory
3. No extra spaces in property values

### Issue: Card payment not initializing

**Solution:**
1. Ensure `initializeCardPayment()` is called in `MainActivity.onCreate()`
2. Check that you're running on a physical Moniepoint POS terminal

### Issue: Print not working

**Solution:**
1. Verify terminal has paper
2. Check that printing is enabled in config: `.enablePrinting(true)`
3. Ensure receipt items are properly formatted

## 📚 Next Steps

- Read the [full documentation](./README.md)
- Check out [usage examples](./README.md#-usage)
- See [error handling guide](./README.md#️-error-handling)

## 💡 Pro Tips

1. **Amount Format**: Always use kobo (100 kobo = ₦1)
   ```typescript
   // ✅ Correct
   await MoniepointPosSdk.makeCardPayment('100000'); // ₦1,000
   
   // ❌ Wrong
   await MoniepointPosSdk.makeCardPayment('1000'); // This is ₦10
   ```

2. **Error Handling**: Always wrap SDK calls in try-catch
   ```typescript
   try {
     await MoniepointPosSdk.makeCardPayment(amount);
   } catch (error) {
     // Handle error appropriately
   }
   ```

3. **QR Codes**: Use full URLs for best results
   ```typescript
   {
     type: ReceiptItemType.QR,
     value: 'https://yourwebsite.com/receipt/123' // Full URL
   }
   ```

## 🤝 Support

Need help? Contact us:
- GitHub Issues: [Report an issue](https://github.com/yourusername/react-native-moniepoint-pos-sdk/issues)
- Email: support@yourcompany.com

---

Happy coding! 🎉

