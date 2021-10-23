export enum JobStatus {
  created = 'created',
  processed = 'processed',
  failed = 'failed',
}

export class WebHookJobData {
  url: string;
}
