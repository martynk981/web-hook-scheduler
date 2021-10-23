jest.setTimeout(10000);

import * as request from 'supertest';
import { config } from '../apps/config';

async function sleep(seconds: number) {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const baseUrl = 'http://localhost';
const schedulerUrl = `${baseUrl}:${config.apps.scheduler.port}`;
const targetUrl = `${baseUrl}:${config.apps.target.port}`;

const schedulerRequest = request(schedulerUrl);
const targetRequest = request(targetUrl);

let jobId;
const delaySeconds = 5;

describe('WebHook (e2e)', () => {
  it('Should create scheduled job and return the job id', (done) => {
    schedulerRequest
      .post('/timers')
      .send({
        hours: 0,
        minutes: 0,
        seconds: delaySeconds,
        url: targetUrl,
      })
      .expect(201)
      .then((response) => {
        jobId = response.body.jobId;

        expect(jobId).not.toBeNull();
        done();
      });
  });

  it('Should return the status of the job', (done) => {
    schedulerRequest
      .get(`/timers/${jobId}`)
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.id).toEqual(jobId);
        expect(body.timeLeft).toBeLessThanOrEqual(delaySeconds);
        expect(body.url).toEqual(targetUrl);
        expect(body.status).toEqual('created');

        done();
      });
  });

  it(`Should process the job after ${delaySeconds} seconds`, (done) => {
    sleep(delaySeconds + 1).then(() => {
      schedulerRequest
        .get(`/timers/${jobId}`)
        .expect(200)
        .then((response) => {
          const { body } = response;
          expect(body.id).toEqual(jobId);
          expect(body.timeLeft).toEqual(0);
          expect(body.url).toEqual(targetUrl);
          expect(body.status).toEqual('processed');

          done();
        });
    });
  });

  it('Should call target url', (done) => {
    targetRequest
      .get('/log/access-log')
      .expect(200)
      .then((response) => {
        const { body } = response;
        expect(body.includes(jobId)).toBeTruthy();

        done();
      });
  });
});
