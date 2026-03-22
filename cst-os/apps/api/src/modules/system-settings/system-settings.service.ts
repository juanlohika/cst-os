import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class SystemSettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemSetting.findMany();
  }

  async findByKey(key: string) {
    return this.prisma.systemSetting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string) {
    return this.prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
