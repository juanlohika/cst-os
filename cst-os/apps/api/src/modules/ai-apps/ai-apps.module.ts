import { Module } from '@nestjs/common';
import { AiAppsController } from './ai-apps.controller';
import { AiAppsService } from './ai-apps.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { AiModule } from '../../shared/ai/ai.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [AiAppsController],
  providers: [AiAppsService],
  exports: [AiAppsService],
})
export class AiAppsModule {}
