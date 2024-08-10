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
3. Ejecute el comando para levantar la imagen de Docker (*DESARROLLO*):
*Nota*: Este comando se conecta por defecto con las variables de entorno de `.env`. Pero aún así lo definimos por si algo.
```bash
$ docker-compose -f docker-compose.dev.yml --env-file .env up -d
```
4. Una vez levantada la base de datos, creemos sus tablas respectivas, para ello debemos ejecutar todas las migraciones que componen la base de datos con el comando:
```bash
$ npx prisma migrate deploy
```
Posterior a este paso, corroboar en la base de datos la creación de las tablas.

5. Ejecute el siguiente comando (SEED) para llenar la información inicial de la base de datos, esto es una semilla de información preliminar para arrancar a usar los aspectos básicos del sistema, ejecute el siguiente END POINT usando el verbo POST (No requiere por ahora auth):
```bash
$ El SEED se encuentra entre las opciones en Apollo Studio
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

## PASOS PARA LA IMAGEN DE PRODUCCIÓN ##
Se ha generado el archivo Dockerfile correspondiente así como las adecuaciones de los archivos .yml.
El archivo ``docker-compose.prod.yml`` es el archivo que ejecutaremos para la imagen de producción,
mientras que ``docker-compose.dev.yml`` levanta la base de datos en términos de ambiente de desarrollo.
Para la imagen de producción, usamos las variables de entorno de `.env.prod` donde se encuentra las
diferencias con las URL de conexión.

Para crear la imagen de producción debemos ejecutar el comando:
```bash
$ docker-compose -f docker-compose.pdx.yml --env-file .env up --build
```

# Consideraciones de la Dockerización:
La Dockerización a la fecha está en un 75% de su funcionalidad, aún se debe resolver el tema de ciertos esquemas de seguridad,
y también, no hemos podido incorporar en el Dockerfile la posibilidad de que se ejecuten las migraciones automáticamente, entonces,
hemos tenido que meternos al contenedor y ejecutarlas manualmente con el comando `npx prisma migrate deploy` ya que hemos copiado
la carpeta de las migraciones, es algo que iremos puliendo pero hemos dockerizado y tenemos ahora una BD de DEV y ya tenemos una
para PDX que comparten los esquemas de trabajo.


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
  - Para ejecutar las migraciones existentes
    **NOTA:** Se recomienda ejecutar como Administrador.
    ```
    npx prisma migrate deploy
    ```

## APUNTES ADICIONALES ##
- Se crearon Types para manejar la estructuración de la paginación con GraphQL y generar un tipado más estructurado conforme a los requerimientos. Lo que ocurre es que como se maneja diferente a NestJS sin GraphQL el tema de la paginación, nos apoyamos de los Types por Módulos para generar una estructura genérica mejor implementada para una paginación que provea mejor información así como el tema del filtro.
- Para la confirmación del correo electrónico, recuperación de contraseña y gestión de archivos/imágenes, a pesar de que estamos trabajando con GraphQL End Points, se optó por crear un sub modulo que funcionara como una API RESTful tradicional solamente para la generación del cambio de comprobación de email así como también para la carga de adjuntos (imágenes y posiblemente se expandirá para archivos pdf), esto con la finalidad de no dar tantas vueltas y generar una solución más efectiva sin salirnos del marco de GraphQL (Por medio de documentación y diferentes foros, las nuevas versiones de GraphQL y NestJS han hecho muy complicada la implementación de estos dos aspectos forzando incluso a trabajar con versiones antiguas y ya con vulnerabilidades ...). Información del end point REST:
```
GET  (Sin Body, ejecutado por URL a través del Link enviado)     - localhost:5500/api-hostalpaly/v1/email/verify-email/:idUsuario
GET  (Sin Body, ejecutado por URL a través del Link enviado)     - localhost:5500/api-hostalpaly/v1/email/recovery-passwor/`:password-:idUsuario`
POST (Con Body en Form Data y Adjuntos [Propiedad: imagesRooms]) - localhost:5500/api-hostalpaly/v1/uploads/rooms/:idCategory
POST (Con Body en Form Data y Adjuntos [Propiedad: imageUser])   - localhost:5500/api-hostalpaly/v1/uploads/user/:idUsuario
POST (Con Body en Form Data y Adjuntos [Propiedad: imagePlan])   - localhost:5500/api-hostalpaly/v1/uploads/plan/:idPlan
```

## Pendiente ##
DEBEMOS REVISAR VARIAS COSAS:

1. Revisar la funcionalidad de todos los registrar luego de haber ejecutado el SEED
2. Funcionalidad de reservaciones.
3. Funcionalidad de generar informes (Conecatado con nuevo curso) y envío de email
4. Revisar implementación de restaurante/consumos
5. Revisar implementación de compras de insumos
6. Revisar implementación de mantenimientos de habitación
7. Finalizar la dockerización