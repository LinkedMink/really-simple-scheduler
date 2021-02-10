import { ISerializer, IStorageProvider } from "@linkedmink/multilevel-aging-cache";
import {
  RedisPubSubProvider,
  IRedisProviderOptions,
  RedisProvider,
} from "@linkedmink/multilevel-aging-cache-ioredis";
import { ObjectIdSerializer } from "@linkedmink/multilevel-aging-cache-mongoose";
import Redis from "ioredis";
import { Types } from "mongoose";

import { config } from "./Config";
import { ConfigKey } from "./ConfigKey";

export enum RedisMode {
  Single = "Single",
  Sentinel = "Sentinel",
  Cluster = "Cluster",
}

interface IHostPort {
  host: string;
  port: number;
}

interface ISentinelGroup {
  sentinels: IHostPort[];
  name: string;
}

const createRedisClient = (keyPrefix: string): Redis.Redis | Redis.Cluster => {
  const stringMode = config.getString(ConfigKey.RedisMode);
  const mode = stringMode as RedisMode;

  if (mode === RedisMode.Single) {
    const hostPort = config.getJson<IHostPort>(ConfigKey.RedisHosts);
    return new Redis(hostPort.port, hostPort.host, { keyPrefix });
  } else if (mode === RedisMode.Sentinel) {
    const group = config.getJson<ISentinelGroup>(ConfigKey.RedisHosts);
    return new Redis({ ...group, keyPrefix });
  } else if (mode === RedisMode.Cluster) {
    const hostArray = config.getJson<IHostPort[]>(ConfigKey.RedisHosts);
    return new Redis.Cluster(hostArray, { redisOptions: { keyPrefix }});
  } else {
    throw Error(`Unsupported RedisMode: ${stringMode}; Can be Single, Sentinel, or Cluster`);
  }
};

export const createRedisStorageProvider = <T>(
  keyPrefix: string,
  valueSerializer: ISerializer<T>,
  channelName?: string
): IStorageProvider<Types.ObjectId, T> => {
  const redisOptions = {
    keyPrefix,
    keySerializer: new ObjectIdSerializer(),
    valueSerializer,
    channelName,
    isPersistable: false
  } as IRedisProviderOptions<Types.ObjectId, T>;

  return channelName
    ? new RedisPubSubProvider(createRedisClient(keyPrefix), createRedisClient(keyPrefix), redisOptions)
    : new RedisProvider(createRedisClient(keyPrefix), redisOptions);
};
