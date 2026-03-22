import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly gateway: NotificationsGateway,
  ) {}

  // ── Notifications ───────────────────────────────────────────────────────────

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createNotification(data: {
    userId: string;
    title: string;
    body: string;
    type: string;
    entityType?: string;
    entityId?: string;
  }) {
    return this.prisma.notification.create({ data });
  }

  // ── News Feed ───────────────────────────────────────────────────────────────

  async getFeed(options: {
    filter?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) {
    const { filter, limit = 30, offset = 0 } = options;

    const where: any = {};
    if (filter === 'milestones') {
      where.eventType = { in: ['milestone_reached', 'go_live'] };
    } else if (filter === 'mentions') {
      where.eventType = 'comment_mention';
    } else if (filter === 'announcements') {
      where.isAnnouncement = true;
    }

    const [events, total] = await Promise.all([
      this.prisma.newsFeedEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          actor: {
            select: { id: true, fullName: true, profilePhotoUrl: true, role: true },
          },
        },
      }),
      this.prisma.newsFeedEvent.count({ where }),
    ]);

    return { data: events, total };
  }

  async createFeedEvent(data: {
    eventType: string;
    entityType?: string;
    entityId?: string;
    actorId?: string;
    content?: string;
    metadata?: any;
    isAnnouncement?: boolean;
    visibility?: string;
  }) {
    const savedEvent = await this.prisma.newsFeedEvent.create({
      data: data as any,
      include: {
        actor: {
          select: { id: true, fullName: true, profilePhotoUrl: true, role: true },
        },
      },
    });

    try {
      this.gateway.broadcastFeedEvent(savedEvent);
    } catch {
      // Never let broadcast failure affect the main operation
    }

    return savedEvent;
  }

  async addReaction(eventId: string, userId: string, emoji: string) {
    const event = await this.prisma.newsFeedEvent.findUniqueOrThrow({
      where: { id: eventId },
    });

    const reactions: Record<string, string[]> =
      (event.reactions as any) ?? {};
    if (!reactions[emoji]) reactions[emoji] = [];

    const idx = reactions[emoji].indexOf(userId);
    if (idx >= 0) {
      reactions[emoji].splice(idx, 1); // toggle off
    } else {
      reactions[emoji].push(userId); // toggle on
    }

    return this.prisma.newsFeedEvent.update({
      where: { id: eventId },
      data: { reactions },
    });
  }
}
