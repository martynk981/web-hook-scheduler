import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { JobStatusDto } from '../dto/job-status.dto';
import { JobStatus, WebHookJobData } from '../types';

import { WebHookJobDbModel } from './web-hook-job.model';

@Injectable()
export class WebHookJobRepository {
  constructor(
    @InjectModel('WebHookJobDbModel')
    private readonly dbModel: Model<WebHookJobDbModel>,
  ) {}

  async insertJob(job: Job<WebHookJobData>): Promise<WebHookJobDbModel> {
    const newDbModel = new this.dbModel({
      jobId: job.id,
      url: job.data.url,
      status: JobStatus.created,
      createdAt: Date.now(),
      scheduledAt: new Date(Date.now() + job.opts.delay),
    });

    const result = await newDbModel.save();

    return result;
  }

  async getJobStatus(jobId: string): Promise<JobStatusDto | undefined> {
    const result: WebHookJobDbModel = await this.dbModel
      .findOne({ jobId })
      .exec();
    if (result) {
      return {
        id: result.jobId,
        url: result.url,
        timeLeft: this.getTimeLeft(result.scheduledAt),
        status: result.status,
      };
    }

    return undefined;
  }

  async setJobStatus(jobId, status: JobStatus) {
    const jobDb: WebHookJobDbModel = await this.dbModel
      .findOne({ jobId })
      .exec();
    if (jobDb) {
      jobDb.status = status;
      jobDb.save();
    }
  }

  private getTimeLeft(scheduledAt: number) {
    const timeLeft = scheduledAt - Date.now();

    if (timeLeft > 0) {
      return Math.round(timeLeft / 1000);
    }

    return 0;
  }
}
