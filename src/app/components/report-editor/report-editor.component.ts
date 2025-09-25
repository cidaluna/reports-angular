import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { DatasetConfigModalComponent } from '../dataset-config-modal/dataset-config-modal.component';
import { Report } from '../../shared/models/report.model';
import {
  ReportState,
  DatasetConfigStatus
} from '../../shared/models/dataset.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-editor',
  standalone: true,
  imports: [CommonModule, DatasetConfigModalComponent],
  templateUrl: './report-editor.component.html',
  styleUrl: './report-editor.component.scss'
})
export class ReportEditorComponent implements OnInit {
  reports: Report[] = [];
  reportStates: ReportState[] = [];

  modalVisible = false;
  modalReportId: string | null = null;
  modalDatasetId: string | null = null;

  // para controlar qual relatório está “ativo” (tab ou card)
  activeReportId: string | null = null;

  constructor(private readonly reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getReports().subscribe((reps) => {
      this.reports = reps;
      this.initializeReportStates(reps);

      if (reps.length > 0) {
        this.activeReportId = reps[0].id;
      }
    });
  }

  initializeReportStates(reports: Report[]): void {
    this.reportStates = reports.map(rep => ({
      reportId: rep.id,
      billingSelected: false,
      transactionCode: null,
      datasets: rep.datasets.map(ds => ({
        id: ds.id,
        status: DatasetConfigStatus.NOT_STARTED
      }))
    }));
  }

  onBillingSelected(reportId: string, value: any) {
    const rs = this.findReportState(reportId);
    if (rs) rs.billingSelected = true;
  }

  onTransactionCodeChanged(reportId: string, code: string) {
    const rs = this.findReportState(reportId);
    if (rs) rs.transactionCode = code;
  }

  onDatasetSaved(reportId: string, datasetId: string) {
    const rs = this.findReportState(reportId);
    const ds = rs?.datasets.find(d => d.id === datasetId);
    if (ds) {
      ds.status = DatasetConfigStatus.SAVED;
    }
  }

  isReportReady(reportId: string): boolean {
    const rs = this.findReportState(reportId);
    if (!rs) return false;
    const allDatasetsSaved = rs.datasets.every(d => d.status === DatasetConfigStatus.SAVED);
    const hasBilling = rs.billingSelected;
    const hasTransaction = !!rs.transactionCode;
    return hasBilling && hasTransaction && allDatasetsSaved;
  }

  areAllReportsReady(): boolean {
    return this.reportStates.every(rs => this.isReportReady(rs.reportId));
  }

  onAssociate(reportId: string) {
    const rs = this.findReportState(reportId);
    if (!rs) return;

    // monte o payload do que for necessário
    const payload = {
      billingSelected: rs.billingSelected,
      transactionCode: rs.transactionCode,
      datasets: rs.datasets.map(d => ({ id: d.id, status: d.status }))
    };

    this.reportService.associateReport(reportId, payload).subscribe(res => {
      console.log('Associado com sucesso', res);
      // talvez mostrar mensagem, bloquear edição, etc.
    });
  }

  // trocar aba / relatório ativo
  setActiveReport(reportId: string) {
    this.activeReportId = reportId;
  }

  private findReportState(reportId: string): ReportState | undefined {
    return this.reportStates.find(rs => rs.reportId === reportId);
  }


  isDatasetSaved(reportId: string, datasetId: string): boolean {
  const ds = this.findReportState(reportId)?.datasets.find(d => d.id === datasetId);
  return ds?.status === 'SAVED';
}


openDatasetModal(reportId: string, datasetId: string) {
  this.modalReportId = reportId;
  this.modalDatasetId = datasetId;
  this.modalVisible = true;

  // também marcar status como “OPENED” para mostrar que usuário abriu
  const rs = this.findReportState(reportId);
  const ds = rs?.datasets.find(d => d.id === datasetId);
  if (ds && ds.status === DatasetConfigStatus.NOT_STARTED) {
    ds.status = DatasetConfigStatus.OPENED;
  }
}
}
