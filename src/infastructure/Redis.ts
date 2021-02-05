import { ISerializer, StringSerializer } from "@linkedmink/multilevel-aging-cache";
import {
  RedisPubSubStorageProvider,
  IRedisStorageProviderOptions,
} from "@linkedmink/multilevel-aging-cache-ioredis";
import Redis from "ioredis";

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

const createRedisClient = (): Redis.Redis | Redis.Cluster => {
  const stringMode = config.getString(ConfigKey.RedisMode);
  const mode = stringMode as RedisMode;

  if (mode === RedisMode.Single) {
    const hostPort = config.getJson<IHostPort>(ConfigKey.RedisHosts);
    return new Redis(hostPort.port, hostPort.host);
  } else if (mode === RedisMode.Sentinel) {
    const group = config.getJson<ISentinelGroup>(ConfigKey.RedisHosts);
    return new Redis(group);
  } else if (mode === RedisMode.Cluster) {
    const hostArray = config.getJson<IHostPort[]>(ConfigKey.RedisHosts);
    return new Redis.Cluster(hostArray);
  } else {
    throw Error(`Unsupported RedisMode: ${stringMode}; Can be Single, Sentinel, or Cluster`);
  }
};

export const createRedisStorageProvider = <T>(
  serializer: ISerializer<T>
): RedisPubSubStorageProvider<string, T> => {
  const redisClient = createRedisClient();
  const redisChannel = createRedisClient();
  const redisOptions = {
    keyPrefix: config.getString(ConfigKey.RedisKeyPrefix),
    keySerializer: new StringSerializer(),
    valueSerializer: serializer,
  } as IRedisStorageProviderOptions<string, T>;

  return new RedisPubSubStorageProvider(redisClient, redisOptions, redisChannel);
};
