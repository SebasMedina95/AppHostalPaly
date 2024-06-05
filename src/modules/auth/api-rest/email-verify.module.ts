import { Module } from '@nestjs/common';
import { EmailVerifyService } from './email-verify.service';
import { EmailVerifyController } from './email-verify.controller';
import { PrismaModule } from '../../../config/prisma/prisma.module';

@Module({
  controllers: [EmailVerifyController],
  providers: [EmailVerifyService],
  imports: [PrismaModule]
})
export class EmailVerifyModule {}