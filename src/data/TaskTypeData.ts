import { Logger } from "../infastructure/Logger";
import { ITaskType, TaskType } from "../models/database/TaskType";
import { IPermissionClaim } from "../models/database/PermissionClaim";
import { Model, Schema } from "mongoose";
import { ITask, Task } from "../models/database/Task";
import { createTaskDataStructures, ITaskDataStructures } from "./DataStructureFactory";
import { TaskEvent, TaskEventDispatch } from "./TaskEvents";

export class TaskTypeData {
  private static instance: TaskTypeData;
  private readonly logger = Logger.get(TaskTypeData.name);
  private permissionMap = new Map<string, string>();
  private typeMap = new Map<string, ITaskType>();
  private modelMap = new Map<string, Model<ITask>>();
  private taskMap = new Map<string, ITaskDataStructures<ITask>>();
  private _isInitialized = false;

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  static get(): TaskTypeData {
    if (TaskTypeData.instance) {
      return TaskTypeData.instance;
    }

    TaskTypeData.instance = new TaskTypeData();
    return TaskTypeData.instance;
  }

  get permissions(): Map<string, string> {
    return this.permissionMap;
  }

  get types(): Map<string, ITaskType> {
    return this.typeMap;
  }

  get models(): Map<string, Model<ITask>> {
    return this.modelMap;
  }

  get tasks(): Map<string, ITaskDataStructures<ITask>> {
    return this.taskMap;
  }

  async load(): Promise<TaskEventDispatch> {
    this.logger.verbose(`Loading ${TaskType.name} - Start`);

    const taskDispatch = new TaskEventDispatch();
    const taskTypes = await TaskType.find().exec();
    const initTaskData = taskTypes.map(async t => {
      this.typeMap.set(t.name, t);

      this.setPermissionMap(t.name, t.permissions as IPermissionClaim);

      const discriminatedT = Task.discriminator<ITask>(
        t.name,
        new Schema({}, { discriminatorKey: "taskTypeName" })
      );
      this.modelMap.set(t.name, discriminatedT);

      const dataStructures = await createTaskDataStructures(discriminatedT);
      taskDispatch.register(t.name, dataStructures);
      this.taskMap.set(t.name, dataStructures);
    });

    await Promise.all(initTaskData);

    this._isInitialized = true;
    this.logger.verbose(`Loading ${TaskType.name} End`);

    return taskDispatch;
  }

  private setPermissionMap = (name: string, perm: IPermissionClaim) => {
    if (perm.baseClaimName) {
      this.permissionMap.set(name + "Read", perm.baseClaimName + "Read");
      this.permissionMap.set(name + "Schedule", perm.baseClaimName + "Schedule");
      this.permissionMap.set(name + "Manage", perm.baseClaimName + "Manage");
    } else {
      if (perm.readClaim) this.permissionMap.set(name + "Read", perm.readClaim);
      if (perm.scheduleClaim) this.permissionMap.set(name + "Schedule", perm.scheduleClaim);
      if (perm.manageClaim) this.permissionMap.set(name + "Manage", perm.manageClaim);
    }
  };
}
