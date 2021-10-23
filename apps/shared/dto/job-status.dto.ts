import { JobId } from 'bull';

export class JobStatusDto {
  id: JobId;
  url: string;
  timeLeft: number;
  status: string;
}
