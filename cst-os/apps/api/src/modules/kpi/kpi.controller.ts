import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { KpiService } from './kpi.service';

@ApiTags('KPI')
@ApiBearerAuth()
@Controller('kpi')
export class KpiController {
  constructor(private readonly service: KpiService) {}

  @Get('periods')
  @ApiOperation({ summary: 'List KPI periods' })
  listPeriods() {
    return this.service.listPeriods();
  }

  @Post('periods')
  @ApiOperation({ summary: 'Get or create a KPI period' })
  getOrCreatePeriod(@Body() body: { year: number; month: number }) {
    return this.service.getOrCreatePeriod(body.year, body.month);
  }

  @Patch('periods/:id/lock')
  @ApiOperation({ summary: 'Lock a KPI period' })
  lockPeriod(@Param('id') id: string) {
    return this.service.lockPeriod(id);
  }

  @Get('scorecards')
  @ApiOperation({ summary: 'List scorecards for a period' })
  listScorecards(@Query('periodId') periodId: string) {
    return this.service.listScorecards(periodId);
  }

  @Get('scorecards/me')
  @ApiOperation({ summary: 'Get own scorecard for a period' })
  getMyScorecard(@Query('periodId') periodId: string, @CurrentUser() user: any) {
    return this.service.getScorecard(user.id, periodId);
  }

  @Get('scorecards/:userId/:periodId')
  @ApiOperation({ summary: 'Get scorecard for a user and period' })
  getScorecard(@Param('userId') userId: string, @Param('periodId') periodId: string) {
    return this.service.getScorecard(userId, periodId);
  }

  @Post('scorecards')
  @ApiOperation({ summary: 'Create or open a scorecard instance' })
  createInstance(@Body() body: { userId: string; periodId: string; templateId: string }) {
    return this.service.createOrUpdateInstance(body);
  }

  @Patch('scorecards/:instanceId/metrics/:metricId')
  @ApiOperation({ summary: 'Update a metric score' })
  updateScore(
    @Param('instanceId') instanceId: string,
    @Param('metricId') metricId: string,
    @Body('rawScore') rawScore: number,
  ) {
    return this.service.updateMetricScore(instanceId, metricId, rawScore);
  }

  @Get('templates')
  @ApiOperation({ summary: 'List KPI scorecard templates' })
  listTemplates() {
    return this.service.listTemplates();
  }
}
