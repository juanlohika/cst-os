import {
  Injectable, NotFoundException, UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import * as crypto from 'crypto';

function hashPasscode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

@Injectable()
export class PortalService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Token management (internal — requires auth) ─────────────────────────────

  async createToken(projectId: string, opts: {
    passcode?: string;
    contactEmails?: string[];
    expiresAt?: Date;
    createdById?: string;
  }) {
    return this.prisma.projectPortalToken.create({
      data: {
        projectId,
        passcodeHash: opts.passcode ? hashPasscode(opts.passcode) : null,
        contactEmails: opts.contactEmails ?? [],
        expiresAt: opts.expiresAt,
        createdById: opts.createdById,
      },
    });
  }

  async listTokens(projectId: string) {
    return this.prisma.projectPortalToken.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeToken(id: string) {
    return this.prisma.projectPortalToken.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ── Public portal view ──────────────────────────────────────────────────────

  async getPortalView(token: string, passcode?: string) {
    const record = await this.prisma.projectPortalToken.findUnique({
      where: { token },
    });

    if (!record || !record.isActive) {
      throw new NotFoundException('Portal link not found or has been revoked.');
    }

    if (record.expiresAt && record.expiresAt < new Date()) {
      throw new ForbiddenException('This portal link has expired.');
    }

    // Passcode check
    if (record.passcodeHash) {
      if (!passcode) {
        throw new UnauthorizedException('Passcode required.');
      }
      if (hashPasscode(passcode) !== record.passcodeHash) {
        throw new UnauthorizedException('Incorrect passcode.');
      }
    }

    // Log access
    const accessLog = (record.accessLog as any[]) ?? [];
    accessLog.push({ at: new Date().toISOString() });
    await this.prisma.projectPortalToken.update({
      where: { id: record.id },
      data: { accessLog },
    });

    // Fetch project data (client-safe subset only)
    const project = await this.prisma.project.findUnique({
      where: { id: record.projectId },
      include: {
        client: { select: { id: true, companyName: true } },
        milestones: {
          orderBy: { dueDate: 'asc' },
          select: {
            id: true,
            title: true,
            dueDate: true,
            status: true,
            phase: true,
          },
        },
        tasks: {
          where: { isExternal: true },
          orderBy: { dueDate: 'asc' },
          select: {
            id: true,
            title: true,
            status: true,
            dueDate: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return {
      projectName: project.projectName,
      clientName: project.client.companyName,
      status: project.status,
      phase: project.phase,
      startDate: project.startDate,
      targetGoLiveDate: project.targetGoLiveDate,
      milestones: project.milestones,
      externalTasks: project.tasks,
    };
  }
}
