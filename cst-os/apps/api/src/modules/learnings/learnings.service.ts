import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';
import { Prisma } from '@prisma/client';

const LEARNING_INCLUDE = {
  project: { select: { id: true, projectName: true } },
  client: { select: { id: true, companyName: true } },
  createdBy: { select: { id: true, fullName: true } },
};

@Injectable()
export class LearningsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLearningDto, createdById?: string) {
    return this.prisma.projectLearning.create({
      data: { ...dto, createdById },
      include: LEARNING_INCLUDE,
    });
  }

  async findAll(query: {
    projectId?: string;
    clientId?: string;
    category?: string;
    impactLevel?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { projectId, clientId, category, impactLevel, search, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectLearningWhereInput = {
      ...(projectId && { projectId }),
      ...(clientId && { clientId }),
      ...(category && { category: category as any }),
      ...(impactLevel && { impactLevel: impactLevel as any }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { whatHappened: { contains: search, mode: 'insensitive' } },
          { recommendation: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.projectLearning.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: LEARNING_INCLUDE,
      }),
      this.prisma.projectLearning.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const learning = await this.prisma.projectLearning.findUnique({
      where: { id },
      include: LEARNING_INCLUDE,
    });
    if (!learning) throw new NotFoundException(`Learning ${id} not found`);
    return learning;
  }

  async update(id: string, dto: UpdateLearningDto) {
    await this.findOne(id);
    return this.prisma.projectLearning.update({
      where: { id },
      data: dto,
      include: LEARNING_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projectLearning.delete({ where: { id } });
  }
}
