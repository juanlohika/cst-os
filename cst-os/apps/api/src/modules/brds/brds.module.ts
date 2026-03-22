import { Module } from '@nestjs/common';
import { BrdsController } from './brds.controller';
import { BrdsService } from './brds.service';

@Module({
  controllers: [BrdsController],
  providers: [BrdsService],
  exports: [BrdsService],
})
export class BrdsModule {}
