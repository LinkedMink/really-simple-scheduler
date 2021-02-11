import {
  AgingCacheReplacementPolicy,
  AgingCacheWriteMode,
  createAgingCache,
  MemoryStorageProvider,
  StorageHierarchy,
} from "@linkedmink/multilevel-aging-cache";
import {
  getDefaultOptions,
  MongooseProvider,
  MongooseSerializer,
} from "@linkedmink/multilevel-aging-cache-mongoose";
import { FilterQuery, Model, Types } from "mongoose";
import { createRedisStorageProvider } from "../infastructure/Redis";
import { ITask, TaskStatus } from "../models/database/Task";
import { RunningTaskSet } from "./RunningTaskSet";
import { TaskQueue } from "./TaskQueue";

export interface ITaskDataStructures<T extends ITask> {
  runningSet: RunningTaskSet<T>;
  scheduledQueue: TaskQueue<T>;
  suspendedQueue: TaskQueue<T>;
}

interface IKeyValue<T> {
  key: Types.ObjectId;
  val: T;
}

const appPrefix = "rss";

const getLowerLevelProviders = <T extends ITask>(model: Model<T>, state: TaskStatus) => {
  const keyPrefix = `${appPrefix}-${model.modelName}-${state}`;
  const channelName = `${keyPrefix}-Publish`;
  const valueSerializer = new MongooseSerializer(model);
  const redisProvider = createRedisStorageProvider(keyPrefix, valueSerializer, channelName);

  return [new MemoryStorageProvider<Types.ObjectId, T>(), redisProvider];
};

const getRunningCacheByState = <T extends ITask>(model: Model<T>) => {
  const levels = getLowerLevelProviders(model, TaskStatus.Running);
  levels.push(new MongooseProvider(model, getDefaultOptions()));
  const hierarchy = new StorageHierarchy(levels);

  return createAgingCache(hierarchy, {
    maxEntries: undefined,
    ageLimit: undefined,
    purgeInterval: 60,
    replacementPolicy: AgingCacheReplacementPolicy.FIFO,
    setMode: AgingCacheWriteMode.OverwriteAged,
    deleteMode: AgingCacheWriteMode.OverwriteAged,
  });
};

const getQueueCacheByState = async <T extends ITask>(
  model: Model<T>,
  state: TaskStatus,
  preloaded: IKeyValue<T>[]
) => {
  const hierarchy = new StorageHierarchy(getLowerLevelProviders(model, state));

  const cache = createAgingCache(hierarchy, {
    maxEntries: undefined,
    ageLimit: undefined,
    purgeInterval: 60,
    replacementPolicy: AgingCacheReplacementPolicy.FIFO,
    setMode: AgingCacheWriteMode.OverwriteAged,
    deleteMode: AgingCacheWriteMode.OverwriteAged,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await cache.load(preloaded as any);

  return cache;
};

export const createTaskDataStructures = async <T extends ITask>(
  model: Model<T>
): Promise<ITaskDataStructures<T>> => {
  const runningSet = new RunningTaskSet(getRunningCacheByState(model));

  const scheduledQuery = ({ status: TaskStatus.Scheduled } as unknown) as FilterQuery<T>;
  const scheduled = (await model.find(scheduledQuery).exec()).map(t => ({
    key: t._id as Types.ObjectId,
    val: t,
  }));
  const scheduledCache = await getQueueCacheByState(model, TaskStatus.Scheduled, scheduled);
  const scheduledQueue = new TaskQueue(scheduledCache);

  const suspendedQuery = ({ status: TaskStatus.Suspended } as unknown) as FilterQuery<T>;
  const suspended = (await model.find(suspendedQuery).exec()).map(t => ({
    key: t._id as Types.ObjectId,
    val: t,
  }));
  const suspendedCache = await getQueueCacheByState(model, TaskStatus.Suspended, suspended);
  const suspendedQueue = new TaskQueue(suspendedCache);

  return {
    runningSet,
    scheduledQueue,
    suspendedQueue,
  };
};
