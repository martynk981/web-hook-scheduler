## Description

Webhook scheduler service

## Architecture
Service uses the queue approach (job/worker) to schedule the jobs.

![schduler drawio](https://user-images.githubusercontent.com/13293121/138572922-997b51b5-b5ed-4694-ad16-551f0b470dd8.png)

Service consists of three applications:
( see: https://github.com/martynk981/web-hook-scheduler/tree/main/apps )
- **web-hook-scheduler**
  API to create jobs and to get the status of a job

  GET /timers/{jobId} returns job status:
  ```JSON
  {
    "id": "2",
    "url": "http://localhost:9000",
    "timeLeft": 4,
    "status": "created" | "processed" | "failed"
  }
  ```
  POST /timers creates a new job in the queue. Payload:
  ```JSON
  {
    "hours": 0,
    "minutes": 0,
    "seconds": 10,
    "url": "http://localhost:9000"
  }
  ```

- **web-hook-worker**
  Standalone application which listens to the queue and runs jobs


- **web-hook-target**
  Simple application to test the webhooks. Stores in the memory cache last calls for 10 minutes.
  GET /{id} - logs to the cache the id


  GET /log/access-log - returns all logged ids
  
  Appications `web-hook-schedule` and `web-hook-worker` can be scaled out and run as many instances as needed, the only thing which has to be set up is a load balancer before the web-hook-schedule API. 
  Redis is used to store jobs
  MongoDb stores logs of the jobs, since once job is completed it is removed from the redis
  
## Tech stack:
- Langauge: NodeJs+Typescript
- Framework: NestJs (https://github.com/nestjs/nest)
- Queue manager: bull (https://github.com/OptimalBits/bull)
- Storage: MongoDb, Redis

## Running the app

1. Create the redis and mongo server
```bash
$ docker-compose up -d
```
2. Install dependencies
```bash
$ npm i
```

3. Run the application stack (web-hook-scheduler, web-hook-worker, web-hook-target)
```bash
$ npm run start
```
It runs 3 applications:
- web-hook-scheduler at http://localhost:3000
- web-hook-worker as the stand alone application
- web-hook-target at http://localhost:9000

## Test

```bash
# e2e tests
$ npm run test:e2e
```
Test runs the next scenario:
1. Schedules a new job delayed for 5 seconds with the target URL http://localhost:9000 (web-hook-target)
2. Checks the status of the new job by the jobId returned at step 1.
3. Waits for 6 seconds
4. Checks if the status of the job is 'processed'
5. Checks if the http://localhost:9000 (web-hook-target) was called with the jobId

## TODO
- Request validation
- Open API spec
- Unit test coverage
- Error handling
