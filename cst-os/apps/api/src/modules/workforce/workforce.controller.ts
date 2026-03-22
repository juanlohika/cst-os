import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { WorkforceService } from './workforce.service';

@ApiTags('Workforce')
@ApiBearerAuth()
@Controller('workforce')
export class WorkforceController {
  constructor(private readonly service: WorkforceService) {}

  // ── Time Logs ───────────────────────────────────────────────────────────────

  @Get('time-logs')
  @ApiOperation({ summary: 'List time logs' })
  getTimeLogs(
    @Query('userId') userId?: string,
    @Query('taskId') taskId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.getTimeLogs({
      userId,
      taskId,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Get('time-logs/summary')
  @ApiOperation({ summary: 'Get time log summary (week + month totals)' })
  getTimeLogSummary(@Query('userId') userId?: string) {
    return this.service.getTimeLogSummary(userId);
  }

  @Get('time-logs/my-summary')
  @ApiOperation({ summary: 'Get own time log summary' })
  getMyTimeLogSummary(@CurrentUser() user: any) {
    return this.service.getTimeLogSummary(user.id);
  }

  @Post('time-logs')
  @ApiOperation({ summary: 'Log time' })
  createTimeLog(
    @Body() body: { taskId: string; date: string; hours: number; description?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.createTimeLog({
      taskId: body.taskId,
      userId: user.id,
      date: new Date(body.date),
      hours: body.hours,
      description: body.description,
    });
  }

  @Delete('time-logs/:id')
  @ApiOperation({ summary: 'Delete a time log entry' })
  deleteTimeLog(@Param('id') id: string) {
    return this.service.deleteTimeLog(id);
  }

  // ── Onboarding ───────────────────────────────────────────────────────────────

  @Get('onboarding')
  @ApiOperation({ summary: 'List onboarding records' })
  listOnboarding(
    @Query('status') status?: string,
    @Query('supervisorId') supervisorId?: string,
  ) {
    return this.service.listOnboarding({ status, supervisorId });
  }

  @Get('onboarding/:id')
  @ApiOperation({ summary: 'Get onboarding record' })
  getOnboarding(@Param('id') id: string) {
    return this.service.getOnboarding(id);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Create onboarding record' })
  createOnboarding(
    @Body() body: { userId: string; supervisorId?: string; role: string; startDate: string; targetDate?: string; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.createOnboarding({
      userId: body.userId,
      supervisorId: body.supervisorId,
      role: body.role,
      startDate: new Date(body.startDate),
      targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
      notes: body.notes,
    });
  }

  @Patch('onboarding/:id')
  @ApiOperation({ summary: 'Update onboarding record' })
  updateOnboarding(
    @Param('id') id: string,
    @Body() body: { status?: string; checklist?: any[]; notes?: string; targetDate?: string },
  ) {
    return this.service.updateOnboarding(id, {
      ...body,
      targetDate: body.targetDate ? new Date(body.targetDate) : undefined,
    });
  }

  // ── Department Goals ──────────────────────────────────────────────────────────

  @Get('department-goals')
  @ApiOperation({ summary: 'Get department goals' })
  getDepartmentGoals() {
    return this.service.getDepartmentGoals();
  }

  @Post('department-goals')
  @ApiOperation({ summary: 'Upsert a department goal' })
  upsertGoal(
    @Body() body: { role: string; metric: string; target: number; unit?: string; notes?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.upsertGoal({ ...body, createdById: user.id });
  }

  @Delete('department-goals/:id')
  @ApiOperation({ summary: 'Delete a department goal' })
  deleteGoal(@Param('id') id: string) {
    return this.service.deleteGoal(id);
  }

  // ── Usage & Targets ───────────────────────────────────────────────────────────

  @Get('usage-targets')
  @ApiOperation({ summary: 'Get usage targets + actuals for a period' })
  getUsageData(@Query('periodId') periodId: string) {
    return this.service.getUsageData(periodId);
  }

  @Post('usage-targets')
  @ApiOperation({ summary: 'Upsert usage target for a user+period' })
  upsertUsageTarget(
    @Body() body: { userId: string; periodId: string; fieldAppTarget?: number; managerAppTarget?: number },
  ) {
    return this.service.upsertUsageTarget(body);
  }

  @Post('usage-actuals')
  @ApiOperation({ summary: 'Upsert usage actuals for a user+period (manual input)' })
  upsertUsageActual(
    @Body() body: { userId: string; periodId: string; fieldAppActual?: number; managerAppActual?: number },
  ) {
    return this.service.upsertUsageActual(body);
  }
}
