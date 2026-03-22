import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { TimelineBaselinesController } from './timeline-baselines.controller';
import { TimelineBaselinesService } from './timeline-baselines.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ProjectsController, TimelineBaselinesController],
  providers: [ProjectsService, TimelineBaselinesService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
