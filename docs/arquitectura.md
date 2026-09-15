# Arquitectura

```mermaid
flowchart LR
  Android[Capa nativa] --> Login[LoginBundle]
  Android --> Home[HomeBundle]
  Android --> Transfer[TransferBundle]
  Android --> Movements[MovementsBundle]

  Login --> Bridge[SessionBridge]
  Home --> Bridge
  Transfer --> Bridge
  Movements --> Bridge

  Bridge --> Android
```

La aplicación está organizada en cuatro bundles independientes de React Native: Login,
Home, Transferencia y Movimientos.

Cada bundle mantiene su propia estructura de `screens/`, `services/` y `hooks/`. Los
servicios manejan los datos de desarrollo y los errores, mientras que las pantallas se
encargan principalmente de la presentación y coordinación del estado.

`shared/theme` centraliza los estilos, tokens visuales y contratos de datos compartidos
entre los bundles.

## Flujo principal

```mermaid
sequenceDiagram
  participant U as Usuario
  participant L as LoginBundle
  participant B as SessionBridge
  participant A as Capa nativa
  participant H as HomeBundle
  participant T as Transfer/Movements

  U->>L: Ingresa credenciales
  L->>B: LOGIN_SUCCESS(Session)
  B->>A: Envía sesión
  A->>H: Carga datos de usuario
  U->>H: Selecciona acción
  H->>B: OPEN_TRANSFER / OPEN_MOVEMENTS
  B->>A: Solicita navegación
  A->>T: Carga bundle solicitado
  T->>B: TRANSFER_SUCCESS (si aplica)
  Note over T: El movimiento se registra y queda disponible para Movimientos
```

## Expiración de sesión

```mermaid
sequenceDiagram
  participant U as Usuario
  participant P as PreviewApp (simula la capa nativa en desarrollo)
  participant B as SessionBridge
  participant H as Bundle activo

  P->>P: Inicia temporizador al recibir LOGIN_SUCCESS
  Note over P: La sesión se mantiene mientras el usuario navega entre bundles
  P->>B: Al cumplirse el tiempo, emite SESSION_EXPIRED
  B->>H: SESSION_EXPIRED llega al bundle activo
  H->>U: Muestra "Tu sesión expiró, ingresa de nuevo"
  H->>B: Emite LOGOUT tras un breve retraso
  B->>P: LOGOUT recibido
  P->>U: Regresa a Login
```

En desarrollo, `PreviewApp.tsx` simula el rol que tendría la capa nativa: controla la
duración de la sesión y reacciona a su expiración. En una implementación completa, esta
responsabilidad debería trasladarse a la capa nativa para centralizar la gestión de la
sesión.

## Seguridad

La arquitectura contempla que la gestión de la sesión y la comunicación entre la capa
nativa y React Native sean responsabilidad de la capa nativa.

Como parte del alcance de la prueba, estas medidas quedaron planteadas a nivel
arquitectónico y no como una implementación completa. La gestión segura de la sesión,
validación de acceso y protección de la comunicación entre capas quedan como pasos
posteriores.

El módulo Kotlin entregado es una prueba de concepto para demostrar la comunicación
mediante eventos. La navegación completa entre bundles y la gestión nativa de la
sesión quedan como pasos posteriores de implementación.