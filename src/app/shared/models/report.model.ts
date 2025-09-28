export interface Report {
  id: string;
  name: string;
  datasets: Dataset[];
}

export interface Dataset {
  id: string;
  name: string;
  config?: any;
}

export interface ReportState {
  reportId: string;
  billingTypeSelected: string | null;
  transactionCode: string | null;
  datasets?: Dataset[];
}
