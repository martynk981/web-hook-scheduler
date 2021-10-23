import { Controller, Get, Param } from '@nestjs/common';
import { WebHookTargetService } from './web-hook-target.service';

@Controller()
export class WebHookTargetController {
  constructor(private readonly webHookTargetService: WebHookTargetService) {}

  @Get(':id')
  async trackAccessLog(@Param('id') id: string): Promise<string> {
    await this.webHookTargetService.trackAccess(id);
    return `logged: ${id}`;
  }

  @Get('/log/access-log')
  async getAccessLog(): Promise<string[]> {
    return await this.webHookTargetService.getAccessLog();
  }
}
