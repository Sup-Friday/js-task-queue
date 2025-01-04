import TaskQueue from '../src';
import { expect, it } from '@jest/globals';

describe('TaskQueue Prioritization Mode', () => {
  it('handles head prioritization mode', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'head',
    });

    const results: Array<string> = [];

    // Add multiple tasks
    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task1', 'task2', 'task3']);

    queue.addTask(async () => {
      results.push('task4');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task1', 'task2', 'task3', 'task4']);
  });

  it('handles head-with-truncation prioritization mode', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'head-with-truncation',
    });

    const results: Array<string> = [];

    // Add multiple tasks
    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task1']);

    queue.addTask(async () => {
      results.push('task4');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task1', 'task4']);
  });

  it('handles tail prioritization mode', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'tail',
    });

    // Tail mode should stop the queue before the first task is executed, as the
    // first task added will be immediately executed (since it's at the tail at
    // that moment)
    queue.stop();

    const results: Array<string> = [];

    // Add multiple tasks
    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });

    queue.start();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task3', 'task2', 'task1']);

    queue.addTask(async () => {
      results.push('task4');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task3', 'task2', 'task1', 'task4']);
  });

  it('handles tail-with-truncation prioritization mode', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'tail-with-truncation',
    });

    // Tail mode should stop the queue before the first task is executed, as the
    // first task added will be immediately executed (since it's at the tail at
    // that moment)
    queue.stop();

    const results: Array<string> = [];

    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });

    queue.start();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task3']);

    queue.addTask(async () => {
      results.push('task4');
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(results).toEqual(['task3', 'task4']);
  });
});
