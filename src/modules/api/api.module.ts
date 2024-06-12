import { Module } from '@nestjs/common';
import { PrismaModule } from '../../config/prisma/prisma.module';

import { EmailVerifyController } from './emails/email-verify.controller';
import { UploadsController } from './uploads/upload.controller';
import { EmailVerifyService } from './emails/email-verify.service';
import { UploadsService } from './uploads/upload.service';

import { FilesModule } from 'src/helpers/uploads/files.module';
import { CategoriesModule } from '../categories/categories.module';


@Module({
  controllers: [
    EmailVerifyController,
    UploadsController
  ],
  providers: [
    EmailVerifyService,
    UploadsService
  ],
  imports: [
    PrismaModule,
    FilesModule,
    CategoriesModule
  ]
})
export class ApiModule {}
