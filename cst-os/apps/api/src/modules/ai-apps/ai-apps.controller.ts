import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiAppsService } from './ai-apps.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateAppDto } from './dto/create-app.dto';

@ApiTags('AI Apps')
@ApiBearerAuth()
@Controller('ai-apps')
export class AiAppsController {
  constructor(private readonly service: AiAppsService) {}

  // ── App catalogue ──────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List all AI apps' })
  findAll(@CurrentUser() user: any) {
    return this.service.findAll(user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'List apps created by current user' })
  findMine(@CurrentUser() user: any) {
    return this.service.findMine(user.id);
  }

  @Get('shared-with-me')
  @ApiOperation({ summary: 'List apps explicitly shared with current user' })
  findSharedWithMe(@CurrentUser() user: any) {
    return this.service.findSharedWithMe(user.id);
  }

  @Get('sessions/my')
  @ApiOperation({ summary: 'List current user sessions' })
  listSessions(@CurrentUser() user: any) {
    return this.service.listSessions(user.id);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get AI app by code/id' })
  findOne(@Param('code') code: string) {
    return this.service.findOne(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create custom AI app' })
  create(@Body() dto: CreateAppDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update AI app' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateAppDto>) {
    return this.service.update(id, dto);
  }

  // ── Share grants ───────────────────────────────────────────────────────────

  @Get(':appId/grants')
  @ApiOperation({ summary: 'List share grants for an app' })
  getShareGrants(@Param('appId') appId: string) {
    return this.service.getShareGrants(appId);
  }

  @Post(':appId/grants')
  @ApiOperation({ summary: 'Grant access to a user' })
  grantShare(
    @Param('appId') appId: string,
    @Body() body: { userId: string; permission?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.grantShare(appId, body.userId, body.permission ?? 'view_only', user.id);
  }

  @Delete(':appId/grants/:userId')
  @ApiOperation({ summary: 'Revoke access for a user' })
  revokeShare(@Param('appId') appId: string, @Param('userId') userId: string) {
    return this.service.revokeShare(appId, userId);
  }

  // ── Sessions ───────────────────────────────────────────────────────────────

  @Post(':code/sessions')
  @ApiOperation({ summary: 'Create a new session for an AI app' })
  createSession(
    @Param('code') code: string,
    @Body() dto: CreateSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.service.createSession(code, user.id, dto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get session by ID' })
  getSession(@Param('id') id: string) {
    return this.service.getSession(id);
  }

  // ── Streaming chat ─────────────────────────────────────────────────────────

  @Post('sessions/:id/message')
  @ApiOperation({ summary: 'Send a message to a session (SSE streaming)' })
  async sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
      await this.service.streamMessage(id, dto.content, (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      });
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ error: err?.message ?? 'Stream error' })}\n\n`);
    } finally {
      res.end();
    }
  }
}
