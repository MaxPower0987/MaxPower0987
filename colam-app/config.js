/* Configuración de Colamgram. */

// Solo pueden entrar correos que terminen en alguno de estos dominios.
const SCHOOL_DOMAINS = ['colam.edu.mx'];

// Para verificar de verdad que el correo es de quien dice ser, pega aquí la
// configuración de tu proyecto de Firebase (ver README). Mientras sea null, la app
// funciona en "modo demo": revisa que el correo sea de la escuela, pero no manda
// ningún enlace de verificación.
const FIREBASE_CONFIG = null;
/* Ejemplo:
const FIREBASE_CONFIG = {
  apiKey: '...',
  authDomain: 'colamgram.firebaseapp.com',
  projectId: 'colamgram',
  appId: '...',
};
*/
