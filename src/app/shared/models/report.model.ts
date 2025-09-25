export interface Dataset {
  id: string;
  name: string;
  // outros campos que você use: ex: parâmetros de configuração
  config?: any;
}

export interface Report {
  id: string;
  name: string;
  datasets: Dataset[];
}
