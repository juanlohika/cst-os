import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

// NOTE: The schema does not have a dedicated AiApiCallLog table.
// Tool call logs are stored in the AuditLog table using entityType='agent_tool_call'
// and the full payload stored in the metadata JSON field.

@Injectable()
export class AgentToolCallLogger {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    sessionId: string; appId: string; userId: string; toolName: string;
    toolInput: Record<string, unknown>; toolOutput: unknown;
    durationMs: number; inputTokens: number; outputTokens: number; costUsd: number;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          entityType: 'agent_tool_call',
          entityId: params.sessionId,
          action: AuditAction.CREATE,
          performedBy: params.userId,
          metadata: {
            appId: params.appId,
            toolName: params.toolName,
            toolInput: params.toolInput,
            toolOutput: params.toolOutput,
            durationMs: params.durationMs,
            inputTokens: params.inputTokens,
            outputTokens: params.outputTokens,
            costUsd: params.costUsd,
          },
        },
      });
    } catch (err) {
      // Non-fatal — log to console but do not throw
      console.error('[AgentToolCallLogger] Failed to persist tool call log:', err);
    }
  }
}
