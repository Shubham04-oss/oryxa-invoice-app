// Background Job Queue - In-memory with optional Redis/Upstash

import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const jobEmitter = new EventEmitter();

// In-memory queue (for prototype - replace with Redis/BullMQ for production)
const jobQueue = [];
const processingJobs = new Map();

/**
 * Enqueue a new job
 */
export async function enqueueJob({ type, payload, priority = 'normal', maxRetries = 3 }) {
  const jobId = `job_${randomUUID()}`;
  
  const job = {
    id: jobId,
    type,
    payload,
    priority,
    maxRetries,
    attempts: 0,
    status: 'pending',
    createdAt: new Date(),
  };

  // Save to database
  await prisma.jobHistory.create({
    data: {
      jobId,
      jobType: type,
      status: 'pending',
      payload,
      maxRetries,
      entityType: payload.invoiceId ? 'invoice' : null,
      entityId: payload.invoiceId || null,
    },
  });

  // Add to in-memory queue
  if (priority === 'high') {
    jobQueue.unshift(job);
  } else {
    jobQueue.push(job);
  }

  // Emit job added event
  jobEmitter.emit('job:added', job);

  console.log(`[Queue] Job ${jobId} (${type}) enqueued with ${priority} priority`);

  return jobId;
}

/**
 * Get next job from queue
 */
export function getNextJob() {
  return jobQueue.shift();
}

/**
 * Mark job as processing
 */
export async function startProcessing(jobId) {
  processingJobs.set(jobId, new Date());
  
  await prisma.jobHistory.update({
    where: { jobId },
    data: {
      status: 'processing',
      startedAt: new Date(),
      attempts: { increment: 1 },
    },
  });
}

/**
 * Mark job as completed
 */
export async function completeJob(jobId, result) {
  processingJobs.delete(jobId);
  
  await prisma.jobHistory.update({
    where: { jobId },
    data: {
      status: 'completed',
      result,
      completedAt: new Date(),
    },
  });

  console.log(`[Queue] Job ${jobId} completed successfully`);
}

/**
 * Mark job as failed
 */
export async function failJob(jobId, error) {
  processingJobs.delete(jobId);
  
  const jobRecord = await prisma.jobHistory.findUnique({
    where: { jobId },
  });

  if (jobRecord && jobRecord.attempts < jobRecord.maxRetries) {
    // Retry the job
    await prisma.jobHistory.update({
      where: { jobId },
      data: {
        status: 'pending',
        error: error.message,
      },
    });

    console.log(`[Queue] Job ${jobId} failed, will retry (attempt ${jobRecord.attempts + 1}/${jobRecord.maxRetries})`);
  } else {
    // Max retries reached
    await prisma.jobHistory.update({
      where: { jobId },
      data: {
        status: 'failed',
        error: error.message,
        completedAt: new Date(),
      },
    });

    console.error(`[Queue] Job ${jobId} failed permanently:`, error.message);
  }
}

/**
 * Get job status
 */
export async function getJobStatus(jobId) {
  return prisma.jobHistory.findUnique({
    where: { jobId },
  });
}

/**
 * Subscribe to job events
 */
export function onJobAdded(callback) {
  jobEmitter.on('job:added', callback);
}

export function onJobCompleted(callback) {
  jobEmitter.on('job:completed', callback);
}

export function onJobFailed(callback) {
  jobEmitter.on('job:failed', callback);
}

/**
 * Get queue statistics
 */
export function getQueueStats() {
  return {
    pending: jobQueue.length,
    processing: processingJobs.size,
    timestamp: new Date(),
  };
}

// ============================================
// OPTIONAL: Redis/Upstash Queue (Production)
// ============================================

/**
 * Initialize Redis queue (when UPSTASH_REDIS_URL is set)
 * Uncomment and install required packages: npm install ioredis bullmq
 */

// import Redis from 'ioredis';
// import { Queue, Worker } from 'bullmq';
//
// let redisQueue = null;
//
// export function initializeRedisQueue() {
//   if (!process.env.UPSTASH_REDIS_URL) {
//     console.log('[Queue] Using in-memory queue (set UPSTASH_REDIS_URL for Redis)');
//     return;
//   }
//
//   const connection = new Redis(process.env.UPSTASH_REDIS_URL, {
//     maxRetriesPerRequest: null,
//   });
//
//   redisQueue = new Queue('oryxa-jobs', { connection });
//
//   console.log('[Queue] Redis queue initialized');
// }
//
// export async function enqueueJobRedis({ type, payload, priority = 'normal' }) {
//   if (!redisQueue) {
//     throw new Error('Redis queue not initialized');
//   }
//
//   const job = await redisQueue.add(type, payload, {
//     priority: priority === 'high' ? 1 : priority === 'low' ? 3 : 2,
//     attempts: 3,
//     backoff: {
//       type: 'exponential',
//       delay: 2000,
//     },
//   });
//
//   return job.id;
// }
