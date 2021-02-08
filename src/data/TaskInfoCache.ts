import { Logger } from "../infastructure/Logger";
import { ITaskType, TaskType } from "../models/database/TaskType";
import { IPermissionClaim } from "../models/database/PermissionClaim";
import {
  AgingCacheWriteMode,
  AgingCacheReplacementPolicy,
  IAgingCacheOptions,
  MemoryStorageProvider,
  StorageHierarchy,
  createAgingCache,
} from "@linkedmink/multilevel-aging-cache";

const setPermissionMap = (map: Map<string, string>, name: string, perm: IPermissionClaim) => {
  if (perm.baseClaimName) {
    map.set(name + "Read", perm.baseClaimName + "Read");
    map.set(name + "Schedule", perm.baseClaimName + "Schedule");
    map.set(name + "Manage", perm.baseClaimName + "Manage");
  } else {
    if (perm.readClaim) map.set(name + "Read", perm.readClaim);
    if (perm.scheduleClaim) map.set(name + "Schedule", perm.scheduleClaim);
    if (perm.manageClaim) map.set(name + "Manage", perm.manageClaim);
  }
};

export class TaskInfoCache {
  private static instance: TaskInfoCache;
  private readonly logger = Logger.get(TaskInfoCache.name);
  private _permissionMap = new Map<string, string>();
  private _typeMap = new Map<string, ITaskType>();
  private _isInitialized = false;

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  static async get(): Promise<TaskInfoCache> {
    if (TaskInfoCache.instance) {
      return TaskInfoCache.instance;
    }

    TaskInfoCache.instance = new TaskInfoCache();
    await TaskInfoCache.instance.load();
    return TaskInfoCache.instance;
  }

  get permissionMap(): Map<string, string> {
    return this._permissionMap;
  }

  get typeMap(): Map<string, ITaskType> {
    return this._typeMap;
  }

  async load(): Promise<void> {
    this.logger.verbose(`Loading ${TaskType.name} - Start`);

    const taskTypes = await TaskType.find().exec();
    taskTypes.forEach(t => {
      this._typeMap.set(t.name, t);
      setPermissionMap(this._permissionMap, t.name, t.permissions as IPermissionClaim);
    });

    this._isInitialized = true;

    this.logger.verbose(`Loading ${TaskType.name} End`);
  }
}
