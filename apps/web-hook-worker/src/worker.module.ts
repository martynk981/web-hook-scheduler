import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkerService } from './worker.service';
import { config } from './../../config';
import { WebHookJobRepository } from '../../shared/database/web-hook-job.repository';
import { WebHookJobDbSchema } from './../../shared/database/web-hook-job.model';
import { JobRunnerService } from './job-runner.service';

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
  providers: [WorkerService, WebHookJobRepository, JobRunnerService],
})
export class WorkerModule {}
