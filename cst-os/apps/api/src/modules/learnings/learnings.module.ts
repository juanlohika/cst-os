import { Module } from '@nestjs/common';
import { LearningsController } from './learnings.controller';
import { LearningsService } from './learnings.service';

@Module({
  controllers: [LearningsController],
  providers: [LearningsService],
  exports: [LearningsService],
})
export class LearningsModule {}
