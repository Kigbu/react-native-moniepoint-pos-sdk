package com.moniepointpossdk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.moniepoint.paap.MoniepointPaapSdk

/**
 * React Native package for Moniepoint POS SDK Requires initialized MoniepointPaapSdk instance to be
 * passed from the host app
 */
class MoniepointPosPackage(private val sdk: MoniepointPaapSdk) : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(MoniepointPosModule(reactContext, sdk))
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return emptyList()
  }
}

