# Colamgram 💙💚🧡

Red social tipo Instagram **exclusiva para la prepa del Colegio Americano de Saltillo (Colam High School)**, con los colores de la escuela: azul marino, verde y naranja.

## Funciones

- **Acceso exclusivo con el correo de la escuela**: solo entran correos `@colam.edu.mx` (se cambia en `SCHOOL_DOMAINS` dentro de `config.js`). La primera vez se crea el perfil con nombre, usuario, semestre (1°–6°) y grupo; después basta con el correo.
- **Feed** con fotos, "me gusta" (también con doble toque ❤️), comentarios, guardar y compartir.
- **Historias** que duran 24 horas, con visor a pantalla completa.
- **Explorar**: busca alumnos y #hashtags, y filtra por categoría (Eventos, Deportes, Académico, Arte, Clubs, Vida Colam).
- **Avisos de la prepa**: anuncios oficiales de la escuela y tu actividad (los likes y comentarios que recibes). Las cuentas oficiales o de staff pueden publicar avisos.
- **Perfil** con foto, biografía, semestre y grupo, cuadrícula de publicaciones y publicaciones guardadas.
- **Convivencia sana**: filtro de groserías, botón para reportar publicaciones y recordatorio de los valores Colam (honestidad, compromiso, respeto y responsabilidad).
- Se puede **instalar en el celular** como app ("Agregar a pantalla de inicio").

## Cómo abrirla

Es una app web sin dependencias. Desde esta carpeta:

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>. También se puede publicar gratis con GitHub Pages.

## Verificar el correo de verdad (Firebase)

Sin configuración, la app está en **modo demo**: revisa que el correo termine en `@colam.edu.mx`, pero no comprueba que la persona tenga acceso a ese correo. Para mandar un enlace de verificación al correo:

1. Crea un proyecto gratis en <https://console.firebase.google.com>.
2. En **Authentication → Sign-in method** activa **Correo electrónico/contraseña** y la opción **Vínculo de correo electrónico (acceso sin contraseña)**.
3. En **Authentication → Settings → Authorized domains** agrega el dominio donde publiques la app (por ejemplo `tuusuario.github.io`).
4. En **Configuración del proyecto → Tus apps** crea una app web y copia su configuración en `FIREBASE_CONFIG` dentro de `config.js`.

Con eso, al escribir su correo cada alumno recibe un enlace; al abrirlo entra a la app.

## Importante: siguiente paso para usarla con toda la escuela

Esta versión guarda todo **en el navegador de cada dispositivo** (localStorage), así que sirve como prototipo o demo: cada quien ve sus propias publicaciones y las de ejemplo. Para que todos los alumnos vean las publicaciones de todos, hace falta conectarla a un servidor, por ejemplo **Firebase** (Auth + Firestore + Storage) o **Supabase**. Así las publicaciones también quedarían ligadas a la cuenta verificada de cada alumno.
