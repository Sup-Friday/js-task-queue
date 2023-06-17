/**
 * The unique ID of the task
 */
export type TaskId = string | number;
/**
 * The status of the task
 */
export type TaskStatus = 'idle' | 'running' | 'success' | 'error';
/**
 * The unique ID of the queue
 */
export type QueueId = number;
/**
 * Promise resolver
 */
export type Resolve<ReturnType> = (value: ReturnType) => void;
/**
 * Promise rejecter
 */
export type Reject = (error: Error) => void;
/**
 * Task status changes handler
 */
export type TaskStatusUpdateHandler<ReturnType = any> = (
  status: TaskStatus,
  task: Task<ReturnType>,
) => void;
/**
 * Pending task prioritization mode
 */
export type TaskPrioritizationMode =
  | 'head'
  | 'tail'
  | 'head-with-truncation'
  | 'tail-with-truncation';
/**
 * The task object
 */
export interface Task<ReturnType = any> {
  taskId: TaskId;
  status: TaskStatus;
  callback: () => ReturnType | Promise<ReturnType>;
  onStatusUpdate?: TaskStatusUpdateHandler<ReturnType>;
  createdAt: number;
  queueId?: QueueId;
  result?: ReturnType;
  error?: Error;
  runAt?: number;
  finishedAt?: number;
}
/**
 * The waited task object, which has not been executed
 */
export interface WaitedTask<ReturnType = any> extends Task<ReturnType> {
  resolve: Resolve<ReturnType>;
  reject: Reject;
  promise: Promise<ReturnType>;
}
/**
 * Promise queue to schedule and execute the tasks
 */
export interface PromiseQueue {
  queueId: QueueId;
  promise: Promise<any>;
  length: number;
  taskIds: Array<TaskId>;
}
/**
 * Check if the given object is TaskId
 * @param obj - Any object
 */
export const isTaskId = (obj: any): obj is TaskId => {
  if (typeof obj === 'string' || typeof obj === 'number') {
    return true;
  }
  return false;
};
/**
 * Check if the given object is WaitedTask
 * @param obj - Any object
 */
export const isWaitedTask = (obj: any): obj is WaitedTask => {
  if (obj.resolve && obj.promise) {
    return true;
  }
  return false;
};
