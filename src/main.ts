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

  //? Defino puerto a usar:
  let port: number;
  let apollo: string;
  if( process.env.STAGE == "dev" ){
    port = Number(process.env.PORT);
    apollo = process.env.WEB_APOLLO_SERVICE_URL_DEV;
  }else{
    port = Number(process.env.PORT_PDX);
    apollo = process.env.WEB_APOLLO_SERVICE_URL_PDX;
  }

  //? Configuración de puerto
  await app.listen( port );
  logger.log(`La APP está corriendo en puerto ${port}`);
  logger.log(`El Servidor de Apollo está corriendo en ${apollo}`);
}
bootstrap();
