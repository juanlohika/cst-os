import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { QueryMeetingsDto } from './dto/query-meetings.dto';
import { Prisma, TaskType } from '@prisma/client';

const MEETING_INCLUDE = {
  client: { select: { id: true, companyName: true } },
  project: { select: { id: true, projectName: true } },
  createdBy: { select: { id: true, fullName: true } },
  meetingTasks: {
    select: {
      id: true,
      title: true,
      status: true,
      assignedTo: { select: { id: true, fullName: true } },
    },
  },
};

@Injectable()
export class MeetingsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
  ) {}

  async create(dto: CreateMeetingDto, createdById?: string) {
    const { attendeeIds, ...meetingData } = dto;

    const meeting = await this.prisma.meeting.create({
      data: {
        ...meetingData,
        createdById,
        meetingDate: new Date(dto.meetingDate),
        participants: dto.participants ?? [],
      },
      include: MEETING_INCLUDE,
    });

    // Auto-create one task per attendee
    if (attendeeIds && attendeeIds.length > 0) {
      const dueDate = new Date(dto.meetingDate);
      const taskCreateOps = attendeeIds.map((userId) =>
        this.prisma.task.create({
          data: {
            title: `Attend: ${dto.title}`,
            type: TaskType.meeting,
            meetingId: meeting.id,
            assignedToId: userId,
            createdById,
            projectId: dto.projectId ?? null,
            dueDate,
            priority: 'medium',
          },
        }),
      );
      await Promise.all(taskCreateOps);
    }

    // Note: meeting_scheduled is not in the FeedEventType enum; feed event omitted intentionally

    // Return meeting with tasks included
    return this.prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: MEETING_INCLUDE,
    });
  }

  async findAll(query: QueryMeetingsDto) {
    const { clientId, projectId, meetingType, status, search, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MeetingWhereInput = {
      ...(clientId && { clientId }),
      ...(projectId && { projectId }),
      ...(meetingType && { meetingType }),
      ...(status && { status }),
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.meeting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { meetingDate: 'desc' },
        include: MEETING_INCLUDE,
      }),
      this.prisma.meeting.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        ...MEETING_INCLUDE,
        fitGaps: { select: { id: true, status: true } },
        processFlows: { select: { id: true, title: true, flowType: true } },
      },
    });
    if (!meeting) throw new NotFoundException(`Meeting ${id} not found`);
    return meeting;
  }

  async update(id: string, dto: UpdateMeetingDto) {
    await this.findOne(id);

    const updated = await this.prisma.meeting.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.clientId !== undefined && { clientId: dto.clientId }),
        ...(dto.projectId !== undefined && { projectId: dto.projectId }),
        ...(dto.meetingType !== undefined && { meetingType: dto.meetingType }),
        ...(dto.meetingDate !== undefined && { meetingDate: new Date(dto.meetingDate) }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.recordingUrl !== undefined && { recordingUrl: dto.recordingUrl }),
        ...(dto.transcriptRaw !== undefined && { transcriptRaw: dto.transcriptRaw }),
        ...(dto.aiSummary !== undefined && { aiSummary: dto.aiSummary }),
        ...(dto.actionItems !== undefined && { actionItems: dto.actionItems }),
        ...(dto.decisions !== undefined && { decisions: dto.decisions }),
        ...(dto.requirements !== undefined && { requirements: dto.requirements }),
        ...(dto.painPoints !== undefined && { painPoints: dto.painPoints }),
        ...(dto.risksIdentified !== undefined && { risksIdentified: dto.risksIdentified }),
        ...(dto.participants !== undefined && { participants: dto.participants }),
      },
      include: MEETING_INCLUDE,
    });

    // When meeting is marked completed → mark all linked tasks as done
    if (dto.status === 'completed') {
      await this.prisma.task.updateMany({
        where: { meetingId: id, status: { not: 'done' } },
        data: { status: 'done' },
      });
    }

    // When meeting is cancelled → cancel all linked tasks
    if (dto.status === 'cancelled') {
      await this.prisma.task.updateMany({
        where: { meetingId: id, status: { notIn: ['done', 'cancelled'] } },
        data: { status: 'cancelled' },
      });
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.meeting.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  }

  /** Called by TasksService when a meeting task is marked done */
  async checkAndCompleteMeeting(meetingId: string) {
    const pendingTasks = await this.prisma.task.count({
      where: {
        meetingId,
        status: { notIn: ['done', 'cancelled'] },
      },
    });

    if (pendingTasks === 0) {
      await this.prisma.meeting.update({
        where: { id: meetingId },
        data: { status: 'completed' },
      });
    }
  }
}
