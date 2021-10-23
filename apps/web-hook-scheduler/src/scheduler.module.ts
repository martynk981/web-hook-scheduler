import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';

import { config } from './../../config';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { WebHookJobDbSchema } from '../../shared/database/web-hook-job.model';
import { WebHookJobRepository } from '../../shared/database/web-hook-job.repository';

@Module({
  imports: [
    BullModule.forRoot({
      redis: config.redis,
    }),
    BullModule.registerQueue({
      name: config.queueName,
    }),
    MongooseModule.forRoot(config.mongo),
    MongooseModule.forFeature([
      { name: 'WebHookJobDbModel', schema: WebHookJobDbSchema },
    ]),
  ],
  controllers: [SchedulerController],
  providers: [SchedulerService, WebHookJobRepository],
})
export class SchedulerModule {}
