import { NestFactory } from '@nestjs/core';
import { WebHookTargetModule } from './web-hook-target.module';
import { config } from './../../config';

async function bootstrap() {
  const app = await NestFactory.create(WebHookTargetModule);
  await app.listen(config.apps.target.port);
}
bootstrap();
