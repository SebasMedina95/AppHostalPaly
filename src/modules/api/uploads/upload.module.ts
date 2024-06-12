import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../config/prisma/prisma.module';
import { UploadsController } from './upload.controller';
import { UploadsService } from './upload.service';
import { FilesModule } from 'src/helpers/uploads/files.module';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService],
  imports: [
    PrismaModule,
  ]
})
export class UploadsModule {}