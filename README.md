<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## DESCRIPCIÓN DEL PROYECTO ##
Esta aplicación backend tiene como proposito manejar toda la lógica de un sistema de reservas de un hostal, que a su vez, maneja un apartado de atracciones y sistemas de restaurantes al interior. El objetivo será manejar toda la información correlacionada a las habitaciones, las comodidades asociadas a las habitaciones, las habitaciones se encuentran agrupadas en temáticas, mismas que serán gestionadas por lote genérico a la hora de aplicar una reserva; serán gestionados los temas de creación de perfiles de usuario para que realicen las reservaciones así como también para la gestión interna hablando de los temas del administrador, por lo que este sistema tendrá un manejo de roles "a través de la mecánica de arrays de roles" con las que será gestionada está parte; en el apartado del restaurante serán consideradas las cartas de los platillos, detalles e imágenes así como también las diferentes atracciones del sitio que amplian los servicios y hacen parte de los paquetes que ofrece el hotel, las reservaciones comprenderan paquetes que a su vez generan planes temáticos.

``Desarrollado por``: [Juan Sebastian Medina Toro](https://www.linkedin.com/in/juan-sebastian-medina-toro-887491249/).

## PASOS DE INSTALACIÓN ##
Una vez descagada la aplicación, siga los siguientes pasos:
1. Ejecute el comando de instalación de dependencias:
```bash
$ npm install
```
2. Renombre el archivo ``.env.template`` a ``.env`` y configure las variables de entorno
3. Ejecute el comando para levantar la imagen de Docker:
```bash
$ docker compose up -d
```
4. Una vez levantada la base de datos, creemos sus tablas respectivas, para ello debemos ejecutar todas las migraciones que componen la base de datos con el comando:
```bash
$ npm run migration:run
```
Posterior a este paso, corroboar en la base de datos la creación de las tablas.

5. Ejecute el siguiente comando (SEED) para llenar la información inicial de la base de datos, esto es una semilla de información preliminar para arrancar a usar los aspectos básicos del sistema, ejecute el siguiente END POINT usando el verbo POST (No requiere por ahora auth):
```bash
$ // P E N D I E N T E //
```
6. Ejecutar en modo desarrollo usando el comando:
```bash
$ npm run start:dev
```
7. Puede verificar que la aplicación este OK en la terminal o bien entrando al sitio:
```bash
$ http://localhost:*PORT*/api-hostalpaly
```
Si en el caso anterior no obtiene respuesta, asegurece de tener el servidor estático configurado, al ser una aplicación con GraphQL entonces la configuración está dada para la confguración por defecto del servidor de Apollo.
8. Para la revisión en Apollo Studio, ingrese a la siguiente URL pero teniendo el proyecto en ejecución DEV:
```bash
$ http://localhost:*PORT*/graphql
```



## ``****** INFORMACIÓN ADICIONAL IMPORTANTE ******`` ##
## CREACIÓN Y EJECUCIÓN DE MIGRACIONES USANDO TYPEORM ##
1. Para la creación de las migraciones, debemos ejecutar el comando:
```bash
$ npm run migration:generate ./src/config/database/migrations/NOMBRE_DE_MIGRACION
```
Debemos cambiar el ``NOMBRE_DE_MIGRACION`` por el nombre que le vayamos a dar a la migración, es de suma importancia y recomendación que los nombres de la migración no tengan espacios, usar ``-`` o ``_`` como separadores.

2. Para la ejecución de la(s) migración(es) debemos usar el comando:
```bash
$ npm run migration:run
```
Este comando ejecutará todas las migraciones que hayan en la carpeta de migraciones dentro del proyecto, por eso es importante tenerlas actualizadas al orden del día. Al iniciar el proyecto la primera vez, debemos ejecutar este comando para poder generar la base de datos.

3. Si desea revertir la última migración, podemos usar el comando:
```bash
$ npm run migration:rollback
```

## CREACIÓN Y EJECUCIÓN DE MIGRACIONES USANDO PRISMA ##
- Creación y ejecución de migraciones para la base de datos:
  - Para crear una migración debemos usar:
    **NOTA 1:** Se recomienda ejecutar como Administrador.
    **NOTA 2:** Cambie el DEFINA-NOMBRE-MIGRACION por el nombre que desea dar a la migración.
    ```
    npx prisma migrate dev --name DEFINA-NOMBRE-MIGRACION
    ```
  - Para ejecutar una migración usamos:
    **NOTA:** Se recomienda ejecutar como Administrador.
    ```
    npx prisma generate
    ```

## APUNTES ADICIONALES ##
- Se crearon Types para manejar la estructuración de la paginación con GraphQL y generar un tipado más estructurado conforme a los requerimientos. Lo que ocurre es que como se maneja diferente a NestJS sin GraphQL el tema de la paginación, nos apoyamos de los Types por Módulos para generar una estructura genérica mejor implementada para una paginación que provea mejor información así como el tema del filtro.
- Para la confirmación del correo electrónico, a pesar de que estamos trabajando con GraphQL End Points, se optó por crear un sub modulo que funcionara como una API RESTful tradicional solamente para la generación del cambio de comprobación de email así como también para la carga de adjuntos, esto con la finalidad de no dar tantas vueltas y generar una solución más efectiva sin salirnos del marco de GraphQL (Por medio de documentación y diferentes foros, las nuevas versiones de GraphQL y NestJS han hecho muy complicada la implementación de estos dos aspectos). Información del end point rest:
```
GET  (Sin Body, ejecutado por URL a través del Link enviado)     - localhost:5500/api-hostalpaly/v1/email/verify-email/:idUsuario
POST (Con Body en Form Data y Adjuntos [Propiedad: imagesRooms]) - localhost:5500/api-hostalpaly/v1/uploads/rooms/:idCategory
```