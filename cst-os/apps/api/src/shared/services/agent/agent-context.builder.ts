import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgentDataService } from './agent-data.service';

export interface ContextBundle {
  appId: string; appName: string; contextType: string;
  entityId: string | null; entityData: Record<string, unknown>;
  currentUser: { id: string; name: string; role: string };
  timestamp: string;
  systemContext: { appVersion: string; environment: string };
}

@Injectable()
export class AgentContextBuilder {
  constructor(
    private readonly agentDataService: AgentDataService,
    private readonly prisma: PrismaService,
  ) {}

  async buildContext(params: { appId: string; entityId?: string; userId: string }): Promise<ContextBundle> {
    const [app, user] = await Promise.all([
      this.agentDataService.getAiApp(params.appId),
      this.prisma.user.findUniqueOrThrow({ where: { id: params.userId }, select: { id: true, fullName: true, role: true } }),
    ]);

    let entityData: Record<string, unknown> = {};
    if (params.entityId && app.contextType) {
      try {
        switch (app.contextType) {
          case 'client':  entityData = await this.agentDataService.getClient(params.entityId) as Record<string, unknown>; break;
          case 'project': entityData = await this.agentDataService.getProject(params.entityId) as Record<string, unknown>; break;
          case 'task':    entityData = await this.agentDataService.getTask(params.entityId) as Record<string, unknown>; break;
          case 'meeting': entityData = await this.agentDataService.getMeeting(params.entityId) as Record<string, unknown>; break;
        }
      } catch { /* entity not found — continue with empty context */ }
    }

    return {
      appId: app.id, appName: app.name, contextType: app.contextType,
      entityId: params.entityId ?? null, entityData,
      currentUser: { id: user.id, name: user.fullName, role: user.role ?? '' },
      timestamp: new Date().toISOString(),
      systemContext: { appVersion: '1.0.0', environment: process.env.NODE_ENV ?? 'development' },
    };
  }
}
