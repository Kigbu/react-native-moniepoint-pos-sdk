package com.moniepointpossdk

import android.util.Log
import com.facebook.react.bridge.*
import com.moniepoint.paap.MoniepointPaapSdk
import com.moniepoint.paap.receiptprinting.models.ReceiptItem
import com.moniepoint.paap.receiptprinting.models.ReceiptItemType
import com.moniepoint.paap.receiptprinting.models.RowItem

/**
 * React Native module for Moniepoint POS SDK integration. Provides access to card payment, receipt
 * printing, and terminal data services.
 */
class MoniepointPosModule(
        private val reactContext: ReactApplicationContext,
        private val moniepointPaapSdk: MoniepointPaapSdk
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "MoniepointPosModule"

  /** Get terminal information including terminal ID, serial number, and model */
  @ReactMethod
  fun getTerminalData(promise: Promise) {
    Log.d(TAG, "getTerminalData called")
    try {
      val terminalData = moniepointPaapSdk.terminalDataService.getTerminalInfo()
      val map =
              Arguments.createMap().apply {
                putString("terminalId", terminalData.terminalId ?: "")
                putString("serialNo", terminalData.serialNumber ?: "")
                putString("model", terminalData.model ?: "")
              }
      promise.resolve(map)
    } catch (e: Exception) {
      Log.e(TAG, "Error fetching terminal data", e)
      promise.reject("TERMINAL_DATA_ERROR", e.message, e)
    }
  }

  /**
   * Print receipt on POS terminal
   * @param items Array of receipt items to print
   */
  @ReactMethod
  fun printReceipt(items: ReadableArray, promise: Promise) {
    Log.d(TAG, "printReceipt called with ${items.size()} items")
    try {
      val receiptItems = parseReceiptItems(items)
      Log.d(TAG, "Parsed ${receiptItems.size} receipt items")

      moniepointPaapSdk.printerService.print(receiptItems)
      promise.resolve(null)
    } catch (e: Exception) {
      Log.e(TAG, "Error printing receipt", e)
      promise.reject("PRINT_ERROR", e.message, e)
    }
  }

  /**
   * Process card payment
   * @param amount Payment amount as string (in kobo, e.g., "100000" for ₦1000.00)
   */
  @ReactMethod
  fun makeCardPayment(amount: String, promise: Promise) {
    Log.d(TAG, "makeCardPayment called with amount: $amount")
    try {
      moniepointPaapSdk.cardPaymentService.makeCardPayment(amount) { result ->
        try {
          Log.d(TAG, "Card payment result: $result")
          promise.resolve(result.toString())
        } catch (e: Exception) {
          Log.e(TAG, "Error resolving card payment result", e)
          promise.reject("CARD_PAYMENT_RESULT_ERROR", e.message, e)
        }
      }
    } catch (e: Exception) {
      Log.e(TAG, "Error making card payment", e)
      promise.reject("CARD_PAYMENT_ERROR", e.message, e)
    }
  }

  /** Parse receipt items from JavaScript array to Kotlin list */
  private fun parseReceiptItems(items: ReadableArray): List<ReceiptItem> {
    val list = mutableListOf<ReceiptItem>()

    for (i in 0 until items.size()) {
      val obj = items.getMap(i) ?: continue
      val typeString = obj.getString("type") ?: continue

      val type =
              try {
                ReceiptItemType.valueOf(typeString)
              } catch (e: IllegalArgumentException) {
                Log.w(TAG, "Invalid receipt item type: $typeString")
                continue
              }

      when (type) {
        ReceiptItemType.ITEMS -> {
          val rows = obj.getArray("items")
          if (rows != null) {
            val rowList = parseRowItems(rows)
            list += ReceiptItem(type = type, items = rowList)
            Log.d(TAG, "Added ITEMS receipt item with ${rowList.size} rows")
          }
        }
        ReceiptItemType.SPACING, ReceiptItemType.SEPARATOR -> {
          list += ReceiptItem(type = type)
          Log.d(TAG, "Added ${type.name} receipt item")
        }
        ReceiptItemType.IMAGE -> {
          val value = obj.getString("value")
          if (!value.isNullOrEmpty()) {
            list += ReceiptItem(type = type, value = value)
            Log.d(TAG, "Added IMAGE receipt item (base64 encoded)")
          } else {
            Log.w(TAG, "IMAGE value is null or empty, skipping")
          }
        }
        ReceiptItemType.LABEL, ReceiptItemType.QR, ReceiptItemType.TITLE -> {
          val value = obj.getString("value")
          if (!value.isNullOrEmpty()) {
            list += ReceiptItem(type = type, value = value)
            Log.d(TAG, "Added ${type.name} receipt item with value: $value")
          } else {
            Log.w(TAG, "${type.name} value is null or empty, skipping")
          }
        }
        ReceiptItemType.KEY_VALUE -> {
          val key = if (obj.hasKey("key")) obj.getString("key") else null
          val value = if (obj.hasKey("value")) obj.getString("value") else null
          list += ReceiptItem(type = type, key = key, value = value)
          Log.d(TAG, "Added KEY_VALUE receipt item with key: $key, value: $value")
        }
      }
    }

    return list
  }

  /** Parse row items for table-style receipts */
  private fun parseRowItems(rows: ReadableArray): List<RowItem> {
    val rowList = mutableListOf<RowItem>()
    for (j in 0 until rows.size()) {
      val row = rows.getMap(j) ?: continue
      rowList +=
              RowItem(
                      qty = row.getString("qty") ?: "",
                      name = row.getString("name") ?: "",
                      price = row.getString("price") ?: "",
                      amount = row.getString("amount") ?: ""
              )
    }
    return rowList
  }

  companion object {
    private const val TAG = "MoniepointPosModule"
  }
}
