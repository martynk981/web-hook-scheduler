db.createUser({
  user: 'user',
  pwd: 'qwerty',
  roles: [
    {
      role: 'readWrite',
      db: 'web_hook_job',
    },
  ],
});

db.web_hook_job.createIndex({ jobId: 1 }, { unique: true });
