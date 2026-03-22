import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { SetValueDto } from './dto/set-value.dto';

function toFieldKey(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

@Injectable()
export class CustomFieldsService {
  constructor(private prisma: PrismaService) {}

  getDefinitions(entityType: string) {
    return this.prisma.customFieldDefinition.findMany({
      where: { entityType, isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  createDefinition(dto: CreateFieldDto) {
    const fieldKey = toFieldKey(dto.label);
    return this.prisma.customFieldDefinition.create({
      data: { ...dto, fieldKey, options: dto.options ?? undefined },
    });
  }

  async updateDefinition(id: string, body: Partial<CreateFieldDto>) {
    await this.prisma.customFieldDefinition.findUniqueOrThrow({ where: { id } });
    const data: Record<string, unknown> = { ...body };
    if (body.label) data['fieldKey'] = toFieldKey(body.label);
    return this.prisma.customFieldDefinition.update({ where: { id }, data });
  }

  async deleteDefinition(id: string) {
    await this.prisma.customFieldDefinition.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new NotFoundException(`Custom field ${id} not found`);
    });
    return this.prisma.customFieldDefinition.delete({ where: { id } });
  }

  getValues(entityId: string) {
    return this.prisma.customFieldValue.findMany({
      where: { entityId },
      include: { field: true },
    });
  }

  setValue(dto: SetValueDto) {
    return this.prisma.customFieldValue.upsert({
      where: { fieldId_entityId: { fieldId: dto.fieldId, entityId: dto.entityId } },
      create: { fieldId: dto.fieldId, entityId: dto.entityId, value: dto.value as any },
      update: { value: dto.value as any },
    });
  }
}
