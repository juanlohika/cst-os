import { Module } from '@nestjs/common';
import { AgentDataService } from './agent-data.service';
import { AgentContextBuilder } from './agent-context.builder';
import { AgentToolRegistry } from './agent-tool.registry';
import { AgentRunner } from './agent.runner';
import { AgentToolCallLogger } from './agent-tool-call-log';

@Module({
  providers: [AgentDataService, AgentContextBuilder, AgentToolRegistry, AgentRunner, AgentToolCallLogger],
  exports: [AgentDataService, AgentContextBuilder, AgentRunner],
})
export class AgentModule {}
