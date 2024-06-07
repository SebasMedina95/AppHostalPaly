import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';
import { ComfortsService } from './comforts.service';
import { ComfortsResolver } from './comforts.resolver';

import { Comfort } from './entities/comfort.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [
    ComfortsResolver, 
    ComfortsService
  ],
  imports: [
    AuthModule,
    PrismaModule,
    Comfort
  ]
})
export class ComfortsModule {}
