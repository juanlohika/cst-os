import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateBrdDto } from './dto/create-brd.dto';
import { UpdateBrdDto } from './dto/update-brd.dto';
import { QueryBrdsDto } from './dto/query-brds.dto';
import { Prisma, BrdStatus } from '@prisma/client';

const BRD_INCLUDE = {
  project: { select: { id: true, projectName: true } },
  client: { select: { id: true, companyName: true } },
  createdBy: { select: { id: true, fullName: true } },
  approvedBy: { select: { id: true, fullName: true } },
};

@Injectable()
export class BrdsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrdDto, createdById?: string) {
    return this.prisma.brd.create({
      data: { ...dto, createdById, version: dto.version ?? 'v1.0' },
      include: BRD_INCLUDE,
    });
  }

  async findAll(query: QueryBrdsDto) {
    const { clientId, projectId, status, search, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BrdWhereInput = {
      ...(clientId && { clientId }),
      ...(projectId && { projectId }),
      ...(status && { status }),
      ...(search && { title: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.brd.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: BRD_INCLUDE,
      }),
      this.prisma.brd.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const brd = await this.prisma.brd.findUnique({
      where: { id },
      include: {
        ...BRD_INCLUDE,
        fitGap: { select: { id: true, status: true } },
      },
    });
    if (!brd) throw new NotFoundException(`BRD ${id} not found`);
    return brd;
  }

  async update(id: string, dto: UpdateBrdDto) {
    await this.findOne(id);
    return this.prisma.brd.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.version !== undefined && { version: dto.version }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.linkedMeetingIds !== undefined && { linkedMeetingIds: dto.linkedMeetingIds }),
        ...(dto.linkedFitGapId !== undefined && { linkedFitGapId: dto.linkedFitGapId }),
        ...(dto.googleDocId !== undefined && { googleDocId: dto.googleDocId }),
        ...(dto.googleDocUrl !== undefined && { googleDocUrl: dto.googleDocUrl }),
        ...(dto.status === BrdStatus.approved && { approvedAt: new Date() }),
        ...(dto.status === BrdStatus.for_review && { submittedForReviewAt: new Date() }),
      },
      include: BRD_INCLUDE,
    });
  }

  async submitForReview(id: string) {
    const brd = await this.findOne(id);
    if (brd.status !== BrdStatus.draft) {
      throw new BadRequestException('Only draft BRDs can be submitted for review');
    }
    return this.prisma.brd.update({
      where: { id },
      data: { status: BrdStatus.for_review, submittedForReviewAt: new Date() },
      include: BRD_INCLUDE,
    });
  }

  async approve(id: string, approverId: string) {
    const brd = await this.findOne(id);
    if (brd.status !== BrdStatus.for_review) {
      throw new BadRequestException('BRD must be in for_review status to approve');
    }
    return this.prisma.brd.update({
      where: { id },
      data: { status: BrdStatus.approved, approvedById: approverId, approvedAt: new Date() },
      include: BRD_INCLUDE,
    });
  }
}
