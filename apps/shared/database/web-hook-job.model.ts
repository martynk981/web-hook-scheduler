import * as mongoose from 'mongoose';
import { JobStatus } from '../types';

export const WebHookJobDbSchema = new mongoose.Schema({
  jobId: { type: String, index: { unique: true } },
  url: { type: String, required: true },
  status: { type: String, required: true },
  scheduledAt: { type: Date, required: true, default: Date.now },
  createdAt: { type: Date, required: true },
});

export interface WebHookJobDbModel extends mongoose.Document {
  jobId: string;
  url: string;
  status: JobStatus;
  scheduledAt: number;
  createdAt: number;
}
