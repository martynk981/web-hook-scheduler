import { NestFactory } from '@nestjs/core';
import { config } from './../../config';
import { SchedulerModule } from './scheduler.module';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerModule);
  await app.listen(config.apps.scheduler.port);
}
bootstrap();
