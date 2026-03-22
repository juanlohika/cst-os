import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MeetingsService } from '../meetings/meetings.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { Prisma, TaskStatus } from '@prisma/client';

const TASK_INCLUDE = {
  assignedTo: { select: { id: true, fullName: true, profilePhotoUrl: true } },
  createdBy: { select: { id: true, fullName: true } },
  milestone: { select: { id: true, title: true } },
  subtasks: true,
  subtaskList: {
    include: {
      assignedTo: { select: { id: true, fullName: true, profilePhotoUrl: true } },
      subtasks: true,
    },
    orderBy: { sortOrder: 'asc' as const },
  },
};

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    @Inject(forwardRef(() => MeetingsService)) private meetingsService: MeetingsService,
  ) {}

  async create(dto: CreateTaskDto, createdById?: string) {
    const taskRef = `TASK-${Date.now().toString(36).toUpperCase()}`;
    const task = await this.prisma.task.create({
      data: {
        ...dto,
        taskRef,
        createdById,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
      include: TASK_INCLUDE,
    });

    try {
      await this.notifications.createFeedEvent({
        eventType: 'task_created',
        entityType: 'task',
        entityId: task.id,
        actorId: createdById,
        content: `Created task "${task.title}"`,
        metadata: { projectId: dto.projectId, clientId: (dto as any).clientId },
      });
    } catch {
      // Feed event failure must never break task creation
    }

    return task;
  }

  async findAll(query: QueryTasksDto) {
    const {
      projectId,
      clientId,
      assignedToId,
      status,
      type,
      priority,
      milestoneId,
      topLevelOnly,
      parentTaskId,
      search,
      page = 1,
      limit = 50,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      ...(projectId && { projectId }),
      ...(clientId && { project: { clientId } }),
      ...(assignedToId && { assignedToId }),
      ...(status && { status }),
      ...(type && { type }),
      ...(priority && { priority }),
      ...(milestoneId && { milestoneId }),
      ...(topLevelOnly && { parentTaskId: null }),
      ...(parentTaskId && { parentTaskId }),
      ...(search && {
        title: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: TASK_INCLUDE,
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...TASK_INCLUDE,
        project: { select: { id: true, projectName: true, clientId: true } },
        rfa: { select: { id: true, title: true } },
        timeLogs: {
          include: { user: { select: { id: true, fullName: true } } },
          orderBy: { date: 'desc' },
          take: 20,
        },
      },
    });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, updatedById?: string) {
    await this.findOne(id);
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.priority !== undefined && { priority: dto.priority }),
        ...(dto.type !== undefined && { type: dto.type }),
        ...(dto.startDate !== undefined && { startDate: dto.startDate ? new Date(dto.startDate) : null }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.estimatedHours !== undefined && { estimatedHours: dto.estimatedHours }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.assignedToId !== undefined && { assignedToId: dto.assignedToId }),
        ...(dto.milestoneId !== undefined && { milestoneId: dto.milestoneId }),
        ...(dto.parentTaskId !== undefined && { parentTaskId: dto.parentTaskId }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
      include: TASK_INCLUDE,
    });

    // Auto-rollup: if all sibling subtasks are done, check parent
    if (task.parentTaskId && dto.status === TaskStatus.done) {
      await this.rollupParentStatus(task.parentTaskId);
    }

    // When a meeting task is completed, check if all attendees are done → mark meeting done
    if (dto.status === TaskStatus.done && task.meetingId) {
      try {
        await this.meetingsService.checkAndCompleteMeeting(task.meetingId);
      } catch {
        // Meeting completion check must never break task update
      }
    }

    // Emit feed event when task is completed
    if (dto.status === TaskStatus.done) {
      try {
        await this.notifications.createFeedEvent({
          eventType: 'task_completed',
          entityType: 'task',
          entityId: task.id,
          actorId: updatedById,
          content: `Completed task "${task.title}"`,
        });
      } catch {
        // Feed event failure must never break the task update
      }
    }

    return task;
  }

  private async rollupParentStatus(parentId: string) {
    const siblings = await this.prisma.task.findMany({
      where: { parentTaskId: parentId },
      select: { status: true },
    });
    const allDone = siblings.every((s) => s.status === TaskStatus.done);
    if (allDone) {
      await this.prisma.task.update({
        where: { id: parentId },
        data: { status: TaskStatus.done },
      });
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  async reorder(projectId: string, orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      this.prisma.task.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true };
  }

  async logTime(
    taskId: string,
    userId: string,
    hours: number,
    date: Date,
    description?: string,
  ) {
    const [timeLog] = await this.prisma.$transaction([
      this.prisma.timeLog.create({
        data: { taskId, userId, hours, date, description },
      }),
      this.prisma.task.update({
        where: { id: taskId },
        data: { actualHours: { increment: hours } },
      }),
    ]);
    return timeLog;
  }

  // My Tasks queries
  async getMyTasks(userId: string, view: 'today' | 'week' | 'overdue' | 'inbox') {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const baseWhere: Prisma.TaskWhereInput = {
      assignedToId: userId,
      status: { notIn: ['done', 'cancelled'] },
    };

    let where: Prisma.TaskWhereInput = baseWhere;

    switch (view) {
      case 'today':
        // Tasks starting today OR due today
        where = {
          ...baseWhere,
          OR: [
            { startDate: { gte: todayStart, lte: todayEnd } },
            { dueDate: { gte: todayStart, lte: todayEnd } },
          ],
        };
        break;
      case 'week':
        where = { ...baseWhere, dueDate: { gte: todayStart, lte: weekEnd } };
        break;
      case 'overdue':
        where = { ...baseWhere, dueDate: { lt: todayStart } };
        break;
      case 'inbox':
        where = { ...baseWhere, startDate: null, dueDate: null };
        break;
    }

    return this.prisma.task.findMany({
      where,
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
      include: {
        assignedTo: { select: { id: true, fullName: true, profilePhotoUrl: true } },
        project: {
          select: {
            id: true,
            projectName: true,
            client: { select: { companyName: true } },
          },
        },
        subtaskList: { select: { id: true, title: true, status: true } },
      },
      take: 100,
    });
  }

  async exportByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId, parentTaskId: null },
      orderBy: [{ sortOrder: 'asc' }],
      include: {
        assignedTo: { select: { fullName: true } },
        subtaskList: {
          include: { assignedTo: { select: { fullName: true } } },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }
}
