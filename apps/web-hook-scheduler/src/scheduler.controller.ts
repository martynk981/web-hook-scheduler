import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { JobStatusDto } from './../../shared/dto/job-status.dto';
import { JobCreateRequestDto } from './dto/job-create-request.dto';
import { JobCreatedResponseDto } from './dto/job-created-response.dto';
import { SchedulerService } from './scheduler.service';

@Controller('timers')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post()
  async createJob(
    @Body() jobData: JobCreateRequestDto,
  ): Promise<JobCreatedResponseDto> {
    const job = await this.schedulerService.createWebHookJob(jobData);

    return {
      jobId: job.id,
    };
  }

  @Get(':id')
  async getJobStatus(@Param('id') id: string): Promise<JobStatusDto> {
    const status = await this.schedulerService.getJobStatus(id);

    if (!status) {
      throw new NotFoundException('Job not found');
    }

    return status;
  }
}
