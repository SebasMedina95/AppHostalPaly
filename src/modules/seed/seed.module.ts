import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../config/prisma/prisma.module';

import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

//Modulos
import { FilesModule } from '../../helpers/uploads/files.module';
import { CategoriesModule } from '../categories/categories.module';
import { ComfortsModule } from '../comforts/comforts.module';
import { PlansModule } from '../plans/plans.module';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { ReservationsModule } from '../reservations/reservations.module';

//Entidades
import { Auth } from '../auth/entities/auth.entity';
import { Category } from '../categories/entities/category.entity';
import { ComfortsForCategory } from '../categories/entities/comforts-of-category.entity';
import { Comfort } from '../comforts/entities/comfort.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';
import { Reservation } from '../reservations/entities/reservation.entity';


@Module({
  providers: [
    SeedResolver, 
    SeedService
  ],
  imports: [
    //Modulos.
    ConfigModule,
    PrismaModule,
    FilesModule,
    AuthModule,
    CategoriesModule,
    ComfortsModule,
    PlansModule,
    RoomsModule,
    UsersModule,
    ReservationsModule,

    //Entidades
    Auth,
    Category,
    ComfortsForCategory,
    Comfort,
    Plan,
    Room,
    User,
    Reservation
  ]
})
export class SeedModule {}
