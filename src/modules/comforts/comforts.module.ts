import { Module } from '@nestjs/common';
import { ComfortsService } from './comforts.service';
import { ComfortsResolver } from './comforts.resolver';

@Module({
  providers: [ComfortsResolver, ComfortsService],
})
export class ComfortsModule {}
