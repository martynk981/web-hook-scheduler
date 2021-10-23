export const config = {
  redis: {
    host: 'localhost',
    port: 6379,
  },
  mongo: 'mongodb://user:qwerty@localhost/web_hook_job',
  queueName: 'webhook',
  jobName: 'webhook-job',
  apps: {
    scheduler: {
      port: 3000,
    },
    target: {
      port: 9000,
    },
  },
};
