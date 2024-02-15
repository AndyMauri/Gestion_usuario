Este proyecto es una prueba de una api para la gestión de usuarios. Para poner a correr la api:


[1] Debes tener instalado node.js y nest.js

[2] Luego, crea una base de tatos en Xampp llamada nestdb 

[3] En el proyecto backend dirigete al diretorio src/users/users.module.ts, ya estando ahí si tienes un username y un password diferente a la configuración predefinida entonces agrega tus credenciales.

[4] En tu consola CMD debes dirigirte a la ubicación de donde se encuentra la carpeta backen dentro del proyecto gestion_usuario y estando ahí ejecuta 'npm run start:dev'

Listo, ya puedes usar la api.

Para consumir la api debes ver las configuraciónes del frontend que se encuentra en la carpeta que lleva su nombre. Pero aquí te dejo unos comandos basicos para poder usar el fronted:

En el CMD puedes buscar el directorio del proyecto frontend 'gestion_usuario/frontend', estando ahí puedes ejecutar:

npm start Ejecuta la aplicación en modo de desarrollo.
Abre http://localhost:3000 para verla en tu navegador.

Nota: si te falla el proyecto del frontend cuando ejecutas npm start es porque le faltan librerias, para corregir el error debes ejecutar en el CMD estando en el diretorio frontend 'npm install', luego vuleve a ejecutar 'npm start'.

La página se recargará cuando realices cambios.
También puedes ver cualquier error de lint en la consola.
