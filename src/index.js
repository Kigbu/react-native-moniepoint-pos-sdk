import { NativeModules } from 'react-native';

const { MoniepointPosModule } = NativeModules;

if (!MoniepointPosModule) {
  throw new Error(
    'MoniepointPosModule is not available. Make sure:\n' +
    '1. You have added MoniepointPosPackage to your MainApplication\n' +
    '2. You have initialized MoniepointPaapSdk in your MainApplication\n' +
    '3. You have configured Maven credentials in gradle.properties'
  );
}

/**
 * Receipt item types supported by Moniepoint POS SDK
 * Based on official Moniepoint PaaP SDK documentation
 */
export const ReceiptItemType = {
  IMAGE: 'IMAGE',        // Image file in base64
  LABEL: 'LABEL',        // Text aligned at the center of the receipt
  TITLE: 'TITLE',        // A title or subtitle, a bold label
  KEY_VALUE: 'KEY_VALUE', // Displayed in pairs (Key: Value)
  ITEMS: 'ITEMS',        // Table-style items with qty, name, price, amount
  SPACING: 'SPACING',    // Vertical spacing between rows
  SEPARATOR: 'SEPARATOR', // Line separator between sections
  QR: 'QR',              // QR code with encoded content
};

/**
 * Moniepoint POS SDK wrapper for React Native
 */
export class MoniepointPosSdk {
  /**
   * Get terminal information
   * @returns {Promise<{terminalId: string, serialNo: string, model: string}>}
   */
  static async getTerminalData() {
    return MoniepointPosModule.getTerminalData();
  }

  /**
   * Print receipt on POS terminal
   * @param {Array<ReceiptItem>} items - Array of receipt items to print
   * @returns {Promise<void>}
   *
   * @example
   * await MoniepointPosSdk.printReceipt([
   *   { type: ReceiptItemType.TITLE, value: 'RECEIPT' },
   *   { type: ReceiptItemType.KEY_VALUE, key: 'Amount:', value: '₦1,000' }
   * ]);
   */
  static async printReceipt(items) {
    return MoniepointPosModule.printReceipt(items);
  }

  /**
   * Process card payment
   * @param {string|number} amount - Payment amount in Naira (e.g., "5000" or 5000 for ₦5,000.00)
   * @returns {Promise<string>} Payment result with transaction details
   *
   * @example
   * // Pay ₦5,000
   * const result = await MoniepointPosSdk.makeCardPayment('5000');
   * // or
   * const result = await MoniepointPosSdk.makeCardPayment(5000);
   */
  static async makeCardPayment(amount) {
    return MoniepointPosModule.makeCardPayment(amount.toString());
  }
}

export default MoniepointPosSdk;

