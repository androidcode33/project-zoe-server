import { HttpModule, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { VendorModule } from '../vendor/vendor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsCategoriesController } from './event-categories.controller';
import { EventsFieldsController } from './event-fields.controller';
import { EventsAttendanceController } from './event-attendance.controller';
import { PrismaService } from '../shared/prisma.service';
import { EventsMetricsController } from './event-metrics.controller';
import { appEntities } from '../config';

@Module({
  imports: [
    VendorModule,
    HttpModule,
    TypeOrmModule.forFeature([...appEntities]),
  ],
  controllers: [
    EventsController,
    EventsCategoriesController,
    EventsFieldsController,
    EventsAttendanceController,
    EventsMetricsController,
  ],
  providers: [EventsService, PrismaService],
  exports: [EventsService],
})
export class EventsModule {}