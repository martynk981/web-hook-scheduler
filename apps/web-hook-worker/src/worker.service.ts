import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

import { config } from './../../config';
import { JobStatus, WebHookJobData } from './../../shared/types';
import { WebHookJobRepository } from './../../shared/database/web-hook-job.repository';
import { JobRunnerService } from './job-runner.service';

@Injectable()
@Processor(config.queueName)
export class WorkerService {
  constructor(
    private repository: WebHookJobRepository,
    private runner: JobRunnerService,
  ) {}

  @Process(config.jobName)
  async runWebHookJob(job: Job<WebHookJobData>) {
    try {
      await this.runner.processWebHookJob(job);
      await this.repository.setJobStatus(job.id, JobStatus.processed);
    } catch (error) {
      await this.repository.setJobStatus(job.id, JobStatus.failed);
    }
  }
}
