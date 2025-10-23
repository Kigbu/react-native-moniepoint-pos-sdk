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
 */
export const ReceiptItemType = {
  TITLE: 'TITLE',
  KEY_VALUE: 'KEY_VALUE',
  ITEMS: 'ITEMS',
  SPACING: 'SPACING',
  SEPARATOR: 'SEPARATOR',
  QR: 'QR',
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
   * @param {string} amount - Payment amount (in kobo, e.g., "100000" for ₦1000.00)
   * @returns {Promise<string>} Payment result
   * 
   * @example
   * const result = await MoniepointPosSdk.makeCardPayment('100000');
   */
  static async makeCardPayment(amount) {
    return MoniepointPosModule.makeCardPayment(amount.toString());
  }
}

export default MoniepointPosSdk;

