import TaskQueue from '../src';
import { expect, it } from '@jest/globals';
import { delay } from './utils';

describe('TaskQueue Prioritization Mode', () => {
  it('handles head prioritization mode', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'head',
    });
    const results: Array<string> = [];

    queue.stop();
    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task3');
    });
    queue.addTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task3', 'task1', 'task2', 'task4']);

    queue.addTask(async () => {
      results.push('task5');
    });
    queue.addTask(async () => {
      results.push('task6');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task7');
    });
    await delay();
    expect(results).toEqual([
      'task3',
      'task1',
      'task2',
      'task4',
      'task5',
      'task7',
      'task6',
    ]);
  });

  it('handles tail prioritization mode for normal tasks', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'tail',
    });

    const results: Array<string> = [];

    // Tail mode should stop the queue before the first task is executed, as the
    // first task added will be immediately executed (since it's at the tail at
    // that moment)
    queue.stop();
    queue.addTask(async () => {
      results.push('task1');
    });
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task3');
    });
    queue.addTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task3', 'task4', 'task2', 'task1']);

    queue.addTask(async () => {
      results.push('task5');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task6');
    });
    queue.addTask(async () => {
      results.push('task7');
    });
    await delay();
    expect(results).toEqual([
      'task3',
      'task4',
      'task2',
      'task1',
      'task5',
      'task6',
      'task7',
    ]);
  });

  it('handles head-with-truncation prioritization mode for normal tasks', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'head-with-truncation',
    });

    const results: Array<string> = [];

    queue.addTask(async () => {
      results.push('task1');
    });
    await delay();
    expect(results).toEqual(['task1']);

    queue.stop();
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task1', 'task4']);

    queue.addTask(async () => {
      results.push('task5');
    });
    await delay();
    expect(results).toEqual(['task1', 'task4', 'task5']);
  });

  it('handles head-with-truncation prioritization mode for prioritized tasks', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'head-with-truncation',
    });

    const results: Array<string> = [];

    queue.addPrioritizedTask(async () => {
      results.push('task1');
    });
    await delay();
    expect(results).toEqual(['task1']);

    queue.stop();
    queue.addPrioritizedTask(async () => {
      results.push('task2');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task3');
    });
    queue.addTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task1', 'task2']);

    queue.addPrioritizedTask(async () => {
      results.push('task5');
    });

    await delay();
    expect(results).toEqual(['task1', 'task2', 'task5']);
  });

  it('handles tail-with-truncation prioritization mode for normal tasks', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'tail-with-truncation',
    });

    const results: Array<string> = [];

    queue.addTask(async () => {
      results.push('task1');
    });
    await delay();
    expect(results).toEqual(['task1']);

    // Tail mode should stop the queue before the first task is executed, as the
    // first task added will be immediately executed (since it's at the tail at
    // that moment)
    queue.stop();
    queue.addTask(async () => {
      results.push('task2');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task3');
    });
    queue.addTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task1', 'task3']);

    queue.addTask(async () => {
      results.push('task5');
    });
    queue.addTask(async () => {
      results.push('task6');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task7');
    });

    await delay();
    expect(results).toEqual(['task1', 'task3', 'task5']);
  });

  it('handles tail-with-truncation prioritization mode for prioritized tasks', async () => {
    const queue = new TaskQueue({
      concurrency: 1,
      taskPrioritizationMode: 'tail-with-truncation',
    });

    const results: Array<string> = [];

    // Tail mode should stop the queue before the first task is executed, as the
    // first task added will be immediately executed (since it's at the tail at
    // that moment)
    queue.addPrioritizedTask(async () => {
      results.push('task1');
    });
    await delay();
    expect(results).toEqual(['task1']);

    queue.stop();
    queue.addPrioritizedTask(async () => {
      results.push('task2');
    });
    queue.addTask(async () => {
      results.push('task3');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task4');
    });
    queue.start();
    await delay();
    expect(results).toEqual(['task1', 'task4']);

    queue.addPrioritizedTask(async () => {
      results.push('task5');
    });
    queue.addTask(async () => {
      results.push('task6');
    });
    queue.addPrioritizedTask(async () => {
      results.push('task7');
    });

    await delay();
    expect(results).toEqual(['task1', 'task4', 'task5']);
  });
});
