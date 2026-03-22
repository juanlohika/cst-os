import { Module } from '@nestjs/common';
import { FitGapController } from './fit-gap.controller';
import { FitGapService } from './fit-gap.service';

@Module({
  controllers: [FitGapController],
  providers: [FitGapService],
  exports: [FitGapService],
})
export class FitGapModule {}
