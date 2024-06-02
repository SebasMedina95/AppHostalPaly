import { Module } from '@nestjs/common';
import { ComfortsService } from './comforts.service';
import { ComfortsResolver } from './comforts.resolver';
import { PrismaModule } from 'src/config/prisma/prisma.module';
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
