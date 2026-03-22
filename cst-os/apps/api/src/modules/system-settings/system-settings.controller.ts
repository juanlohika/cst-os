import { Controller, Get, Post, Body } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('system-settings')
@Roles(UserRole.super_admin, UserRole.ceo)
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Get()
  async getAllSettings() {
    const settings = await this.settingsService.findAll();
    return settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  @Post()
  async updateSettings(@Body() body: Record<string, string>) {
    const promises = Object.entries(body).map(([key, value]) => 
      this.settingsService.upsert(key, value)
    );
    await Promise.all(promises);
    return { success: true };
  }
}
