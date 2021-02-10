import { AgingCacheReplacementPolicy, AgingCacheWriteMode, createAgingCache, MemoryStorageProvider, StorageHierarchy } from "@linkedmink/multilevel-aging-cache";
import { getDefaultOptions, MongooseProvider, MongooseSerializer } from "@linkedmink/multilevel-aging-cache-mongoose";
import { Model, Types } from "mongoose";
import { createRedisStorageProvider } from "../infastructure/Redis";
import { ITask, TaskStatus } from "../models/database/Task";
import { RunningTaskSet } from "./RunningTaskSet";
import { TaskQueue } from "./TaskQueue";

export interface ITaskDataStructures<T extends ITask> {
  runningSet: RunningTaskSet<T>,
  scheduledQueue: TaskQueue<T>,
  suspendedQueue: TaskQueue<T>
}

const appPrefix = 'rss'

const getTaskCacheByState = <T extends ITask>(model: Model<T>, state: TaskStatus) => {
  const keyPrefix = `${appPrefix}-${model.modelName}-${state}`;
  const channelName = `${keyPrefix}-Publish`
  const valueSerializer = new MongooseSerializer(model)
  const redisProvider = createRedisStorageProvider(keyPrefix, valueSerializer, channelName);

  const hierarchy = new StorageHierarchy([
    new MemoryStorageProvider<Types.ObjectId, T>(),
    redisProvider,
    new MongooseProvider(model, getDefaultOptions())
  ]);

  return createAgingCache(hierarchy, {
    purgeInterval: 60,
    replacementPolicy: AgingCacheReplacementPolicy.FIFO,
    setMode: AgingCacheWriteMode.OverwriteAged,
    deleteMode: AgingCacheWriteMode.OverwriteAged,
    evictAtLevel: 1
  })
}

export const createTaskDataStructures = <T extends ITask>(model: Model<T>): ITaskDataStructures<T> => {
  const runningSet = new RunningTaskSet(getTaskCacheByState(model, TaskStatus.Running));
  const scheduledQueue = new TaskQueue(getTaskCacheByState(model, TaskStatus.Scheduled));
  const suspendedQueue = new TaskQueue(getTaskCacheByState(model, TaskStatus.Suspended));

  return {
    runningSet,
    scheduledQueue,
    suspendedQueue
  }
}
