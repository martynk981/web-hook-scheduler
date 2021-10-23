import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import got from 'got';

import { WebHookJobData } from '../../shared/types';

@Injectable()
export class JobRunnerService {
  async processWebHookJob(job: Job<WebHookJobData>) {
    const url = job.data.url;
    const id = job.id;

    await got(`${url}/${id}`);
  }
}
