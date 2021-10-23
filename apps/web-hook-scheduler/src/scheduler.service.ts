import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { config } from './../../config';
import { JobCreateRequestDto } from './dto/job-create-request.dto';
import { WebHookJobData } from '../../shared/types';
import { WebHookJobRepository } from '../../shared/database/web-hook-job.repository';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectQueue(config.queueName) private queue: Queue,
    private repository: WebHookJobRepository,
  ) {}

  async createWebHookJob(
    jobDto: JobCreateRequestDto,
  ): Promise<Job<WebHookJobData>> {
    const delay = this.getDelay(jobDto);
    const job = await this.queue.add(
      config.jobName,
      {
        url: jobDto.url,
      },
      {
        delay,
        removeOnComplete: true,
      },
    );
    await this.repository.insertJob(job);

    return job;
  }

  async getJobStatus(jobId: string) {
    return await this.repository.getJobStatus(jobId);
  }

  private getDelay({ hours, minutes, seconds }) {
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
  }
}
