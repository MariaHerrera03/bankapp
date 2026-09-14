package com.bankapp.bridge

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class SessionModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
  override fun getName() = "SessionBridge"

  @ReactMethod
  fun emitLoginSuccess(session: ReadableMap) {
    // Por ahora solo lo logueo. En una app real esto debería guardar la sesión de forma segura.
    Log.d("SessionBridge", "LOGIN_SUCCESS received for user ${session.getString("userId")}")
  }

  @ReactMethod
  fun emitEvent(event: ReadableMap) {
    Log.d("SessionBridge", "Event received: ${event.toString()}")
  }
}