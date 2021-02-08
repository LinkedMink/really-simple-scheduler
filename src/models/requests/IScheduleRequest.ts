export interface IScheduleRequest<T = unknown> {
  type: string;
  parameters?: T;
}
