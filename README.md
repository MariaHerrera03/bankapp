<p align="center">
  <img src="https://raw.githubusercontent.com/MariaHerrera03/bankapp/main/shared/assets/LogoBankApp.png" alt="BankApp" width="350" />
</p>

<h1 align="center">BankApp</h1>

<p align="center">
  Prueba técnica — Especialista React Native
</p>

---

## ¿Qué es?

Aplicación con una capa nativa en Android que integra cuatro bundles independientes de React Native: Login, Home, Transferencia y Movimientos.

Cada bundle está organizado de forma independiente y se comunica con la capa nativa mediante un bridge de eventos, simulando una arquitectura híbrida para una aplicación bancaria.

## Demo

<p align="center">
  <img
    src="https://raw.githubusercontent.com/MariaHerrera03/bankapp/main/shared/assets/DemoGIF.gif"
    alt="Demo BankApp"
    width="210"
  />
</p>

El video completo se encuentra en `shared/assets/DemoBankApp.mp4` e incluye el flujo de login, navegación entre las cuatro pantallas, transferencia con validaciones y expiración de sesión.

## Implementado

* Cuatro bundles de React Native funcionales: Login, Home, Transferencia y Movimientos.
* Datos de desarrollo locales, hooks, servicios, validaciones y eventos del bridge.
* `shared/theme` como punto central para el design system y los contratos de datos (`Session`, `User`, `Movement` y transferencia).
* Capa nativa en Kotlin con `MainActivity`, `SessionBridge`, `SessionManager` y registro del paquete nativo.
* `PreviewApp.tsx` para simular localmente la comunicación con la capa nativa y validar el flujo completo.
* Documentación de arquitectura y decisiones técnicas en [`docs/arquitectura.md`](docs/arquitectura.md).

## Alcance

La implementación funcional está enfocada en React Native. La capa nativa en Kotlin se dejó como prueba de concepto, ya que no contaba con experiencia previa en desarrollo Android nativo.

Quedaron documentados, pero no implementados funcionalmente:

* Navegación nativa dinámica entre bundles.
* Persistencia segura mediante Android Keystore y `EncryptedSharedPreferences`.
* Validación y expiración de sesión desde la capa nativa.
* Cifrado de payloads del bridge.
* Bloqueo de acceso a bundles privados sin sesión válida.
* Protección contra root/emulador.
* Configuración reforzada de ProGuard/R8.
* Pruebas nativas específicas.

Los datos utilizados por los servicios son locales y representan únicamente datos de desarrollo; no corresponden a una API bancaria real.

## Ejecutar

```bash
npm install
npm start
npm run android
```

**Credenciales de desarrollo**

* Usuario: `maria`
* Contraseña: `123456`

### Preview de desarrollo

`PreviewApp.tsx` permite validar localmente el flujo completo sin depender de la capa nativa en Kotlin. Simula la comunicación con el bridge nativo y la navegación entre los cuatro bundles.

Es el componente utilizado por defecto al ejecutar la aplicación, ya que la capa nativa todavía no implementa la navegación dinámica entre bundles.

`PreviewApp.tsx` es exclusivamente una herramienta de desarrollo y QA visual y no forma parte de la arquitectura de producción.

## Nota sobre `LOAD_HOME`

La prueba técnica indica que la capa nativa debe enviar los datos del usuario al bundle de Home mediante el evento `LOAD_HOME`.

En esta implementación, Home obtiene sus datos mediante un servicio local (`homeService.ts`) en lugar de recibirlos directamente desde la capa nativa.

Esta decisión se tomó debido al alcance de la prueba y a que la capa nativa Kotlin quedó como prueba de concepto. En una implementación completa, Home recibiría estos datos como props iniciales desde la capa nativa, que gestionaría la sesión antes de cargar los bundles privados.