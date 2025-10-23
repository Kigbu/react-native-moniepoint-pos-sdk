# react-native-moniepoint-pos-sdk

React Native wrapper for Moniepoint POS SDK. Enables card payments, receipt printing, and terminal data access on Moniepoint POS terminals.

## 🚀 Features

- 💳 **Card Payment Processing** - Process card payments directly on POS terminal
- 🖨️ **Receipt Printing** - Print formatted receipts with QR codes
- 📱 **Terminal Data** - Access terminal information (ID, serial number, model)
- 🔒 **Secure** - Credentials managed via gradle.properties
- 📦 **Easy Integration** - Simple API with TypeScript support

## 📦 Installation

```bash
npm install react-native-moniepoint-pos-sdk
# or
yarn add react-native-moniepoint-pos-sdk
```

## ⚙️ Configuration

### Step 1: Add Moniepoint Maven Credentials

Create or edit `android/gradle.properties`:

```properties
# Moniepoint Repository Configuration
moniepointRepoUrl=https://open-repository.moniepoint.com/repository/public
moniepointUsername=your_username_here
moniepointPassword=your_password_here
moniepointSdkVersion=1.0.10
```

> **Note:** Never commit `gradle.properties` with credentials to version control. Add it to `.gitignore`.

### Step 2: Initialize SDK in MainApplication

Edit `android/app/src/main/java/your/package/MainApplication.kt`:

```kotlin
import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.PackageList
import com.moniepointpossdk.MoniepointPosPackage
import com.moniepoint.paap.MoniepointPaapSdk
import com.moniepoint.paap.config.MoniepointPaapConfig

class MainApplication : Application(), ReactApplication {

  companion object {
    lateinit var moniepointPaapSdk: MoniepointPaapSdk
  }

  override fun onCreate() {
    super.onCreate()
    
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
          // Add Moniepoint POS package
          add(MoniepointPosPackage(moniepointPaapSdk))
        }
      // ... other configurations
    }
}
```

### Step 3: Initialize Card Payment in MainActivity

Edit `android/app/src/main/java/your/package/MainActivity.kt`:

```kotlin
import android.os.Bundle
import com.facebook.react.ReactActivity

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Initialize card payment service
    val sdk = MainApplication.moniepointPaapSdk
    sdk.cardPaymentService.initializeCardPayment(this)
  }
}
```

## 📖 Usage

### Import the SDK

```typescript
import MoniepointPosSdk, { ReceiptItemType } from 'react-native-moniepoint-pos-sdk';
```

### Get Terminal Data

```typescript
const getTerminalInfo = async () => {
  try {
    const terminalData = await MoniepointPosSdk.getTerminalData();
    console.log('Terminal ID:', terminalData.terminalId);
    console.log('Serial No:', terminalData.serialNo);
    console.log('Model:', terminalData.model);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Process Card Payment

```typescript
const processPayment = async (amount: number) => {
  try {
    // Amount should be in kobo (100 kobo = ₦1)
    const amountInKobo = (amount * 100).toString();
    const result = await MoniepointPosSdk.makeCardPayment(amountInKobo);
    
    console.log('Payment successful:', result);
    return result;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};

// Example: Process ₦1,000 payment
await processPayment(1000); // Will charge ₦1,000.00
```

### Print Receipt

```typescript
const printPaymentReceipt = async (invoiceData) => {
  try {
    const receiptItems = [
      {
        type: ReceiptItemType.TITLE,
        value: 'YOUR COMPANY NAME',
      },
      {
        type: ReceiptItemType.TITLE,
        value: 'PAYMENT RECEIPT',
      },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.SEPARATOR },
      { type: ReceiptItemType.SPACING },
      {
        type: ReceiptItemType.KEY_VALUE,
        key: 'Invoice No:',
        value: invoiceData.invoiceNo,
      },
      {
        type: ReceiptItemType.KEY_VALUE,
        key: 'Customer:',
        value: invoiceData.customerName,
      },
      {
        type: ReceiptItemType.KEY_VALUE,
        key: 'Date:',
        value: new Date().toLocaleDateString(),
      },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.SEPARATOR },
      {
        type: ReceiptItemType.TITLE,
        value: `AMOUNT: ₦${invoiceData.amount.toLocaleString()}`,
      },
      { type: ReceiptItemType.SEPARATOR },
      { type: ReceiptItemType.SPACING },
      {
        type: ReceiptItemType.QR,
        value: `https://yourwebsite.com/invoice/${invoiceData.invoiceNo}`,
      },
    ];

    await MoniepointPosSdk.printReceipt(receiptItems);
    console.log('Receipt printed successfully');
  } catch (error) {
    console.error('Print error:', error);
  }
};
```

### Print Receipt with Items Table

```typescript
const printSalesReceipt = async () => {
  const receiptItems = [
    { type: ReceiptItemType.TITLE, value: 'SALES RECEIPT' },
    { type: ReceiptItemType.SPACING },
    {
      type: ReceiptItemType.ITEMS,
      items: [
        {
          qty: '2',
          name: 'Product A',
          price: '₦500.00',
          amount: '₦1,000.00',
        },
        {
          qty: '1',
          name: 'Product B',
          price: '₦300.00',
          amount: '₦300.00',
        },
        {
          qty: '3',
          name: 'Product C',
          price: '₦200.00',
          amount: '₦600.00',
        },
      ],
    },
    { type: ReceiptItemType.SEPARATOR },
    {
      type: ReceiptItemType.KEY_VALUE,
      key: 'SUBTOTAL:',
      value: '₦1,900.00',
    },
    {
      type: ReceiptItemType.KEY_VALUE,
      key: 'TAX (7.5%):',
      value: '₦142.50',
    },
    { type: ReceiptItemType.SEPARATOR },
    {
      type: ReceiptItemType.TITLE,
      value: 'TOTAL: ₦2,042.50',
    },
  ];

  await MoniepointPosSdk.printReceipt(receiptItems);
};
```

## 📋 Receipt Item Types

| Type | Description | Required Fields |
|------|-------------|----------------|
| `TITLE` | Large centered text | `value` |
| `KEY_VALUE` | Key-value pair (left-right) | `key`, `value` |
| `ITEMS` | Table of items | `items` (array of RowItem) |
| `SPACING` | Empty line | None |
| `SEPARATOR` | Horizontal line | None |
| `QR` | QR code | `value` (URL or text) |

## 🔧 Complete Integration Example

```typescript
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import MoniepointPosSdk, { ReceiptItemType } from 'react-native-moniepoint-pos-sdk';

export default function PaymentScreen() {
  const [terminalInfo, setTerminalInfo] = useState(null);

  const handleGetTerminalInfo = async () => {
    try {
      const info = await MoniepointPosSdk.getTerminalData();
      setTerminalInfo(info);
      Alert.alert('Success', `Terminal: ${info.terminalId}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleMakePayment = async () => {
    try {
      // Process ₦1,000 payment (100000 kobo)
      const result = await MoniepointPosSdk.makeCardPayment('100000');
      
      Alert.alert('Payment Successful', result);
      
      // Print receipt after successful payment
      await printReceipt();
    } catch (error) {
      Alert.alert('Payment Failed', error.message);
    }
  };

  const printReceipt = async () => {
    const receipt = [
      { type: ReceiptItemType.TITLE, value: 'MY STORE' },
      { type: ReceiptItemType.TITLE, value: 'PAYMENT RECEIPT' },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.SEPARATOR },
      { type: ReceiptItemType.KEY_VALUE, key: 'Amount:', value: '₦1,000.00' },
      { type: ReceiptItemType.KEY_VALUE, key: 'Status:', value: 'PAID' },
      { type: ReceiptItemType.SPACING },
      { type: ReceiptItemType.QR, value: 'https://mystore.com/receipt/123' },
    ];

    await MoniepointPosSdk.printReceipt(receipt);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Get Terminal Info" onPress={handleGetTerminalInfo} />
      {terminalInfo && (
        <Text>Terminal ID: {terminalInfo.terminalId}</Text>
      )}
      <Button title="Make Payment" onPress={handleMakePayment} />
    </View>
  );
}
```

## ⚠️ Error Handling

```typescript
try {
  await MoniepointPosSdk.makeCardPayment('100000');
} catch (error) {
  switch (error.code) {
    case 'CARD_PAYMENT_ERROR':
      // Payment initialization failed
      console.error('Payment error:', error.message);
      break;
    case 'CARD_PAYMENT_RESULT_ERROR':
      // Payment result processing failed
      console.error('Result error:', error.message);
      break;
    case 'PRINT_ERROR':
      // Printing failed
      console.error('Print error:', error.message);
      break;
    case 'TERMINAL_DATA_ERROR':
      // Terminal data retrieval failed
      console.error('Terminal error:', error.message);
      break;
    default:
      console.error('Unknown error:', error.message);
  }
}
```

## 🛠️ Requirements

- React Native >= 0.70
- Android minSdkVersion >= 24
- Moniepoint POS SDK credentials (username & password)
- Moniepoint-compatible POS terminal

## 📝 Notes

- **Amount Format**: Always pass amounts as strings in kobo (100 kobo = ₦1)
  - Example: ₦1,000.00 = "100000"
  - Example: ₦50.00 = "5000"
- **Credentials Security**: Never commit credentials to version control
- **Terminal Requirement**: This SDK only works on Moniepoint POS terminals
- **QR Codes**: QR values can be URLs or any text string

## 🤝 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/yourusername/react-native-moniepoint-pos-sdk/issues)
- Contact: your-email@example.com

## 📄 License

MIT

## 👨‍💻 Author

I-Tech Platform Limited

---

**Built with ❤️ for the React Native community**

