import {
  Controller, Get, Post, Patch, Param, Body, Query, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PortalService } from './portal.service';

@ApiTags('Portal')
@Controller()
export class PortalController {
  constructor(private readonly service: PortalService) {}

  // ── Public endpoint — no auth required ─────────────────────────────────────

  @Get('portal/:token')
  @Public()
  @ApiOperation({ summary: 'Get portal view for a project (public)' })
  getPortal(
    @Param('token') token: string,
    @Query('passcode') passcode?: string,
  ) {
    return this.service.getPortalView(token, passcode);
  }

  // ── Internal endpoints — require auth ──────────────────────────────────────

  @Post('projects/:id/portal-tokens')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a portal share token for a project' })
  createToken(
    @Param('id') projectId: string,
    @Body() body: { passcode?: string; contactEmails?: string[]; expiresAt?: string },
    @CurrentUser() user: any,
  ) {
    return this.service.createToken(projectId, {
      ...body,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      createdById: user.id,
    });
  }

  @Get('projects/:id/portal-tokens')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List portal tokens for a project' })
  listTokens(@Param('id') projectId: string) {
    return this.service.listTokens(projectId);
  }

  @Patch('portal-tokens/:id/revoke')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke a portal token' })
  revokeToken(@Param('id') id: string) {
    return this.service.revokeToken(id);
  }
}
