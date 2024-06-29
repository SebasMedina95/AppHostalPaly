import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

import { PlansService } from './plans.service';
import { PlansResolver } from './plans.resolver';

import { Plan } from './entities/plan.entity';

@Module({
  providers: [
    PlansResolver, 
    PlansService
  ],
  imports: [
    AuthModule,
    PrismaModule,
    Plan
  ],
  exports: [
    PlansService
  ]
})
export class PlansModule {}
