import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'; //Config especial por versión.

import { IntroModule } from './config/intro/intro.module';
// import { dataSourceOptions } from './config/database/data-source';
import { FilesModule } from './helpers/uploads/files.module';

import { ComfortsModule } from './modules/comforts/comforts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailVerifyModule } from './modules/api/emails/email-verify.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { ApiModule } from './modules/api/api.module';
import { PlansModule } from './modules/plans/plans.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [

    //? Configuración Global
    ConfigModule.forRoot({ isGlobal: true }),

    //? Configuración del TypeORM y PostgreSQL
    // TypeOrmModule.forRoot(dataSourceOptions),

    //? Servidor Estático
    //* NOTA: Descomentarlo para desplegar
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      csrfPrevention: false, // Habilita o Deshabilita la prevención CSRF
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault() //Config especial por versión.
      ],
    }),

    IntroModule,
    ComfortsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
    EmailVerifyModule,
    RoomsModule,
    ApiModule, //Este módulo controlará peticiones API RESTful (Funciones muy específicas)
    FilesModule, PlansModule, ReservationsModule, SeedModule, //Para la subida de archivos a Cloudinary

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
