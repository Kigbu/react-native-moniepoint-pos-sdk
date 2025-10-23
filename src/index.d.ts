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
 */
export enum ReceiptItemType {
  /** Large centered text */
  TITLE = 'TITLE',
  /** Key-value pair with left-right alignment */
  KEY_VALUE = 'KEY_VALUE',
  /** Table of items with qty, name, price, and amount columns */
  ITEMS = 'ITEMS',
  /** Empty line spacing */
  SPACING = 'SPACING',
  /** Horizontal separator line */
  SEPARATOR = 'SEPARATOR',
  /** QR code */
  QR = 'QR',
}

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
   * @param amount Payment amount as string (in kobo, e.g., "100000" for ₦1000.00)
   * @returns Promise resolving to payment result string
   * @throws {Error} If payment fails or is cancelled
   */
  static makeCardPayment(amount: string): Promise<string>;
}

export default MoniepointPosSdk;

