<p align="center">
  <img src="https://raw.githubusercontent.com/MariaHerrera03/bankapp/main/shared/assets/LogoBankApp.png" alt="BankApp" width="350" />
</p>

<h1 align="center">BankApp</h1>

<p align="center">
  Prueba tecnica Especialista React Native
</p>

---

## Que es esto

Un contenedor Android para cuatro bundles independientes de React Native: Login, Home,
Transferencia y Movimientos. Cada bundle vive por separado y se comunica con el
contenedor nativo a traves de un bridge de eventos, simulando el flujo real de una app
bancaria construida con arquitectura hibrida.

## Demo

<p align="center">
  <img
    src="https://raw.githubusercontent.com/MariaHerrera03/bankapp/main/shared/assets/DemoGIF.gif"
    alt="Demo BankApp"
    width="210"
  />
</p>

*(video en `shared/assets/DemoBankApp.mp4` — recorrido completo: login, navegacion entre
las 4 pantallas, transferencia con validaciones, y expiracion de sesion)*

## Entregado

- Los cuatro bundles RN estan completos y funcionales con datos de desarrollo locales, hooks, servicios, validaciones y eventos del bridge.
- `shared/theme` centraliza el design system y los contratos `Session`, `User`, `Movement` y transferencia.
- El contenedor Kotlin incluye un esqueleto minimo de `MainActivity`, `SessionBridge`, `SessionManager` y registro del paquete nativo.
- La arquitectura y las decisiones de seguridad estan documentadas en [docs/arquitectura.md](docs/arquitectura.md).

## Decisiones de alcance

- Kotlin es una prueba de concepto, no una implementacion de produccion: la seleccion dinamica de raices, navegacion nativa y persistencia segura no estan terminadas.
- Keystore, `EncryptedSharedPreferences`, ProGuard/R8 endurecido y deteccion de root/emulador estan documentados, pero no implementados.
- Los datos de servicios son datos de desarrollo locales y no representan una API bancaria real.

## Transparencia tecnica

El stack real de la desarrolladora es 100% React Native. No tenia experiencia previa en desarrollo Android nativo con Kotlin, y la oferta original tampoco mencionaba Kotlin como requisito. Por eso se priorizaron cuatro flujos RN solidos y se dejo el codigo nativo como esqueleto honesto y documentado.

## Ejecutar

```bash
npm install
npm start
npm run android
```

Credenciales de desarrollo del Login: usuario `maria`, contrasena `123456`.

## Preview de desarrollo

`PreviewApp.tsx` es una herramienta SOLO para desarrollo y QA visual local. Simula el bridge nativo suscribiéndose a los eventos emitidos por los bundles y navega automáticamente entre las cuatro pantallas, sin depender del bridge nativo Kotlin; no forma parte de la arquitectura de producción ni reemplaza la independencia de los bundles.

Para activarlo temporalmente, modifica el registro del componente en `index.js`:

```js
import PreviewApp from './PreviewApp';

AppRegistry.registerComponent(appName, () => PreviewApp);
```

Mantén el resto del archivo igual, inicia Metro y ejecuta la app para revisar el flujo Login -> Home -> Transferir/Movimientos -> Home -> Logout -> Login. La barra `Preview QA` muestra la pantalla actual y confirma que la navegación está simulada. Al terminar, revierte temporalmente ese registro para recuperar el arranque real en `App`/`LoginBundle`:

```js
import App from './App';

AppRegistry.registerComponent(appName, () => App);
```

En producción, la navegación entre bundles la resuelve el contenedor Android mediante el bridge Kotlin, no `PreviewApp`.

## Nota sobre el evento LOAD_HOME

El documento de la prueba técnica describe que Android debe enviarle los datos del
usuario al bundle de Home mediante el evento `LOAD_HOME` (props iniciales desde el
contenedor nativo). En esta entrega, Home carga sus propios datos a través de un
servicio local (`homeService.ts`) en lugar de recibirlos de Android.

Esta es una decisión consciente, no un descuido: como se explica en el resto de este
README, mi experiencia real es 100% React Native, sin desarrollo Android nativo previo.
Prioricé invertir el tiempo disponible en construir los 4 bundles de React Native de
forma completa y sólida —que es donde puedo aportar valor real hoy— en lugar de
completar la capa de comunicación bidireccional completa en Kotlin, que quedó como
prueba de concepto documentada.

En una implementación de producción, este mismo Home estaría preparado para recibir
esos datos como props iniciales desde Android en vez de pedirlos él mismo; el cambio
sería mínimo del lado de React Native (recibir props en lugar de llamar al servicio),
pero requiere que el contenedor Kotlin persista y enrute la sesión primero, que es la
pieza que quedó pendiente.

## Pendiente de implementación en Kotlin

Dado el alcance de tiempo y que mi experiencia real es 100% React Native, los siguientes
puntos del documento quedaron mapeados y documentados, pero no implementados:

- Splash nativo antes de cargar el primer bundle.
- Validación de sesión activa al iniciar la app (siempre arranca en Login).
- Navegación nativa dinámica entre bundles (simulada en desarrollo vía `PreviewApp.tsx`).
- Almacenamiento cifrado de sesión (Android Keystore + EncryptedSharedPreferences).
- Cifrado de payloads del bridge (sesión, usuario, transferencia).
- Bloqueo de navegación a bundles privados sin sesión válida.
- Protección contra root/emulador.
- Configuración reforzada de ProGuard/R8.
- Manejo de errores robusto del lado Kotlin (más allá de logging).
- Pruebas nativas específicas (cifrado/descifrado, expiración real de sesión, logout seguro).

Estos puntos están descritos a nivel de diseño en la sección de seguridad de este
documento.

Esto no significa desconocimiento de los patrones involucrados, sino de la capa nativa
especifica. En experiencia previa (apps RN en produccion para Samsung, con +10.000
descargas activas en LATAM), el patron habitual era: la API respondia con un token de
autenticacion que ya traia resuelta la logica de redireccion, y ese estado se manejaba
en variables/estado global (Redux) persistido con AsyncStorage entre sesiones. Un caso
similar se resolvio para preferencia de idioma: se guardaba localmente antes del Splash,
era editable dentro de la app, pero si el usuario iniciaba sesion con una preferencia
distinta guardada en el backend, esa tomaba prioridad sobre la local.

La logica de bridge/sesion de este proyecto sigue el mismo principio de fondo —estado
centralizado que decide que pantalla mostrar segun la sesion activa—, simulado en
`PreviewApp.tsx` ante la ausencia de una capa nativa Android completa y un backend real.
En produccion, esa misma decision (que bundle cargar, si hay sesion valida) la tomaria
el contenedor Kotlin, tal como antes la resolvia el backend junto con Redux/AsyncStorage
del lado de React Native.