import { Module } from '@nestjs/common';

import { PrismaModule } from '../../config/prisma/prisma.module';
import { ComfortsService } from './comforts.service';
import { ComfortsResolver } from './comforts.resolver';

import { Comfort } from './entities/comfort.entity';

@Module({
  providers: [
    ComfortsResolver, 
    ComfortsService
  ],
  imports: [
    PrismaModule,
    Comfort
  ]
})
export class ComfortsModule {}
