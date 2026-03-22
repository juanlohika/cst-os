import {
  Controller, Get, Patch, Post, Param, Body, Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller()
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // ── Notifications ───────────────────────────────────────────────────────────

  @Get('notifications')
  @ApiOperation({ summary: 'Get current user notifications' })
  getNotifications(@CurrentUser() user: any) {
    return this.service.getNotifications(user.id);
  }

  @Get('notifications/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.service.getUnreadCount(user.id);
  }

  @Patch('notifications/read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@CurrentUser() user: any) {
    return this.service.markAllRead(user.id);
  }

  @Patch('notifications/:id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.markRead(id, user.id);
  }

  // ── News Feed ───────────────────────────────────────────────────────────────

  @Get('feed')
  @ApiOperation({ summary: 'Get news feed events' })
  getFeed(
    @Query('filter') filter?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @CurrentUser() user?: any,
  ) {
    return this.service.getFeed({
      filter,
      userId: user?.id,
      limit: limit ? parseInt(limit, 10) : 30,
      offset: offset ? parseInt(offset, 10) : 0,
    });
  }

  @Post('feed/:id/react')
  @ApiOperation({ summary: 'Toggle reaction on a feed event' })
  react(
    @Param('id') id: string,
    @Body('emoji') emoji: string,
    @CurrentUser() user: any,
  ) {
    return this.service.addReaction(id, user.id, emoji);
  }

  @Post('feed')
  @ApiOperation({ summary: 'Create a feed event (team announcement)' })
  createFeedEvent(
    @Body() body: {
      eventType: string;
      content?: string;
      isAnnouncement?: boolean;
      metadata?: any;
    },
    @CurrentUser() user: any,
  ) {
    return this.service.createFeedEvent({
      ...body,
      actorId: user.id,
    });
  }
}
