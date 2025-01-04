import TaskQueue from '../src';
import { describe, expect, it } from '@jest/globals';
import { delay } from './utils';

const BASE_TIME_FACTOR = 100;

let promises: Array<Promise<any>> = [];

describe('TaskQueue Concurrency', () => {
  beforeEach(() => {
    promises = [];
  });

  afterEach(async () => {
    // Wait for all promises to finish before the next test case
    await Promise.all(promises);
  });

  it('handles high concurrency with mixed task durations', async () => {
    const queue = new TaskQueue({
      concurrency: 2,
    });

    const start = new Date().getTime();
    const results: Array<number> = [];
    const completionTimes: Array<number> = [];

    // Add tasks with different durations
    promises.push(
      queue.addTask(async () => {
        await delay(1 * BASE_TIME_FACTOR);
        results.push(1);
        completionTimes.push(
          Math.round((new Date().getTime() - start) / BASE_TIME_FACTOR),
        );
        return 'Task 1';
      }, 'task1'),
    );

    promises.push(
      queue.addTask(async () => {
        await delay(2 * BASE_TIME_FACTOR);
        results.push(2);
        completionTimes.push(
          Math.round((new Date().getTime() - start) / BASE_TIME_FACTOR),
        );
        return 'Task 2';
      }, 'task2'),
    );

    promises.push(
      queue.addTask(async () => {
        await delay(3 * BASE_TIME_FACTOR);
        results.push(3);
        completionTimes.push(
          Math.round((new Date().getTime() - start) / BASE_TIME_FACTOR),
        );
        return 'Task 3';
      }, 'task3'),
    );

    promises.push(
      queue.addTask(async () => {
        await delay(4 * BASE_TIME_FACTOR);
        results.push(4);
        completionTimes.push(
          Math.round((new Date().getTime() - start) / BASE_TIME_FACTOR),
        );
        return 'Task 4';
      }, 'task4'),
    );

    await Promise.all(promises);

    // Verify completion times
    expect(completionTimes[0]).toBeLessThanOrEqual(2); // Task 1 should complete within 2 time units
    expect(completionTimes[1]).toBeLessThanOrEqual(3); // Task 2 should complete within 3 time units
    expect(completionTimes[2]).toBeLessThanOrEqual(4); // Task 3 should complete within 4 time units
    expect(completionTimes[3]).toBeLessThanOrEqual(6); // Task 4 should complete within 6 time units

    expect(results).toEqual([1, 2, 3, 4]); // Results in order of completion
  });

  it('maintains max concurrency limit under load', async () => {
    const CONCURRENCY_LIMIT = 2;
    const queue = new TaskQueue({
      concurrency: CONCURRENCY_LIMIT,
    });

    const runningTasks = new Set();
    const maxConcurrent = { value: 0 };

    const createTask = (id: number) => async () => {
      runningTasks.add(id);
      maxConcurrent.value = Math.max(maxConcurrent.value, runningTasks.size);
      await delay(BASE_TIME_FACTOR);
      runningTasks.delete(id);
      return id;
    };

    // Add more tasks than concurrency limit
    const taskPromises = Array(6)
      .fill(null)
      .map((_, index) => queue.addTask(createTask(index), `task${index}`));

    await Promise.all(taskPromises);
    expect(maxConcurrent.value).toBeLessThanOrEqual(CONCURRENCY_LIMIT);
  });

  it('handles mixed priority tasks with concurrency', async () => {
    const queue = new TaskQueue({
      concurrency: 2,
      memorizeTasks: true,
    });

    queue.stop();

    const results: Array<string> = [];
    const start = new Date().getTime();

    // Add normal priority tasks
    promises.push(
      queue.addTask(async () => {
        await delay(2 * BASE_TIME_FACTOR);
        results.push('normal1');
        return 'normal1';
      }, 'task1'),
    );

    promises.push(
      queue.addTask(async () => {
        await delay(2 * BASE_TIME_FACTOR);
        results.push('normal2');
        return 'normal2';
      }, 'task2'),
    );

    // Add high priority task
    promises.push(
      queue.addPrioritizedTask(async () => {
        await delay(1 * BASE_TIME_FACTOR);
        results.push('high');
        return 'high';
      }, 'task3'),
    );

    queue.start();

    await Promise.all(promises);

    const executionTime = Math.round(
      (new Date().getTime() - start) / BASE_TIME_FACTOR,
    );
    expect(executionTime).toBe(3); // Should take 3 time units total
    expect(results).toContain('high'); // High priority task should be included
    expect(results.length).toBe(3); // All tasks should complete
    expect(results).toEqual(['high', 'normal1', 'normal2']);
  });

  it('handles concurrent tasks with immediate resolution', async () => {
    const queue = new TaskQueue({
      concurrency: 4,
      memorizeTasks: true,
    });

    const results: number[] = [];
    const promises = Array(8)
      .fill(null)
      .map((_, index) =>
        queue.addTask(async () => {
          results.push(index);
          return index;
        }, `task${index}`),
      );

    await Promise.all(promises);
    expect(results.length).toBe(8); // All tasks should complete
    expect(new Set(results).size).toBe(8); // All tasks should have unique results
  });

  it('handles concurrent error scenarios', async () => {
    const queue = new TaskQueue({
      concurrency: 2,
      stopOnError: true,
    });

    const results: string[] = [];
    const errors: Error[] = [];

    // Add mix of successful and failing tasks
    const promises = [
      queue.addTask(async () => {
        await delay(1 * BASE_TIME_FACTOR);
        results.push('success1');
        return 'success1';
      }, 'task1'),

      queue
        .addTask(async () => {
          await delay(1 * BASE_TIME_FACTOR);
          throw new Error('Task 2 failed');
        }, 'task2')
        .catch((e) => errors.push(e)),

      queue.addTask(async () => {
        await delay(2 * BASE_TIME_FACTOR);
        results.push('success3');
        return 'success3';
      }, 'task3'),
    ];

    await Promise.all(promises);
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Task 2 failed');
    expect(results).toEqual(['success1', 'success3']);
  });

  it('handles concurrent tasks with error returns', async () => {
    const queue = new TaskQueue({
      concurrency: 2,
      stopOnError: false, // Allow continuation after errors
    });

    const results: Array<string | Error> = [];

    // Add mix of successful and error-returning tasks
    const promises = [
      queue.addTask(async () => {
        await delay(1 * BASE_TIME_FACTOR);
        results.push('success1');
        return 'success1';
      }, 'task1'),

      queue.addTask(async () => {
        await delay(1 * BASE_TIME_FACTOR);
        const error = new Error('Task 2 failed');
        results.push(error);
        return error;
      }, 'task2'),

      queue.addTask(async () => {
        await delay(2 * BASE_TIME_FACTOR);
        results.push('success3');
        return 'success3';
      }, 'task3'),
    ];

    const taskResults = await Promise.all(promises);

    // Verify results
    expect(results.length).toBe(3);
    expect(results[0]).toBe('success1');
    expect(results[1]).toBeInstanceOf(Error);
    expect((results[1] as Error).message).toBe('Task 2 failed');
    expect(results[2]).toBe('success3');

    // Verify returned values
    expect(taskResults[0]).toBe('success1');
    expect(taskResults[1]).toBeInstanceOf(Error);
    expect((taskResults[1] as Error).message).toBe('Task 2 failed');
    expect(taskResults[2]).toBe('success3');
  });

  it('handles queue overflow with high concurrency', async () => {
    const TASK_COUNT = 20;
    const queue = new TaskQueue({
      concurrency: 3,
    });

    const executionOrder: number[] = [];
    const promises = Array(TASK_COUNT)
      .fill(null)
      .map((_, index) =>
        queue.addTask(async () => {
          await delay(Math.random() * BASE_TIME_FACTOR);
          executionOrder.push(index);
          return index;
        }, `task${index}`),
      );

    await Promise.all(promises);
    expect(executionOrder.length).toBe(TASK_COUNT);
    expect(new Set(executionOrder).size).toBe(TASK_COUNT);
  });

  it('maintains task order within same priority level', async () => {
    const queue = new TaskQueue({
      concurrency: 1, // Force sequential execution
      memorizeTasks: true,
    });

    const executionOrder: number[] = [];
    const promises = Array(5)
      .fill(null)
      .map((_, index) =>
        queue.addTask(async () => {
          await delay(BASE_TIME_FACTOR);
          executionOrder.push(index);
          return index;
        }, `task${index}`),
      );

    await Promise.all(promises);
    expect(executionOrder).toEqual([0, 1, 2, 3, 4]);
  });
});
