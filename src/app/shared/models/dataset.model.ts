export enum DatasetConfigStatus {
  NOT_STARTED = 'NOT_STARTED',
  OPENED = 'OPENED',
  SAVED = 'SAVED'
}

export interface DatasetState {
  id: string;
  status: DatasetConfigStatus;
}

export interface ReportState {
  reportId: string;
  billingSelected: boolean;
  transactionCode: string | null;
  datasets: DatasetState[];
}
