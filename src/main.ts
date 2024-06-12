import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

  //? Alias de la aplicación
  app.setGlobalPrefix('api-hostalpaly/v1');

  //? Configuración Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  //? Configuración del cors
  app.enableCors();

  //? Configuración de puerto
  await app.listen( process.env.PORT );
  logger.log(`La APP está corriendo en puerto ${process.env.PORT}`);
  logger.log(`El Servidor de Apollo está corriendo en ${process.env.WEB_APOLLO_SERVICE_URL}`);
}
bootstrap();
