import { Module } from '@nestjs/common';
import { ProcessFlowsController } from './process-flows.controller';
import { ProcessFlowsService } from './process-flows.service';

@Module({
  controllers: [ProcessFlowsController],
  providers: [ProcessFlowsService],
  exports: [ProcessFlowsService],
})
export class ProcessFlowsModule {}
