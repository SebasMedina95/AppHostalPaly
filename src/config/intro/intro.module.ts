import { Module } from '@nestjs/common';
import { IntroResolver } from './intro.resolver';

@Module({
  providers: [IntroResolver]
})
export class IntroModule {}
