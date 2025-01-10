<h1 align="center">simple-js-task-queue</h1>

<div align="center">
  A simple javascript/typesciprt tasks queue that supports dynamic concurrency control, designed by
  <a href="https://gravatar.com/shuosfeng/">Shuo Feng</a>
</div>

<br />

> ⚠️ **Deprecation Notice**: This package has been renamed to [`taskon`](https://www.npmjs.com/package/taskon). The `simple-js-task-queue` package is now in **legacy mode** and will no longer receive regular updates or feature improvements. Only **critical bug fixes** will be applied to this package if any **major bugs** are found.

## Migration Guide

To migrate to `taskon`, follow these simple steps:

1. Install the new package:

```bash
yarn add taskon
# or
npm install taskon
```

2. Update your imports:

```diff
- import { TaskQueue } from 'simple-js-task-queue';
+ import { TaskQueue } from 'taskon';
```

That's it! No other code changes are needed as `taskon` maintains full API compatibility.

<br />

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Demo](#demo)
- [Usage](#usage)
- [API Reference](#api-reference)
- [License](#license)

## Introduction

This lightweight, error-tolerant, no-dependency library provides a sophisticated taks queue management system designed for TypeScript and JavaScript applications, providing advanced functionalities for managing, executing, and monitoring synchronous and asynchronous tasks.

## Features

- **Advanced Task Management**: Efficiently manage tasks with customizable priorities and statuses.
- **Concurrency Control**: Fine-tune the execution of tasks with dynamic concurrency settings.
- **Error Handling**: Comprehensive options for error management including retry mechanisms.
- **Integrated Logging**: Leverage built-in logging for easy monitoring and debugging.
- **Flexible Task Prioritization**: Utilize various prioritization strategies to control task execution order.

## Installation

```bash
yarn add simple-js-task-queue
```

Or

```bash
npm install simple-js-task-queue
```

## Demo

Check out [this codesanbox project](https://codesandbox.io/s/react-typescript-forked-knts9f)!

## Usage

Below is a simple example demonstrating how to use the `TaskQueue` to add and execute a task:

```typescript
import { TaskQueue } from 'simple-js-task-queue';

const queue = new TaskQueue();

queue
  .addTask(async () => {
    console.log('Performing a task...');
    // Task implementation
  })
  .then((result) => {
    console.log('Task completed.');
  });
```

## API Reference

### TaskQueue Class

The `TaskQueue` class is at the core of the library, offering a rich set of methods to manage tasks:

| Method Name                   | Description                                                                 | Parameters                             |
| ----------------------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `addTask`                     | Adds a new task to the queue.                                               | `callback, onStatusUpdate?, priority?` |
| `addPrioritizedTask`          | Adds a high-priority task to the queue.                                     | `callback, onStatusUpdate?`            |
| `addTasks`                    | Bulk addition of tasks.                                                     | `tasks`                                |
| `adjustConcurrency`           | Adjusts the number of tasks that can run concurrently, effective instantly. | `newConcurrency`                       |
| `start`                       | Starts or resumes task execution.                                           |                                        |
| `stop`                        | Pauses task execution.                                                      |                                        |
| `retry`                       | Retries failed tasks.                                                       |                                        |
| `subscribeTaskStatusChange`   | Subscribes to task status updates.                                          | `onTaskStatusUpdate`                   |
| `unsubscribeTaskStatusChange` | Unsubscribes from task status updates.                                      | `onTaskStatusUpdate`                   |
| `getTaskDetails`              | Fetches details of a specific task.                                         | `taskId`                               |
| `getAllTasksDetails`          | Retrieves details of all tasks, optionally filtered by status.              | `status?`                              |
| `getConcurrency`              | Fetches the concurrency of the task queue.                                  |                                        |
| `isManuallyStopped`           | Checks if the task queue is manually stopped.                               |                                        |
| `clearTaskDetails`            | Clears details of a specific task.                                          | `taskId`                               |
| `clearAllTasksDetails`        | Removes details of all tasks from memory.                                   |                                        |
| `clearFailedRetryableTasks`   | Clears the list of failed tasks marked for retry.                           |                                        |
| `clearWaitedTasks`            | Removes all tasks waiting to be executed.                                   |                                        |
| `removeFailedRetryableTask`   | Removes a specific task from the retry list.                                | `taskIdOrTask`                         |
| `removeWaitedTask`            | Removes a specific task from the waiting list.                              | `taskIdOrTask`                         |

## License

This library is [MIT licensed](./LICENSE.md).
