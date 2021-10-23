import { Module, CacheModule } from '@nestjs/common';
import { WebHookTargetController } from './web-hook-target.controller';
import { WebHookTargetService } from './web-hook-target.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [WebHookTargetController],
  providers: [WebHookTargetService],
})
export class WebHookTargetModule {}
