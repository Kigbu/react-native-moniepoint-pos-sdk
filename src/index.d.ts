/**
 * Terminal information returned by the POS device
 */
export interface TerminalData {
  /** Terminal ID assigned to the device */
  terminalId: string;
  /** Serial number of the POS terminal */
  serialNo: string;
  /** Model of the POS terminal */
  model: string;
}

/**
 * Receipt item types supported by Moniepoint POS SDK
 * Based on official Moniepoint PaaP SDK documentation
 */
export type ReceiptItemType = 'IMAGE' | 'LABEL' | 'TITLE' | 'KEY_VALUE' | 'ITEMS' | 'SPACING' | 'SEPARATOR' | 'QR';

/**
 * Receipt item type constants
 */
export const ReceiptItemType: {
  /** Image file in base64 format (e.g., company logo) */
  readonly IMAGE: 'IMAGE';
  /** Text aligned at the center of the receipt */
  readonly LABEL: 'LABEL';
  /** A title or subtitle, displayed as bold text */
  readonly TITLE: 'TITLE';
  /** Displayed in pairs (e.g., "Amount: ₦10,000") */
  readonly KEY_VALUE: 'KEY_VALUE';
  /** Table-style items with qty, name, price, amount columns */
  readonly ITEMS: 'ITEMS';
  /** Vertical spacing between rows */
  readonly SPACING: 'SPACING';
  /** Line separator between sections */
  readonly SEPARATOR: 'SEPARATOR';
  /** QR code with encoded content */
  readonly QR: 'QR';
};

/**
 * Row item for table-style receipts
 */
export interface RowItem {
  /** Quantity of the item */
  qty: string;
  /** Name/description of the item */
  name: string;
  /** Unit price of the item */
  price: string;
  /** Total amount for this row */
  amount: string;
}

/**
 * Receipt item configuration
 */
export interface ReceiptItem {
  /** Type of receipt item */
  type: ReceiptItemType;
  /** Key for KEY_VALUE type */
  key?: string;
  /** Value for TITLE, KEY_VALUE, or QR types */
  value?: string;
  /** Row items for ITEMS type */
  items?: RowItem[];
}

/**
 * Moniepoint POS SDK wrapper for React Native
 *
 * @example
 * import MoniepointPosSdk, { ReceiptItemType } from 'react-native-moniepoint-pos-sdk';
 *
 * // Get terminal data
 * const terminal = await MoniepointPosSdk.getTerminalData();
 *
 * // Process payment
 * const result = await MoniepointPosSdk.makeCardPayment('100000');
 *
 * // Print receipt
 * await MoniepointPosSdk.printReceipt([
 *   { type: ReceiptItemType.TITLE, value: 'RECEIPT' }
 * ]);
 */
export declare class MoniepointPosSdk {
  /**
   * Get terminal information including terminal ID, serial number, and model
   * @returns Promise resolving to terminal data
   * @throws {Error} If terminal data cannot be retrieved
   */
  static getTerminalData(): Promise<TerminalData>;

  /**
   * Print receipt on POS terminal
   * @param items Array of receipt items to print
   * @returns Promise resolving when print is complete
   * @throws {Error} If printing fails
   */
  static printReceipt(items: ReceiptItem[]): Promise<void>;

  /**
   * Process card payment on POS terminal
   * @param amount Payment amount in Naira (e.g., "5000" or 5000 for ₦5,000.00)
   * @returns Promise resolving to payment result string with transaction details
   * @throws {Error} If payment fails or is cancelled
   *
   * @example
   * // Pay ₦5,000
   * const result = await MoniepointPosSdk.makeCardPayment('5000');
   * // or
   * const result = await MoniepointPosSdk.makeCardPayment(5000);
   */
  static makeCardPayment(amount: string | number): Promise<string>;
}

export default MoniepointPosSdk;

