import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { ClaudeProvider } from './claude.provider';
import { AiSkillRunner } from './ai-skill.runner';
import { SystemSettingsModule } from '../../modules/system-settings/system-settings.module';

@Module({
  imports: [ConfigModule, SystemSettingsModule],
  providers: [
    { provide: AiService, useClass: ClaudeProvider },
    AiSkillRunner,
  ],
  exports: [AiService, AiSkillRunner],
})
export class AiModule {}
