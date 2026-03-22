import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { category?: string; status?: string; search?: string; limit?: number }) {
    const { category, status, search, limit = 50 } = query;
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }
    return this.prisma.knowledgeBase.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: { owner: { select: { id: true, fullName: true } } },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.knowledgeBase.findUnique({
      where: { id },
      include: { owner: { select: { id: true, fullName: true } } },
    });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async create(dto: {
    title: string;
    category: string;
    content?: string;
    tags?: string[];
    productArea?: string;
    ownerId?: string;
  }) {
    return this.prisma.knowledgeBase.create({
      data: {
        title: dto.title,
        category: dto.category as any,
        content: dto.content,
        tags: dto.tags ?? [],
        productArea: dto.productArea,
        ownerId: dto.ownerId,
        status: 'published' as any,
      },
      include: { owner: { select: { id: true, fullName: true } } },
    });
  }

  async update(id: string, dto: Partial<{ title: string; category: string; content: string; tags: string[]; productArea: string; status: string }>) {
    await this.findOne(id);
    return this.prisma.knowledgeBase.update({
      where: { id },
      data: dto as any,
      include: { owner: { select: { id: true, fullName: true } } },
    });
  }

  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.knowledgeBase.delete({ where: { id } });
  }
}
