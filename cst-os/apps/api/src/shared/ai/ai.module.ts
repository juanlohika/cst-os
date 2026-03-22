import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { ClaudeProvider } from './claude.provider';
import { AiSkillRunner } from './ai-skill.runner';

@Module({
  imports: [ConfigModule],
  providers: [
    { provide: AiService, useClass: ClaudeProvider },
    AiSkillRunner,
  ],
  exports: [AiService, AiSkillRunner],
})
export class AiModule {}
