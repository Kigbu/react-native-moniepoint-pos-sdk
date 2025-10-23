# react-native-moniepoint-pos-sdk

[![npm version](https://badge.fury.io/js/react-native-moniepoint-pos-sdk.svg)](https://badge.fury.io/js/react-native-moniepoint-pos-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-Android-green.svg)](https://www.android.com/)
[![React Native](https://img.shields.io/badge/React%20Native-%3E%3D0.70-blue.svg)](https://reactnative.dev/)

React Native wrapper for the official **Moniepoint PaaP (POS-as-a-Platform) SDK**. Build powerful point-of-sale applications with card payment processing, customizable receipt printing with logos and QR codes, and terminal data access on Moniepoint POS terminals.

## 🚀 Features

- 💳 **Card Payment Processing** - Accept card payments directly on Moniepoint POS terminals
- 🖨️ **Receipt Printing** - Print branded receipts with logos, QR codes, and custom formatting
- 📱 **Terminal Data** - Access terminal ID, serial number, and device information
- 🎨 **8 Receipt Types** - IMAGE, LABEL, TITLE, KEY_VALUE, ITEMS, SPACING, SEPARATOR, QR
- 🔒 **Secure** - Credentials managed via local.properties (gitignored)
- 📦 **Easy Integration** - Simple API with full TypeScript support
- ✅ **Production-Ready** - Fully aligned with official Moniepoint PaaP SDK documentation

## 📱 Supported Use Cases

This SDK is perfect for building:

- 🛒 Retail POS applications
- 🏥 Healthcare & pharmacy billing systems
- 🚚 Logistics & delivery confirmation
- 🎓 School fees collection
- 💰 Tax & levy collection
- 🎟️ Event ticketing systems
- 🏛️ Government payment collection
- 📦 Any business requiring card payments and receipt printing

## 📦 Installation

```bash
npm install react-native-moniepoint-pos-sdk
# or
yarn add react-native-moniepoint-pos-sdk
```

## ⚙️ Configuration

### Step 1: Add Moniepoint Maven Credentials

Create or edit `android/local.properties` (this file is gitignored by default):

```properties
# Android SDK paths
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
ndk.dir=/Users/YOUR_USERNAME/Library/Android/sdk/ndk/27.1.12297006

# Moniepoint SDK Credentials
# Get these from: https://developer.moniepoint.com
moniepointRepoUrl=https://open-repository.moniepoint.com/repository/public
moniepointUsername=your_username_here
moniepointPassword=your_password_here
moniepointSdkVersion=1.0.10
```

> **⚠️ Important:** Never commit `local.properties` to version control! It's automatically gitignored.

### Step 2: Configure Gradle to Read Credentials

Update `android/build.gradle`:

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()

        // Moniepoint Maven Repository
        def localProperties = new Properties()
        def localPropertiesFile = rootProject.file('local.properties')
        if (localPropertiesFile.exists()) {
            localPropertiesFile.withInputStream { localProperties.load(it) }
        }

        def repoUrl = localProperties.getProperty('moniepointRepoUrl')
        def user = localProperties.getProperty('moniepointUsername')
        def pass = localProperties.getProperty('moniepointPassword')

        if (repoUrl && user && pass) {
            maven {
                url repoUrl
                credentials {
                    username user
                    password pass
                }
            }
        }
    }
}
```

### Step 3: Disable Autolinking

Create `react-native.config.js` in your project root:

```javascript
module.exports = {
  dependencies: {
    "react-native-moniepoint-pos-sdk": {
      platforms: {
        android: null, // Disable autolinking
        ios: null,
      },
    },
  },
};
```

### Step 4: Manual Linking in settings.gradle

Add to `android/settings.gradle`:

```gradle
include ':react-native-moniepoint-pos-sdk'
project(':react-native-moniepoint-pos-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-moniepoint-pos-sdk/android')
```

### Step 5: Add Dependencies

Update `android/app/build.gradle`:

```gradle
dependencies {
    // ... other dependencies

    // React Native Moniepoint POS SDK (manually linked)
    implementation project(':react-native-moniepoint-pos-sdk')

    // Moniepoint POS SDK
    implementation("com.moniepoint:paap.sdk:1.0.10")
    implementation 'com.google.code.gson:gson:2.11.0'
}
```

### Step 6: Initialize SDK in MainApplication

Edit `android/app/src/main/java/com/yourapp/MainApplication.kt`:

```kotlin
import com.moniepoint.paap.MoniepointPaapSdk
import com.moniepoint.paap.config.MoniepointPaapConfig
import com.moniepointpossdk.MoniepointPosPackage

class MainApplication : Application(), ReactApplication {

  companion object {
    private lateinit var moniepointPaapSdk: MoniepointPaapSdk
  }

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)

    // Initialize Moniepoint SDK
    val config = MoniepointPaapConfig.Builder()
      .enableSampleService(true)
      .enableCardPayment(true)
      .enablePosTransfer(true)
      .enablePrinting(true)
      .developerName("Your Company Name")
      .build()

    moniepointPaapSdk = MoniepointPaapSdk.initialize(this, config)
  }

  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Add Moniepoint POS SDK package
          add(MoniepointPosPackage(moniepointPaapSdk))
        }

      override fun getJSMainModuleName(): String = "index"
      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
    }
}
```

### Step 7: Initialize Card Payment in MainActivity

Edit `android/app/src/main/java/com/yourapp/MainActivity.kt`:

```kotlin
import com.moniepoint.paap.MoniepointPaapSdk

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "YourAppName"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Initialize Moniepoint Card Payment Service
    val sdk = MoniepointPaapSdk.instance()
    sdk.cardPaymentService.initializeCardPayment(this)
  }
}
```

## 🔧 Usage

### Basic Example

```typescript
import MoniepointPosSdk, {
  ReceiptItemType,
} from "react-native-moniepoint-pos-sdk";

// Get Terminal Information
async function getTerminalInfo() {
  try {
    const terminal = await MoniepointPosSdk.getTerminalData();
    console.log("Terminal ID:", terminal.terminalId);
    console.log("Serial No:", terminal.serialNo);
    console.log("Model:", terminal.model);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Process Card Payment
async function makePayment() {
  try {
    // Amount in Naira (e.g., "5000" for ₦5,000.00)
    const result = await MoniepointPosSdk.makeCardPayment("5000");
    console.log("Payment successful:", result);
  } catch (error) {
    console.error("Payment failed:", error.message);
  }
}

// Print Receipt with Logo and QR Code
async function printReceipt() {
  try {
    const logoBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB..."; // Your logo

    const receipt = [
      // Company Logo
      { type: ReceiptItemType.IMAGE, value: logoBase64 },
      { type: ReceiptItemType.SPACING },

      // Store Information (center-aligned)
      { type: ReceiptItemType.LABEL, value: "MY STORE LIMITED" },
      { type: ReceiptItemType.LABEL, value: "123 Main Street, Lagos" },
      { type: ReceiptItemType.LABEL, value: "Tel: +234-XXX-XXXX" },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.SEPARATOR },

      // Receipt Title (bold)
      { type: ReceiptItemType.TITLE, value: "PAYMENT RECEIPT" },
      { type: ReceiptItemType.SEPARATOR },
      { type: ReceiptItemType.SPACING },

      // Payment Details
      { type: ReceiptItemType.KEY_VALUE, key: "Amount:", value: "₦5,000.00" },
      { type: ReceiptItemType.KEY_VALUE, key: "Status:", value: "PAID" },
      { type: ReceiptItemType.KEY_VALUE, key: "Date:", value: "23/10/2025" },
      { type: ReceiptItemType.KEY_VALUE, key: "Ref:", value: "TXN123456" },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.SEPARATOR },
      { type: ReceiptItemType.SPACING },

      // QR Code
      { type: ReceiptItemType.QR, value: "https://mystore.com/receipt/123" },
      { type: ReceiptItemType.SPACING },

      // Footer (center-aligned)
      { type: ReceiptItemType.LABEL, value: "Thank you for your business!" },
      { type: ReceiptItemType.LABEL, value: "Powered by Moniepoint" },
    ];

    await MoniepointPosSdk.printReceipt(receipt);
    console.log("Receipt printed successfully!");
  } catch (error) {
    console.error("Print failed:", error.message);
  }
}
```

## 📖 API Reference

### `MoniepointPosSdk.getTerminalData()`

Get terminal information.

**Returns:** `Promise<TerminalData>`

```typescript
interface TerminalData {
  terminalId: string;
  serialNo: string;
  model: string;
}
```

**Example:**

```typescript
const terminal = await MoniepointPosSdk.getTerminalData();
console.log(terminal.terminalId); // "12345678"
```

---

### `MoniepointPosSdk.makeCardPayment(amount)`

Process a card payment on the POS terminal.

**Parameters:**

- `amount` (string | number) - Payment amount in Naira (e.g., "5000" for ₦5,000.00)

**Returns:** `Promise<string>` - Payment result with transaction details

**Example:**

```typescript
// Pay ₦5,000
const result = await MoniepointPosSdk.makeCardPayment("5000");
// or
const result = await MoniepointPosSdk.makeCardPayment(5000);
```

---

### `MoniepointPosSdk.printReceipt(items)`

Print a formatted receipt on the POS terminal.

**Parameters:**

- `items` (ReceiptItem[]) - Array of receipt items

**Returns:** `Promise<void>`

**Example:**

```typescript
await MoniepointPosSdk.printReceipt([
  { type: ReceiptItemType.TITLE, value: "RECEIPT" },
  { type: ReceiptItemType.KEY_VALUE, key: "Amount", value: "₦5,000" },
]);
```

## 🎨 Receipt Item Types

### IMAGE

Display a company logo or image (base64 encoded).

```typescript
{
  type: ReceiptItemType.IMAGE,
  value: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB...' // base64 string
}
```

### LABEL

Center-aligned text (perfect for store name, address, footer).

```typescript
{
  type: ReceiptItemType.LABEL,
  value: 'MY STORE LIMITED'
}
```

### TITLE

Bold, prominent text for headers.

```typescript
{
  type: ReceiptItemType.TITLE,
  value: 'PAYMENT RECEIPT'
}
```

### KEY_VALUE

Display key-value pairs (e.g., "Amount: ₦5,000").

```typescript
{
  type: ReceiptItemType.KEY_VALUE,
  key: 'Amount',
  value: '₦5,000.00'
}
```

### ITEMS

Table-style items with columns (qty, name, price, amount).

```typescript
{
  type: ReceiptItemType.ITEMS,
  items: [
    { qty: '2', name: 'Product A', price: '₦1,000', amount: '₦2,000' },
    { qty: '1', name: 'Product B', price: '₦3,000', amount: '₦3,000' }
  ]
}
```

### SPACING

Add vertical space between items.

```typescript
{
  type: ReceiptItemType.SPACING;
}
```

### SEPARATOR

Horizontal line separator.

```typescript
{
  type: ReceiptItemType.SEPARATOR;
}
```

### QR

QR code with encoded content.

```typescript
{
  type: ReceiptItemType.QR,
  value: 'https://mystore.com/receipt/123'
}
```

## 📘 TypeScript Support

Full TypeScript definitions included:

```typescript
import MoniepointPosSdk, {
  ReceiptItemType,
  ReceiptItem,
  TerminalData,
  RowItem,
} from "react-native-moniepoint-pos-sdk";

// Type-safe receipt items
const receipt: ReceiptItem[] = [
  { type: ReceiptItemType.TITLE, value: "RECEIPT" },
  { type: ReceiptItemType.KEY_VALUE, key: "Amount", value: "₦5,000" },
];
```

## 🧪 Example App

See a complete working example with all features:

**[react-native-moniepoint-pos-sdk-example-app](https://github.com/Kigbu/react-native-moniepoint-pos-sdk-example-app)**

The example app demonstrates:

- ✅ Terminal data retrieval
- ✅ Card payment processing
- ✅ Receipt printing with all 8 types
- ✅ Logo and QR code integration
- ✅ Error handling
- ✅ TypeScript usage

```bash
# Clone and run the example
git clone https://github.com/Kigbu/react-native-moniepoint-pos-sdk-example-app.git
cd react-native-moniepoint-pos-sdk-example-app
npm install

# Configure credentials in android/local.properties
cp android/local.properties.example android/local.properties
# Edit local.properties with your Moniepoint credentials

# Run on Android
npx react-native run-android
```

## 🔒 Security Best Practices

### 1. Never Commit Credentials

Your `.gitignore` should include:

```gitignore
# Never commit credentials
android/local.properties
```

### 2. Use local.properties Template

Provide a template file for other developers:

**`android/local.properties.example`:**

```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
ndk.dir=/Users/YOUR_USERNAME/Library/Android/sdk/ndk/27.1.12297006

# Moniepoint credentials (replace with actual values)
moniepointRepoUrl=https://open-repository.moniepoint.com/repository/public
moniepointUsername=your_username_here
moniepointPassword=your_password_here
moniepointSdkVersion=1.0.10
```

### 3. Document Setup in README

````markdown
## Setup

1. Copy the template:
   ```bash
   cp android/local.properties.example android/local.properties
   ```
````

2. Edit `android/local.properties` with your Moniepoint credentials

3. Run the app:
   ```bash
   npx react-native run-android
   ```

```

## 🆘 Troubleshooting

### Build Error: "Could not resolve com.moniepoint:paap.sdk"

**Cause:** Moniepoint credentials not configured

**Solution:**
1. Verify `android/local.properties` exists
2. Check credentials are correct
3. Ensure no extra spaces in properties file
4. Run `cd android && ./gradlew clean && cd ..`

---

### Build Error: "Unresolved reference MoniepointPosPackage"

**Cause:** Native module not linked correctly

**Solution:**
1. Check `settings.gradle` includes the SDK module
2. Verify `app/build.gradle` has the dependency
3. Ensure `react-native.config.js` disables autolinking
4. Clean and rebuild: `cd android && ./gradlew clean && cd ..`

---

### Runtime Error: "MoniepointPosModule is not available"

**Cause:** SDK not initialized properly

**Solution:**
1. Verify `MainApplication.kt` initializes the SDK in `onCreate()`
2. Check `MoniepointPosPackage` is added to `getPackages()`
3. Ensure `MainActivity.kt` initializes card payment service
4. Rebuild the app completely

---

### Payment/Print Error: "Terminal not ready"

**Cause:** Testing on emulator or terminal not initialized

**Solution:**
- These features require a **physical Moniepoint POS terminal**
- Terminal data will work on emulator (returns test values)
- Card payment and printing only work on actual hardware

## ⚠️ Requirements

- **React Native:** >= 0.70.0
- **Android API Level:** 24+ (Android 7.0+)
- **Moniepoint POS Terminal:** Model P8 (for payment/printing features)
- **Moniepoint Developer Account:** Get credentials from [developer.moniepoint.com](https://developer.moniepoint.com)

## 📋 Compatibility Matrix

| SDK Version | React Native | Moniepoint PaaP SDK | Android API | Kotlin |
|------------|--------------|---------------------|-------------|--------|
| 1.0.1      | >=0.70.0     | 1.0.10             | 24+         | 2.0+   |
| 1.0.0      | >=0.70.0     | 1.0.10             | 24+         | 2.0+   |

## 📝 Changelog

### v1.0.1 (Latest)

**Added:**
- ✅ IMAGE receipt type (base64 logos)
- ✅ LABEL receipt type (center-aligned text)
- ✅ Enhanced documentation with examples

**Changed:**
- 📝 Clarified payment amount format (Naira, not kobo)
- 🔧 Improved TypeScript definitions

**Fixed:**
- 🐛 Receipt item type handling for IMAGE and LABEL

### v1.0.0

**Initial Release:**
- 💳 Card payment processing
- 🖨️ Receipt printing (6 types)
- 📱 Terminal data access
- 📘 TypeScript support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Example App:** [GitHub](https://github.com/Kigbu/react-native-moniepoint-pos-sdk-example-app)
- **NPM Package:** [react-native-moniepoint-pos-sdk](https://www.npmjs.com/package/react-native-moniepoint-pos-sdk)
- **Official Moniepoint Docs:** [developer.moniepoint.com](https://developer.moniepoint.com)
- **Issue Tracker:** [GitHub Issues](https://github.com/YOUR_USERNAME/react-native-moniepoint-pos-sdk/issues)

## 💬 Support

- **GitHub Issues:** Report bugs and request features
- **Example App:** See working implementation
- **Official Docs:** Moniepoint developer portal

## 🌟 Show Your Support

If this SDK helps you build amazing POS applications, please give it a ⭐️ on GitHub!

---

**Built with ❤️ for the Moniepoint developer community**

Empowering businesses across Nigeria with POS solutions 🇳🇬
```
