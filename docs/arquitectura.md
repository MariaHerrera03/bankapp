# Arquitectura

```mermaid
flowchart LR
  Android[Contenedor Android Kotlin] --> Login[LoginBundle]
  Android --> Home[HomeBundle]
  Android --> Transfer[TransferBundle]
  Android --> Movements[MovementsBundle]
  Login --> Bridge[SessionBridge]
  Home --> Bridge
  Transfer --> Bridge
  Movements --> Bridge
  Bridge --> Android
```

Cada bundle mantiene `screens/`, `services/` y `hooks/`. Los servicios contienen los datos de desarrollo y el manejo de errores; las pantallas solo coordinan estado y presentación. `shared/theme` contiene tokens visuales, contratos de dominio y el componente de movimiento reutilizable.

## Flujo principal

```mermaid
sequenceDiagram
  participant U as Usuario
  participant L as LoginBundle
  participant B as SessionBridge
  participant A as Android
  participant H as HomeBundle
  participant T as Transfer/Movements
  U->>L: Ingresa credenciales
  L->>B: LOGIN_SUCCESS(Session)
  B->>A: Guarda y enruta sesión
  A->>H: Carga User
  U->>H: Selecciona acción
  H->>B: OPEN_TRANSFER u OPEN_MOVEMENTS
  B->>T: Abre bundle solicitado
  T->>B: TRANSFER_SUCCESS o navegación
```

## Seguridad diseñada, pendiente de implementación

- La sesión debe guardarse con una clave del Android Keystore y `EncryptedSharedPreferences`; nunca en texto plano ni en logs.
- Los builds de producción deben activar ProGuard/R8 y conservar reglas mínimas para React Native y el bridge.
- La detección de root y emulador puede bloquear o elevar el nivel de autenticación, pero es una capa adicional y no reemplaza controles de servidor.
- `Session.expiresAt` define la expiración; Android debe validar ese valor al reanudar la app y emitir `SESSION_EXPIRED`.

El módulo Kotlin entregado es una prueba de concepto: recibe y registra eventos, pero todavía no implementa almacenamiento cifrado ni navegación completa entre raíces React Native.