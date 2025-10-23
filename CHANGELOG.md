# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- Initial release of react-native-moniepoint-pos-sdk
- Card payment processing via `makeCardPayment()`
- Receipt printing with QR code support via `printReceipt()`
- Terminal data retrieval via `getTerminalData()`
- TypeScript type definitions
- Comprehensive documentation and examples
- Support for multiple receipt item types (TITLE, KEY_VALUE, ITEMS, SPACING, SEPARATOR, QR)
- Secure credential management via gradle.properties
- Full error handling with specific error codes

### Features
- 💳 Process card payments on Moniepoint POS terminals
- 🖨️ Print formatted receipts with text, tables, and QR codes
- 📱 Access terminal information (ID, serial number, model)
- 🔒 Secure Maven repository credential configuration
- 📦 Easy React Native integration
- 🎯 TypeScript support with full type definitions

### Requirements
- React Native >= 0.70
- Android minSdkVersion >= 24
- Moniepoint POS SDK 1.0.10+
- Moniepoint POS terminal hardware

