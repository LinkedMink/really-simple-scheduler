export interface IProgressModel<T = unknown> {
  completedRatio: number;
  estimatedCompletedBy?: Date;
  resultSample?: T;
}
