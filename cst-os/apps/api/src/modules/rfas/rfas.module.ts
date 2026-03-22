import { Module } from '@nestjs/common';
import { RfasController } from './rfas.controller';
import { RfasService } from './rfas.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [RfasController],
  providers: [RfasService],
  exports: [RfasService],
})
export class RfasModule {}
