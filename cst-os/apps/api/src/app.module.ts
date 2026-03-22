import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { AiModule } from './shared/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { RfasModule } from './modules/rfas/rfas.module';
import { BrdsModule } from './modules/brds/brds.module';
import { FitGapModule } from './modules/fit-gap/fit-gap.module';
import { ProcessFlowsModule } from './modules/process-flows/process-flows.module';
import { AiAppsModule } from './modules/ai-apps/ai-apps.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PortalModule } from './modules/portal/portal.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { PipelineModule } from './modules/pipeline/pipeline.module';
import { WorkforceModule } from './modules/workforce/workforce.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { LearningsModule } from './modules/learnings/learnings.module';
import { AgentModule } from './shared/services/agent/agent.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AiModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    ProjectsModule,
    TasksModule,
    CustomFieldsModule,
    MeetingsModule,
    RfasModule,
    BrdsModule,
    FitGapModule,
    ProcessFlowsModule,
    AiAppsModule,
    NotificationsModule,
    PortalModule,
    KpiModule,
    PipelineModule,
    WorkforceModule,
    KnowledgeBaseModule,
    LearningsModule,
    SystemSettingsModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global JWT guard — every route is protected by default.
    // Use @Public() on routes that should be unauthenticated.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Global roles guard — use @Roles(...) to restrict by role.
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
